import { useEffect, useState, useRef } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

const BASE_URL = "http://localhost:8000";

const SCENARIOS = {
  clear_winner: { label: "Clear Winner (B better)", probA: 0.5, probB: 0.65 },
  no_difference: { label: "No Difference", probA: 0.5, probB: 0.5 },
  small_improvement: { label: "Small Improvement", probA: 0.5, probB: 0.52 },
};

function getStoryText(pct) {
  if (pct < 0.3) return "Initial results are noisy as there is not enough data yet";
  if (pct < 0.7) return "Ahaa! We are starting to see a trend, but confidence is still low";
  return "Results are stabilizing as the confidence is increasing";
}

function getInsightMessage(results, decision) {
  if (!results || !decision) return null;
  const { difference, confidence_interval } = results;
  if (!confidence_interval) return null;

  const ciLow = confidence_interval[0];
  const ciHigh = confidence_interval[1];

  const bIsBetter = ciLow > 0 && difference > 0;
  const aIsBetter = ciHigh < 0 && difference < 0;
  const noDifference = ciLow <= 0 && ciHigh >= 0;

  let feedback = "";
  if (bIsBetter && decision === 'b') {
    feedback = "You made the right call based on real evidence.";
  } else if (!bIsBetter && decision === 'a') {
    feedback = "You made the right call based on real evidence.";
  } else {
    feedback = "This is exactly how teams ship regressions when relying only on offline metrics.";
  }

  if (ciLow > 0 && difference > 0) {
    return {
      title: "Model B truly performs better",
      text: "Offline metrics were correct — Model B truly performs better in real conditions.",
      feedback,
      color: "text-tertiary",
      icon: "check_circle"
    };
  } else if (ciHigh < 0 && difference < 0) {
    return {
      title: "Model A actually performs better",
      text: "Offline metrics were wildly incorrect — Model A truly performs better in real conditions.",
      feedback,
      color: "text-tertiary",
      icon: "check_circle"
    };
  } else if (difference > 0) {
    return {
      title: "Inconclusive results",
      text: "The improvement is too small to be confident. Deploying would be risky.",
      feedback,
      color: "text-primary",
      icon: "info"
    };
  } else {
    return {
      title: "Misleading Offline Metrics",
      text: "Offline metrics were misleading. The improvement does NOT hold in real traffic.",
      feedback,
      color: "text-on-surface-variant",
      icon: "warning"
    };
  }
}

