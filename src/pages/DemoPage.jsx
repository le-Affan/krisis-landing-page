import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const BASE_URL = "http://localhost:8000";

export default function DemoPage() {
  const [isRunning, setIsRunning] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState("Initializing demo...");
  const [results, setResults] = useState(null);
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
      <main className="flex-1 flex items-center justify-center pt-20">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4 text-on-surface">Interactive Demo</h1>
          {loadingMessage ? (
            <p className="text-on-surface-variant animate-pulse">{loadingMessage}</p>
          ) : (
            <div>
              <p className="text-tertiary font-bold mb-2">Metrics Update (200 OK)</p>
              <pre className="text-xs text-left bg-surface-container-highest p-4 rounded-xl text-on-surface overflow-auto inline-block">
                {JSON.stringify(results, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
