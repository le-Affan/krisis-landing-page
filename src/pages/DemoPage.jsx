import { useEffect, useState, useRef } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

const BASE_URL = "http://localhost:8000";



function getInsightMessage(results, decision) {
  if (!results || !decision) return null;
  const { difference, confidence_interval } = results;
  if (!confidence_interval) return null;

  const ciLow = confidence_interval[0];
  const ciHigh = confidence_interval[1];
  const includesZero = ciLow <= 0 && ciHigh >= 0;

  let feedback = "";
  if (!includesZero && decision === 'b') {
    feedback = "You made the right call based on real evidence.";
  } else if (includesZero && decision === 'a') {
    feedback = "You made the right call based on real evidence.";
  } else {
    feedback = "This is exactly how teams ship regressions when relying only on offline metrics.";
  }

  if (includesZero && difference > 0 && ciHigh > 0.05 && ciLow > -0.02) {
    return {
      title: "Borderline Result",
      text: "The improvement is small and uncertain. More data is needed before making a decision.",
      feedback,
      color: "text-primary",
      icon: "info"
    };
  } else if (includesZero) {
    return {
      title: "Misleading Offline Metrics",
      text: "The improvement seen offline does NOT hold under real traffic. Deploying Model B would be risky.",
      feedback,
      color: "text-on-surface-variant",
      icon: "warning"
    };
  } else {
    return {
      title: "Model B truly performs better",
      text: "Model B is truly better under real traffic. You can safely deploy Model B.",
      feedback,
      color: "text-tertiary",
      icon: "check_circle"
    };
  }
}