export default function DemoPage() {
  // --- Setup state ---
  const [phase, setPhase] = useState("setup"); // "setup" | "running" | "done"
  const [scenario, setScenario] = useState("clear_winner");
  const [trafficSplit, setTrafficSplit] = useState(50);
  const [sampleSize, setSampleSize] = useState(300);

  // --- Simulation state ---
  const [loadingMessage, setLoadingMessage] = useState("");
  const [results, setResults] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [iteration, setIteration] = useState(0);
  const [currentExpId, setCurrentExpId] = useState("");
  const [userDecision, setUserDecision] = useState(null);
  const activeRef = useRef(false);

  const config = SCENARIOS[scenario];

  // --- Run simulation when phase transitions to "running" ---
  useEffect(() => {
    if (phase !== "running") return;

    activeRef.current = true;
    let iter = 0;
    
    const expId = `exp_${Date.now()}`;
    setCurrentExpId(expId);

    const runSimulationLoop = async () => {
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
          const variant = predictData.model_variant || "a";

          const isModelB = variant.toLowerCase().includes('b') || variant.toLowerCase().includes('treatment');
          const probability = isModelB ? config.probB : config.probA;
          const outcomeValue = Math.random() < probability ? 1 : 0;

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
            setChartData(prev => [...prev, { step: iter, value: resultsData.difference }]);
          } else if (resultsRes.status === 400 && !results) {
            setLoadingMessage("Waiting for sufficient samples...");
          }

        } catch (error) {
          console.error("API request failed during simulation loop:", error);
        }

        const targetTotalMs = 17500;
        let baseDelay = targetTotalMs / sampleSize;
        const progress = iter / sampleSize;
        
        if (progress < 0.3) {
          baseDelay *= 0.5;
        } else if (progress > 0.8) {
          baseDelay *= 2.0; 
        }

        const jitter = baseDelay * 0.2 * (Math.random() * 2 - 1);
        const finalDelay = Math.max(10, baseDelay + jitter);

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
  }, [phase, sampleSize, config, trafficSplit]);

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
          <div className="text-center mb-12">
            <h1 className="text-[3rem] font-bold mb-3 tracking-[-0.03em] text-on-surface">Live A/B Test Simulation</h1>
            <p className="text-xl text-primary font-semibold mb-3">Comparing Model A vs Model B on conversion rate</p>
            <p className="text-sm text-on-surface-variant max-w-2xl mx-auto leading-relaxed">
              Configure your experiment below, then watch statistical confidence emerge in real-time.
            </p>
          </div>

          {/* ===== SETUP PANEL ===== */}
          {phase === "setup" && (
            <div className="max-w-2xl mx-auto mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="bg-surface-container-high border border-outline-variant/20 rounded-2xl p-8 space-y-8">
                <h2 className="text-xl font-bold text-on-surface mb-2">Experiment Setup</h2>

                {/* Scenario */}
                <div>
                  <label className="block text-sm font-semibold text-on-surface-variant mb-2">Scenario</label>
                  <select
                    value={scenario}
                    onChange={(e) => setScenario(e.target.value)}
                    className="w-full bg-surface-container-lowest border border-outline-variant/30 text-on-surface rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/40 transition-colors"
                  >
                    {Object.entries(SCENARIOS).map(([key, val]) => (
                      <option key={key} value={key}>{val.label}</option>
                    ))}
                  </select>
                  <p className="text-xs text-outline mt-2">
                    {scenario === "clear_winner" && "Model A baseline ~50%, Model B ~65%."}
                    {scenario === "no_difference" && "Both models perform at ~50%. No real difference."}
                    {scenario === "small_improvement" && "Model A ~50%, Model B ~52%. Very subtle gain."}
                  </p>
                </div>

                {/* Traffic Split */}
                <div>
                  <label className="block text-sm font-semibold text-on-surface-variant mb-2">
                    Traffic to Model B: <span className="text-primary font-bold">{trafficSplit}%</span>
                  </label>
                  <input
                    type="range"
                    min={10}
                    max={90}
                    value={trafficSplit}
                    onChange={(e) => setTrafficSplit(Number(e.target.value))}
                    className="w-full h-2 rounded-full appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, #c0c1ff ${trafficSplit}%, #2d3449 ${trafficSplit}%)`
                    }}
                  />
                  <div className="flex justify-between text-xs text-outline mt-1">
                    <span>10%</span>
                    <span>90%</span>
                  </div>
                </div>

                {/* Sample Size */}
                <div>
                  <label className="block text-sm font-semibold text-on-surface-variant mb-2">
                    Number of Requests: <span className="text-primary font-bold">{sampleSize}</span>
                  </label>
                  <input
                    type="range"
                    min={50}
                    max={500}
                    step={10}
                    value={sampleSize}
                    onChange={(e) => setSampleSize(Number(e.target.value))}
                    className="w-full h-2 rounded-full appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, #c0c1ff ${((sampleSize - 50) / 450) * 100}%, #2d3449 ${((sampleSize - 50) / 450) * 100}%)`
                    }}
                  />
                  <div className="flex justify-between text-xs text-outline mt-1">
                    <span>50</span>
                    <span>500</span>
                  </div>
                </div>

                {/* Offline Result Context */}
                <div className="bg-surface-container border border-tertiary/20 rounded-xl p-5 mt-6 mb-2 flex flex-col gap-3 shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="bg-tertiary/10 w-12 h-12 rounded-full text-tertiary flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>offline_bolt</span>
                    </div>
                    <div>
                      <h4 className="text-xs text-on-surface-variant font-bold uppercase tracking-wider mb-1">Offline Evaluation</h4>
                      <p className="text-base font-semibold text-on-surface">Offline metrics suggest Model B is better (+11%)</p>
                    </div>
                  </div>
                  <div className="bg-surface-container-lowest border border-outline-variant/10 rounded-lg p-4 mx-2 sm:mx-16 mt-2">
                    <p className="text-sm font-medium text-on-surface">Accuracy: Model A = <span className="text-outline">72%</span>, Model B = <span className="text-tertiary font-bold">83%</span></p>
                    <p className="text-xs text-outline mt-1 italic">Based on held-out test data</p>
                  </div>
                  <div className="flex items-center gap-2 mt-2 mx-2 sm:mx-16 border border-error/20 bg-error/5 p-3 rounded-lg">
                    <span className="material-symbols-outlined text-error/80 text-sm">warning</span>
                    <p className="text-xs text-error/80 font-bold tracking-wide uppercase">Confidence: Unknown (no real-world validation)</p>
                  </div>
                </div>

                {/* Start Button */}
                <button
                  onClick={handleStart}
                  className="w-full kinetic-monolith-gradient text-on-primary-container px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:brightness-110 active:scale-95 transition-all mt-4"
                >
                  Run Experiment
                </button>
              </div>
            </div>
          )}

          {/* ===== RUNNING CONFIG SUMMARY ===== */}
          {isActive && (
            <div className="text-center mb-8 animate-in fade-in duration-500">
              <div className="inline-flex items-center gap-3 bg-surface-container border border-outline-variant/15 rounded-full px-6 py-2 text-sm shadow-sm">
                <span className="text-on-surface-variant">Running:</span>
                <span className="text-on-surface font-semibold">B gets {trafficSplit}% traffic</span>
                <span className="text-outline">|</span>
                <span className="text-on-surface font-semibold">Scenario: {config.label}</span>
                <span className="text-outline">|</span>
                <span className="text-on-surface font-semibold">{sampleSize} requests</span>
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
          {isActive && results && !loadingMessage && (
            <div className="space-y-8 animate-in fade-in duration-500">
              
              {/* Dynamic Narrative / Story Text */}
              <div className="text-center mb-4">
                <p className="text-2xl font-bold text-on-surface mb-6">Does this hold in real traffic?</p>
                {phase === "running" ? (
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-tertiary animate-pulse shadow-[0_0_10px_#4cd7f6]"></div>
                    <p className="text-on-surface-variant font-medium text-lg">{getStoryText(progressPct)}</p>
                    <span className="text-xs text-outline ml-2">Iteration {iteration}/{sampleSize}</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-3 mb-2">
                    <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_10px_#c0c1ff]"></div>
                    <p className="text-on-surface-variant font-medium text-lg">Simulation complete</p>
                  </div>
                )}
              </div>

              {/* Decision Prompt Before Insight */}
              {phase === "done" && !userDecision && (
                <div className="text-center bg-surface-container border border-outline-variant/30 rounded-2xl py-8 px-10 max-w-xl mx-auto shadow-xl animate-in zoom-in-95 duration-500">
                  <h3 className="text-2xl font-bold text-on-surface mb-8">What would you do?</h3>
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
                  <p className="text-sm text-outline mt-6 italic">Choose carefully based on the emerging trend.</p>
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

              {/* Metrics Section */}
              <div className="grid md:grid-cols-4 gap-6">
                <div className="bg-surface-container p-6 rounded-2xl border border-outline-variant/10">
                  <h4 className="text-sm text-on-surface-variant font-medium mb-2">Model A Mean</h4>
                  <p className="text-2xl font-bold text-on-surface">{results.model_a_mean?.toFixed(4) || "0.0000"}</p>
                </div>
                <div className="bg-surface-container p-6 rounded-2xl border border-outline-variant/10">
                  <h4 className="text-sm text-on-surface-variant font-medium mb-2">Model B Mean</h4>
                  <p className="text-2xl font-bold text-on-surface">{results.model_b_mean?.toFixed(4) || "0.0000"}</p>
                </div>
                <div className="bg-surface-container p-6 rounded-2xl border border-outline-variant/10">
                  <h4 className="text-sm text-on-surface-variant font-medium mb-2">Effect Size</h4>
                  <p className="text-2xl font-bold text-primary">{results.difference > 0 ? "+" : ""}{results.difference?.toFixed(4) || "0.0000"}</p>
                </div>
                <div className="bg-surface-container p-6 rounded-2xl border border-outline-variant/10">
                  <h4 className="text-sm text-on-surface-variant font-medium mb-2">95% Confidence Interval</h4>
                  <p className="text-lg font-bold text-on-surface">
                    [{results.confidence_interval?.[0]?.toFixed(4)}, {results.confidence_interval?.[1]?.toFixed(4)}]
                  </p>
                </div>
              </div>

              {/* Main Chart */}
              <div className="bg-surface-container-high border border-outline-variant/20 rounded-2xl p-8 shadow-xl">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-on-surface">Effect Size Over Time</h3>
                    <p className="text-xs text-outline mt-1 font-medium tracking-wide">Effect size (B − A)</p>
                  </div>
                  <div className="flex gap-4 text-sm font-medium">
                    <span className="bg-surface p-2 rounded-lg text-on-surface-variant">Samples A: <span className="text-on-surface">{results.sample_size_a}</span></span>
                    <span className="bg-surface p-2 rounded-lg text-on-surface-variant">Samples B: <span className="text-on-surface">{results.sample_size_b}</span></span>
                  </div>
                </div>
                <div className="h-80 w-full relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#464554" vertical={false} opacity={0.3} />
                      <XAxis dataKey="step" stroke="#908fa0" tick={{fill: '#908fa0', fontSize: 12}} />
                      <YAxis stroke="#908fa0" tick={{fill: '#908fa0', fontSize: 12}} domain={['auto', 'auto']} />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#222a3d', borderColor: '#464554', borderRadius: '0.5rem', color: '#dae2fd' }}
                        itemStyle={{ color: '#c0c1ff' }}
                        labelStyle={{ color: '#a7b6cc', marginBottom: '0.25rem' }}
                      />
                      <ReferenceLine y={0} stroke="#464554" strokeDasharray="4 4" />
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
                        Stop guessing with offline metrics. Integrate continuous A/B testing directly into your ML lifecycle.
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
                        Use Krisis in your pipeline
                      </button>
                      <button
                        className="bg-surface border border-outline-variant/30 text-on-surface px-8 py-4 rounded-xl font-bold shadow-sm hover:bg-surface-container-highest active:scale-95 transition-all text-sm uppercase tracking-wider w-full sm:w-auto text-center flex items-center justify-center gap-2"
                      >
                        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
                        View GitHub
                      </button>
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
