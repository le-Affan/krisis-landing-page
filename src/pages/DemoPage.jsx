import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const BASE_URL = "http://localhost:8000";

export default function DemoPage() {
  const [isRunning, setIsRunning] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState("Initializing demo...");
  const [results, setResults] = useState(null);
  const [chartData, setChartData] = useState([]);
  useEffect(() => {
    let active = true;
    let iteration = 0;

    const runSimulationLoop = async () => {
      while (active && isRunning) {
        iteration++;
        console.log("Running simulation against:", BASE_URL);
        try {
          // POST predict
          const predictRequest = {
            experiment_id: "demo_exp",
            features: { x: iteration }
          };
          console.log("Final predict payload:", predictRequest);

          const predictRes = await fetch(`${BASE_URL}/api/v1/predict`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(predictRequest)
          });
          
          if (!predictRes.ok) {
            const errorData = await predictRes.json();
            console.error("Predict API Error:", errorData);
            throw new Error(`Predict API failed with status ${predictRes.status}`);
          }

          const predictData = await predictRes.json();
          const requestId = predictData.request_id;

          // POST outcome
          if (requestId) {
            const outcomeRequest = {
              request_id: requestId,
              value: Math.random() > 0.5 ? 1 : 0
            };
            console.log("Sending outcome request:", outcomeRequest);

            const outcomeRes = await fetch(`${BASE_URL}/api/v1/outcomes`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(outcomeRequest)
            });

            if (!outcomeRes.ok) {
              const errorData = await outcomeRes.json();
              console.error("Outcome API Error:", errorData);
              // Wait, throw here will be caught and simulation goes to next loop iteration
              throw new Error(`Outcome API failed with status ${outcomeRes.status}`);
            }
          }

          // GET results
          const resultsRes = await fetch(`${BASE_URL}/api/v1/experiments/demo_exp/results`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json'
            }
          });

          if (!resultsRes.ok) {
            if (resultsRes.status === 400) {
              // Gracefully handle "Not enough data" without error dumping
              setLoadingMessage("Waiting for sufficient samples...");
            } else {
              const errorData = await resultsRes.json();
              console.error("Results API Error:", errorData);
            }
          } else {
             const resultsData = await resultsRes.json();
             console.log("Results Data:", resultsData);
             setResults(resultsData);
             setLoadingMessage(""); // Clear loading when we have 200 OK data
             
             // Update chart array dynamically
             setChartData(prev => [...prev, { step: iteration, value: resultsData.difference }]);
          }

        } catch (error) {
          console.error("API request failed during simulation loop:", error);
          // Do not crash the UI, continue loop if possible
        }

        // Wait a bit before next iteration
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    };

    runSimulationLoop();

    return () => {
      active = false;
    };
  }, [isRunning]);

  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <Navbar />
      <main className="flex-1 flex flex-col items-center justify-center pt-20 px-8 pb-20">
        <div className="w-full max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 text-on-surface">Interactive Demo</h1>
            {loadingMessage && (
              <p className="text-on-surface-variant animate-pulse">{loadingMessage}</p>
            )}
          </div>
          
          {results && !loadingMessage && (
            <div className="space-y-8 animate-in fade-in duration-500">
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
              <div className="bg-surface-container-high border border-outline-variant/20 rounded-2xl p-8">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-on-surface">Effect Size Over Time</h3>
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
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