export default function DemoPage() {
  // --- Setup state ---
  const [phase, setPhase] = useState("setup"); // "setup" | "running" | "done"
  const [offlineImprovement, setOfflineImprovement] = useState(11);
  const sampleSize = 500;
  const trafficSplit = 50;

  // --- Simulation state ---
  const [loadingMessage, setLoadingMessage] = useState("");
  const [results, setResults] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [iteration, setIteration] = useState(0);
  const [currentExpId, setCurrentExpId] = useState("");
  const [userDecision, setUserDecision] = useState(null);
  const activeRef = useRef(false);

  const probA = 0.5;
  let probB = 0.5 + (offlineImprovement / 100);

  // Ensure bands are clamped strictly as ordered
  if (offlineImprovement <= 4) {
    probB = Math.min(probB, 0.53);
  } else if (offlineImprovement <= 9) {
    probB = Math.min(probB, 0.58);
  } else {
    probB = Math.min(probB, 0.65);
  }
  if (offlineImprovement <= 4) {
    probB = Math.min(probB, 0.53);
  } else if (offlineImprovement <= 9) {
    probB = Math.min(probB, 0.58);
  } else {
    probB = Math.min(probB, 0.65);
  }

  // --- Run simulation when phase transitions to "running" ---
  useEffect(() => {
    if (phase !== "running") return;

    activeRef.current = true;
    let iter = 0;

    let localCountA = 0;
    let localCountB = 0;
    let localSumA = 0;
    let localSumB = 0;

    const expId = `exp_${Date.now()}`;
    setCurrentExpId(expId);

    const runSimulationLoop = async () => {
      console.log("--- EXPERIMENT STARTED ---");
      console.log("Offline Improvement:", offlineImprovement + "%");
      console.log("Assigned probA:", probA);
      console.log("Assigned probB:", probB);

      setLoadingMessage("Initializing experiment on backend...");

      try {
        await fetch(`${BASE_URL}/api/v1/experiments`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            experiment_id: expId,
            model_a_id: "model_a",
            model_b_id: "model_b",
            probability_split: trafficSplit / 100.0
          })
        });
      } catch (e) {
        console.error("Failed to create experiment mapping. Continuing anyway...", e);
      }

      setLoadingMessage("");

      while (activeRef.current && iter < sampleSize) {
        iter++;
        setIteration(iter);
        try {
          const predictRes = await fetch(`${BASE_URL}/api/v1/predict`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              experiment_id: expId,
              features: { x: iter }
            })
          });

          if (!predictRes.ok) throw new Error(`Predict API failed with status ${predictRes.status}`);
          const predictData = await predictRes.json();
          const requestId = predictData.request_id;

          console.log("Predict response:", predictData);

          // Robustly parse the model variant since backend keys may vary
          const variantObj = predictData.model_variant || predictData.model_id || predictData.variant || "a";
          const variantStr = String(variantObj).toLowerCase();

          const isModelB = variantStr.includes('b') || variantStr.includes('treatment');
          console.log("Detected variant:", variantStr, "isModelB:", isModelB);

          const probability = isModelB ? probB : probA;
          console.log("Using probability:", probability);

          const outcomeValue = Math.random() < probability ? 1 : 0;
          console.log("Generated outcome:", outcomeValue);

          if (isModelB) {
            localCountB++;
            localSumB += outcomeValue;
          } else {
            localCountA++;
            localSumA += outcomeValue;
          }

          const meanA = localCountA > 0 ? localSumA / localCountA : 0;
          const meanB = localCountB > 0 ? localSumB / localCountB : 0;
          const localDiff = meanB - meanA;

          if (iter % 5 === 0 || iter === sampleSize) {
            setChartData(prev => [...prev, { step: iter, value: localDiff }]);
          }

          if (requestId) {
            const outcomeRes = await fetch(`${BASE_URL}/api/v1/outcomes`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                request_id: requestId,
                value: outcomeValue
              })
            });
            if (!outcomeRes.ok) throw new Error(`Outcome API failed with status ${outcomeRes.status}`);
          }

          const resultsRes = await fetch(`${BASE_URL}/api/v1/experiments/${expId}/results`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
          });

          if (resultsRes.ok) {
            const resultsData = await resultsRes.json();
            setResults(resultsData);

            if (iter === sampleSize) {
              console.log("--- SIMULATION FINISHED ---");
              console.log("sample_size_a:", resultsData.sample_size_a);
              console.log("sample_size_b:", resultsData.sample_size_b);
              console.log("final CI:", resultsData.confidence_interval);
            }
          }

        } catch (error) {
          console.error("API request failed during simulation loop:", error);
        }

        const finalDelay = 18000 / sampleSize;
        await new Promise(resolve => setTimeout(resolve, finalDelay));
      }

      if (activeRef.current) {
        setPhase("done");
      }
    };

    runSimulationLoop();

    return () => {
      activeRef.current = false;
    };
  }, [phase, sampleSize, trafficSplit, probA, probB]);

  const handleStart = () => {
    setResults(null);
    setChartData([]);
    setIteration(0);
    setLoadingMessage("");
    setUserDecision(null);
    setPhase("running");
  };

  const insight = getInsightMessage(results, userDecision);
  const isActive = phase === "running" || phase === "done";
  const progressPct = sampleSize > 0 ? iteration / sampleSize : 0;

  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <Navbar />
      <main className="flex-1 flex flex-col items-center pt-20 px-8 pb-20">
        <div className="w-full max-w-7xl mx-auto">

          {/* Context Header */}
          {phase === "setup" && (
            <div className="text-center mb-12">
              <h1 className="text-[3rem] font-bold tracking-[-0.03em] text-on-surface">Krisis in Action!</h1>
              <p className="text-xl text-primary font-semibold mb-3">Test if offline improvements hold in real traffic</p>
            </div>
          )}

          {/* ===== SETUP PANEL ===== */}
          {phase === "setup" && (
            <div className="max-w-2xl mx-auto mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="bg-surface-container-high border border-outline-variant/20 rounded-2xl p-8 space-y-10">
                <h2 className="text-xl font-bold text-on-surface mb-2">Configure Your Experiment</h2>

                {/* Offline Improvement */}
                <div>
                  <label className="block text-sm font-semibold text-on-surface-variant mb-4">
                    Set offline improvement estimate: <span className="text-primary font-bold">+{offlineImprovement}%</span>
                  </label>
                  <input
                    type="range"
                    min={1}
                    max={15}
                    value={offlineImprovement}
                    onChange={(e) => setOfflineImprovement(Number(e.target.value))}
                    className="w-full h-2 rounded-full appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, #c0c1ff ${((offlineImprovement - 1) / 14) * 100}%, #2d3449 ${((offlineImprovement - 1) / 14) * 100}%)`
                    }}
                  />
                  <div className="flex justify-between text-xs text-outline mt-2">
                    <span>1%</span>
                    <span>15%</span>
                  </div>
                </div>

                {/* Offline Result Card */}
                <div className="bg-surface-container border border-outline-variant/10 rounded-xl p-6 shadow-sm flex flex-col items-center justify-center text-center">
                  <h4 className="text-xs text-on-surface-variant font-bold uppercase tracking-wider mb-2">Offline Result</h4>
                  <p className="text-lg font-bold text-on-surface">Model B appears <span className="text-tertiary">{offlineImprovement}%</span> better based on test data</p>
                  <p className="text-xs text-outline mt-1 italic">Not validated on real users</p>
                </div>

                {/* Start Button */}
                <div className="mt-8 text-center pt-2">
                  <button
                    onClick={handleStart}
                    className="w-full kinetic-monolith-gradient text-on-primary-container px-8 py-5 rounded-2xl font-bold text-xl shadow-[0_0_40px_rgba(192,193,255,0.1)] hover:brightness-110 active:scale-95 transition-all"
                  >
                    Run Experiment
                  </button>
                  <p className="text-sm text-outline font-medium mt-4">Simulates real user traffic</p>
                </div>
              </div>
            </div>
          )}

          {/* ===== RUNNING CONFIG SUMMARY ===== */}
          {isActive && (
            <div className="text-center mb-8 animate-in fade-in duration-500">
              <div className="inline-flex items-center gap-3 bg-surface-container border border-outline-variant/15 rounded-full px-6 py-2 text-sm shadow-sm">
                <span className="text-on-surface-variant">Running Real-world Test</span>
                <span className="text-outline">|</span>
                <span className="text-on-surface font-semibold">Offline expectation: +{offlineImprovement}%</span>
              </div>
            </div>
          )}

          {/* Loading State */}
          {isActive && loadingMessage && (
            <div className="text-center mb-8">
              <p className="text-on-surface-variant animate-pulse text-lg">{loadingMessage}</p>
            </div>
          )}

          {/* ===== RESULTS DASHBOARD ===== */}
          {isActive && (
            <div className="space-y-12 animate-in fade-in duration-500">

              <div className="text-center pt-4">
                {phase === "running" && (
                   <div className="flex items-center justify-center gap-2 text-outline text-sm font-medium">
                     <div className="w-1.5 h-1.5 rounded-full bg-tertiary animate-pulse"></div>
                     <span>Simulation in progress...</span>
                     <span className="ml-2 font-mono">Iteration {iteration}/{sampleSize}</span>
                   </div>
                )}
                {phase === "done" && (
                   <p className="text-on-surface-variant font-medium">Simulation complete</p>
                )}
              </div>

              {/* Decision Prompt Before Insight */}
              {phase === "done" && !userDecision && (
                <div className="text-center bg-surface-container border border-outline-variant/30 rounded-2xl py-8 px-10 max-w-xl mx-auto shadow-xl animate-in zoom-in-95 duration-500">
                  <h3 className="text-2xl font-bold text-on-surface mb-6">What would you do?</h3>

                  {/* Dumbed Down Decision Guide */}
                  <div className="bg-surface-container-low border border-outline-variant/20 rounded-xl p-5 mb-8 text-left text-sm max-w-md mx-auto shadow-sm">
                    <p className="font-bold text-on-surface mb-3 uppercase tracking-wider text-[11px]">How to decide:</p>
                    <div className="space-y-3">
                      <div className="flex gap-3">
                        <span className="material-symbols-outlined text-tertiary text-[18px]">rule</span>
                        <p className="text-on-surface-variant leading-snug">Only deploy Model B if the confidence interval does <strong>NOT include 0</strong></p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                      onClick={() => setUserDecision('b')}
                      className="kinetic-monolith-gradient text-on-primary-container px-8 py-4 rounded-xl font-bold shadow-md hover:brightness-110 active:scale-95 transition-all text-lg"
                    >
                      Deploy Model B
                    </button>
                    <button
                      onClick={() => setUserDecision('a')}
                      className="bg-surface-container-highest border border-outline-variant/30 text-on-surface px-8 py-4 rounded-xl font-bold hover:bg-surface-bright active:scale-95 transition-all text-lg"
                    >
                      Keep Model A
                    </button>
                  </div>
                </div>
              )}

              {/* Final Insight Panel (Revealed after decision) */}
              {phase === "done" && userDecision && insight && (
                <div className="text-center bg-surface-container-high border-2 border-primary/20 rounded-2xl py-8 px-10 max-w-2xl mx-auto shadow-[0_0_40px_rgba(192,193,255,0.05)] animate-in zoom-in-95 duration-500">
                  <p className={`text-xl font-bold mb-6 border-b border-outline-variant/10 pb-6 ${insight.feedback.includes("wrong") || insight.feedback.includes("regressions") ? 'text-error/90' : 'text-tertiary'}`}>
                    {insight.feedback}
                  </p>
                  <span className="material-symbols-outlined text-[3rem] mb-4 block" style={{ fontVariationSettings: "'FILL' 1", color: insight.color === 'text-tertiary' ? '#4cd7f6' : 'currentColor' }}>
                    {insight.icon}
                  </span>
                  <h3 className="text-2xl font-bold text-on-surface mb-2">{insight.title}</h3>
                  <p className={`text-lg font-medium leading-relaxed ${insight.color}`}>{insight.text}</p>
                </div>
              )}

              {/* Context / Expectations */}
              <div className="flex flex-col items-center md:items-start bg-surface-container border border-outline-variant/10 rounded-2xl p-5 shadow-sm">
                <p className="text-sm font-medium text-on-surface-variant mb-1">
                  Offline expectation: <span className="text-on-surface font-bold">+{offlineImprovement}% improvement</span>
                </p>
                <div className="flex items-center gap-2">
                  <p className="text-lg font-bold text-tertiary">
                    Expected real-world range: <span className="text-primary">~{((probB - probA) * 100).toFixed(1)}%</span> <span className="text-outline text-sm font-normal">(before noise)</span>
                  </p>
                  <div className="group relative flex items-center">
                    <span className="material-symbols-outlined text-outline text-[16px] cursor-help">info</span>
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-surface-container-highest border border-outline-variant/20 rounded-xl text-xs text-on-surface shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 text-center">
                      Even if a model is truly better, small improvements may not be detectable due to randomness in real-world data.
                    </div>
                  </div>
                </div>
              </div>

              {/* Metrics Section */}
              <div className="grid md:grid-cols-4 gap-4">
                <div className="bg-surface-container p-4 rounded-2xl border border-outline-variant/10">
                  <div className="flex items-center gap-1 mb-1">
                    <h4 className="text-[13px] text-on-surface-variant font-medium">Model A Mean</h4>
                    <div className="group relative flex items-center">
                      <span className="material-symbols-outlined text-outline text-[14px] cursor-help">info</span>
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-surface-container-highest border border-outline-variant/20 rounded-xl text-[11px] text-on-surface shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 text-center">
                        Average performance of Model A on real users
                      </div>
                    </div>
                  </div>
                  <p className="text-xl font-bold text-on-surface">{results?.model_a_mean?.toFixed(4) || "0.0000"}</p>
                </div>
                <div className="bg-surface-container p-4 rounded-2xl border border-outline-variant/10">
                  <div className="flex items-center gap-1 mb-1">
                    <h4 className="text-[13px] text-on-surface-variant font-medium">Model B Mean</h4>
                    <div className="group relative flex items-center">
                      <span className="material-symbols-outlined text-outline text-[14px] cursor-help">info</span>
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-surface-container-highest border border-outline-variant/20 rounded-xl text-[11px] text-on-surface shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 text-center">
                        Average performance of Model B on real users
                      </div>
                    </div>
                  </div>
                  <p className="text-xl font-bold text-on-surface">{results?.model_b_mean?.toFixed(4) || "0.0000"}</p>
                </div>
                <div className="bg-surface-container p-4 rounded-2xl border border-outline-variant/10">
                  <div className="flex items-center gap-1 mb-1">
                    <h4 className="text-[13px] text-on-surface-variant font-medium">Observed Improvement</h4>
                    <div className="group relative flex items-center">
                      <span className="material-symbols-outlined text-outline text-[14px] cursor-help">info</span>
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-surface-container-highest border border-outline-variant/20 rounded-xl text-[11px] text-on-surface shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 text-center">
                        Observed difference between Model B and A
                      </div>
                    </div>
                  </div>
                  <p className="text-xl font-bold text-primary">{results?.difference > 0 ? "+" : ""}{results?.difference?.toFixed(4) || "0.0000"}</p>
                </div>
                <div className="bg-surface-container p-4 rounded-2xl border border-outline-variant/10">
                  <div className="flex items-center gap-1 mb-1">
                    <h4 className="text-[13px] text-on-surface-variant font-medium">Confidence Interval</h4>
                  </div>
                  <p className="text-lg font-bold text-on-surface">
                    {results?.confidence_interval ? `[${results.confidence_interval[0]?.toFixed(2)}, ${results.confidence_interval[1]?.toFixed(2)}]` : "..."}
                  </p>
                </div>
              </div>

              {/* Main Chart */}
              <div className="bg-surface-container-high border border-outline-variant/20 rounded-2xl p-8 shadow-xl">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-on-surface">Model Performance Difference Under Real Traffic</h3>
                  </div>
                  <div className="flex gap-4 text-sm font-medium">
                    <span className="bg-surface p-2 rounded-lg text-on-surface-variant">Samples A: <span className="text-on-surface">{results?.sample_size_a || 0}</span></span>
                    <span className="bg-surface p-2 rounded-lg text-on-surface-variant">Samples B: <span className="text-on-surface">{results?.sample_size_b || 0}</span></span>
                  </div>
                </div>
                <div className="h-80 w-full relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{ top: 10, right: 30, left: 10, bottom: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#464554" vertical={false} opacity={0.3} />
                      <XAxis dataKey="step" stroke="#908fa0" tick={{ fill: '#908fa0', fontSize: 12 }} label={{ value: 'Number of users (sample size)', position: 'bottom', offset: 0, fill: '#a7b6cc', fontSize: 13 }} />
                      <YAxis stroke="#908fa0" tick={{ fill: '#908fa0', fontSize: 12 }} domain={['auto', 'auto']} label={{ value: 'Effect size (B - A)', angle: -90, position: 'insideLeft', offset: -5, fill: '#a7b6cc', fontSize: 13, style: { textAnchor: 'middle' } }} />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#222a3d', borderColor: '#464554', borderRadius: '0.5rem', color: '#dae2fd' }}
                        itemStyle={{ color: '#c0c1ff' }}
                        labelStyle={{ color: '#a7b6cc', marginBottom: '0.25rem' }}
                      />
                      <ReferenceLine y={0} stroke="#464554" strokeDasharray="4 4" label={{ position: 'insideBottomRight', value: 'No difference', fill: '#908fa0', fontSize: 12 }} />
                      <Line
                        type="monotone"
                        dataKey="value"
                        name="Effect Size (Difference)"
                        stroke="#c0c1ff"
                        strokeWidth={3}
                        dot={false}
                        activeDot={{ r: 6, fill: '#8083ff' }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {/* Live Chart Interpretation */}
                <div className="mt-8 text-center animate-in fade-in duration-500">
                   <div className="inline-flex items-center gap-3 px-8 py-3 bg-surface-container border border-outline-variant/10 rounded-full shadow-sm text-sm font-semibold">
                     <span className="text-outline uppercase tracking-wider text-[11px]">Current signal:</span>
                     {results?.confidence_interval ? (
                        <>
                          {progressPct < 0.3
                            ? <span className="text-on-surface-variant flex items-center gap-2">No clear signal yet</span>
                            : progressPct < 0.7 && results.confidence_interval[0] <= 0 && results.confidence_interval[1] >= 0
                              ? <span className="text-on-surface flex items-center gap-2">Signal emerging</span>
                              : results.confidence_interval[0] > 0
                                ? <span className="text-tertiary flex items-center gap-2">Model B clearly better</span>
                                : results.confidence_interval[1] < 0
                                  ? <span className="text-error flex items-center gap-2">Model A clearly better</span>
                                  : <span className="text-on-surface flex items-center gap-2">No significant difference</span>}
                        </>
                     ) : (
                        <span className="text-outline italic">Analyzing traffic...</span>
                     )}
                   </div>
                </div>
              </div>

              {/* Post-Simulation Product Framing */}
              {phase === "done" && userDecision && (
                <div className="mt-16 animate-in fade-in slide-in-from-bottom-4 duration-700">

                  {/* Previous Core Lesson */}
                  <div className="text-center mb-16">
                    <p className="inline-block px-8 py-4 bg-error/5 border border-error/20 rounded-full text-lg text-on-surface font-bold tracking-wide shadow-md">
                      This is the gap between offline evaluation and production reality.
                    </p>
                  </div>

                  {/* Core Value Prop Section */}
                  <div className="max-w-4xl mx-auto bg-surface-container-low border border-outline-variant/20 rounded-3xl p-8 md:p-12 shadow-[0_0_50px_rgba(192,193,255,0.03)]">
                    <div className="text-center mb-12">
                      <h2 className="text-[2rem] font-bold text-on-surface mb-3 tracking-[-0.02em]">How this works in real systems</h2>
                      <p className="text-on-surface-variant max-w-xl mx-auto text-base">
                        Stop guessing with offline metrics. <br />Integrate Krisis directly into your ML lifecycle.
                      </p>
                    </div>

                    {/* Simple Text Architecture */}
                    <div className="flex flex-col md:flex-row items-center justify-center gap-3 text-sm font-bold text-on-surface mb-12 bg-surface-container-highest p-6 rounded-2xl border border-outline-variant/10 shadow-inner">
                      <div className="bg-surface px-5 py-3 rounded-xl shadow-sm border border-outline-variant/5">Your App</div>
                      <span className="material-symbols-outlined text-outline">arrow_forward</span>
                      <div className="bg-tertiary/20 text-tertiary px-6 py-3 rounded-xl shadow-sm border border-tertiary/30">Krisis Engine</div>
                      <span className="material-symbols-outlined text-outline">arrow_forward</span>
                      <div className="flex flex-col gap-2">
                        <div className="bg-surface px-5 py-2 rounded-xl shadow-sm border border-outline-variant/5">Model A</div>
                        <div className="bg-surface px-5 py-2 rounded-xl shadow-sm border border-outline-variant/5">Model B</div>
                      </div>
                      <span className="material-symbols-outlined text-outline">arrow_forward</span>
                      <div className="bg-primary/20 text-primary px-5 py-3 rounded-xl shadow-sm border border-primary/30">Results</div>
                    </div>

                    {/* Features Grid */}
                    <div className="grid md:grid-cols-2 gap-x-8 gap-y-6 mb-12">
                      <div className="flex gap-4">
                        <div className="bg-surface-container-highest w-10 h-10 rounded-full flex items-center justify-center shrink-0">
                          <span className="material-symbols-outlined text-tertiary text-[20px]">alt_route</span>
                        </div>
                        <div>
                          <p className="font-bold text-on-surface mb-0.5">Route real traffic</p>
                          <p className="text-sm text-on-surface-variant leading-relaxed">Safely split live requests between model versions seamlessly.</p>
                        </div>
                      </div>
                      <div className="flex gap-4">
                        <div className="bg-surface-container-highest w-10 h-10 rounded-full flex items-center justify-center shrink-0">
                          <span className="material-symbols-outlined text-tertiary text-[20px]">history</span>
                        </div>
                        <div>
                          <p className="font-bold text-on-surface mb-0.5">Track delayed outcomes</p>
                          <p className="text-sm text-on-surface-variant leading-relaxed">Connect predictions and async results automatically.</p>
                        </div>
                      </div>
                      <div className="flex gap-4">
                        <div className="bg-surface-container-highest w-10 h-10 rounded-full flex items-center justify-center shrink-0">
                          <span className="material-symbols-outlined text-tertiary text-[20px]">monitoring</span>
                        </div>
                        <div>
                          <p className="font-bold text-on-surface mb-0.5">Compute confidence</p>
                          <p className="text-sm text-on-surface-variant leading-relaxed">Continuously evaluate real-time statistical significance.</p>
                        </div>
                      </div>
                      <div className="flex gap-4">
                        <div className="bg-surface-container-highest w-10 h-10 rounded-full flex items-center justify-center shrink-0">
                          <span className="material-symbols-outlined text-tertiary text-[20px]">verified</span>
                        </div>
                        <div>
                          <p className="font-bold text-on-surface mb-0.5">Safe deployment</p>
                          <p className="text-sm text-on-surface-variant leading-relaxed">Make data-driven production decisions you can truly trust.</p>
                        </div>
                      </div>
                    </div>

                    {/* Final Actions */}
                    <div className="flex flex-col sm:flex-row gap-4 items-center justify-center pt-10 border-t border-outline-variant/10">
                      <button
                        className="kinetic-monolith-gradient text-on-primary-container px-8 py-4 rounded-xl font-bold shadow-lg hover:brightness-110 active:scale-95 transition-all text-sm uppercase tracking-wider w-full sm:w-auto text-center"
                      >
                        Get early access
                      </button>
                      <a
                        href="https://github.com/le-Affan/krisis"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-surface border border-outline-variant/30 text-on-surface px-8 py-4 rounded-xl font-bold shadow-sm hover:bg-surface-container-highest active:scale-95 transition-all text-sm uppercase tracking-wider w-full sm:w-auto text-center flex items-center justify-center gap-2"
                      >
                        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" /></svg>
                        View GitHub
                      </a>
                    </div>
                  </div>

                  {/* Restart Simulation Link */}
                  <div className="mt-10 text-center">
                    <button
                      onClick={() => setPhase("setup")}
                      className="text-on-surface-variant text-sm font-semibold tracking-wide hover:text-primary active:scale-95 transition-all uppercase flex items-center justify-center gap-1 mx-auto"
                    >
                      <span className="material-symbols-outlined text-[18px]">replay</span>
                      Restart Simulation
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
