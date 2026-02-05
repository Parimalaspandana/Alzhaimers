import { useState } from "react";

function App() {
  const [file, setFile] = useState<File | null>(null);
  const [prediction, setPrediction] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setPrediction(null);
      setError(null);
    }
  };

  const handlePredict = async () => {
    if (!file) {
      setError("Please upload an MRI image first.");
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("http://127.0.0.1:8000/predict", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      setPrediction(data.prediction);
    } catch {
      setError("Unable to connect to AI server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        body {
          margin: 0;
          font-family: Arial, sans-serif;
        }

        .page {
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          background: #0f172a;
        }

        .card {
          width: 100%;
          max-width: 450px;
          height: 520px;
          background: white;
          border-radius: 16px;
          padding: 24px;
          display: flex;
          flex-direction: column;
        }

        .center-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          text-align: center;
        }

        .title {
          font-size: 28px;
          font-weight: bold;
          color: #1e3a8a;
        }

        .subtitle {
          margin-top: 8px;
          color: #475569;
          font-size: 14px;
        }

        .upload {
          margin-top: 30px;
        }

        .button {
          width: 100%;
          padding: 14px;
          font-size: 16px;
          font-weight: bold;
          background: #1e40af;
          color: white;
          border: none;
          border-radius: 10px;
          cursor: pointer;
          margin-top: 20px;
        }

        .button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .footer {
          font-size: 11px;
          text-align: center;
          color: #64748b;
          margin-top: 10px;
        }

        .result {
          margin-top: 16px;
          font-weight: bold;
          color: #065f46;
        }

        .error {
          margin-top: 16px;
          color: #b91c1c;
          font-size: 14px;
        }
      `}</style>

      <div className="page">
        <div className="card">

          {/* CENTER */}
          <div className="center-content">
            <div className="title">Alzheimer’s AI Diagnosis</div>
            <div className="subtitle">
              MRI-Based Clinical Decision Support
            </div>

            <div className="upload">
              <input type="file" onChange={handleFileChange} />
            </div>

            {prediction && <div className="result">{prediction}</div>}
            {error && <div className="error">{error}</div>}
          </div>

          {/* BOTTOM BUTTON */}
          <button
            className="button"
            onClick={handlePredict}
            disabled={loading}
          >
            {loading ? "Analyzing..." : "Run AI Analysis"}
          </button>

          <div className="footer">
            For research purposes only. Not a medical diagnosis.
          </div>

        </div>
      </div>
    </>
  );
}

export default App;
