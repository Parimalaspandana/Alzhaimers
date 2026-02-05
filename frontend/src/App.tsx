import { useState } from "react";

function App() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [prediction, setPrediction] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const img = e.target.files?.[0];
    if (img) {
      setFile(img);
      setPreview(URL.createObjectURL(img));
      setPrediction(null);
      setError(null);
    }
  };

  const handlePredict = async () => {
    if (!file) {
      setError("Please upload a valid MRI image.");
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

  const getBadgeStyle = () => {
    if (!prediction) return "";
    if (prediction.includes("Non"))
      return "bg-emerald-100 text-emerald-900 border-emerald-400";
    if (prediction.includes("Mild"))
      return "bg-amber-100 text-amber-900 border-amber-400";
    return "bg-red-100 text-red-900 border-red-400";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 flex items-center justify-center px-6">

      {/* MAIN CARD */}
      <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl p-10">

        {/* HEADER */}
        <div className="border-b pb-6 text-center">
          <h1 className="text-4xl font-extrabold text-blue-900 tracking-tight">
            Alzheimer’s AI Diagnosis
          </h1>
          <p className="mt-2 text-gray-600 font-medium">
            Clinical Decision Support System
          </p>
        </div>

        {/* UPLOAD */}
        <div className="mt-8">
          <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">
            MRI Image Upload
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full rounded-xl border-2 border-slate-300 p-3 text-sm font-semibold focus:ring-4 focus:ring-blue-300"
          />
        </div>

        {/* PREVIEW */}
        {preview && (
          <div className="mt-6">
            <p className="text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">
              Image Preview
            </p>
            <div className="border-2 border-slate-300 rounded-2xl overflow-hidden shadow-lg">
              <img
                src={preview}
                alt="MRI Preview"
                className="w-full h-72 object-cover"
              />
            </div>
          </div>
        )}

        {/* BUTTON */}
        <button
          onClick={handlePredict}
          disabled={loading}
          className="mt-10 w-full bg-blue-900 hover:bg-blue-800 text-white py-4 rounded-2xl font-extrabold text-lg tracking-wide transition disabled:opacity-60"
        >
          {loading ? "Analyzing MRI Scan..." : "RUN AI ANALYSIS"}
        </button>

        {/* RESULT */}
        {prediction && (
          <div
            className={`mt-8 p-5 border-2 rounded-2xl text-center font-extrabold text-xl ${getBadgeStyle()}`}
          >
            Diagnosis Result: {prediction}
          </div>
        )}

        {/* ERROR */}
        {error && (
          <div className="mt-6 p-4 bg-red-100 border-2 border-red-400 text-red-900 rounded-xl font-semibold text-center">
            {error}
          </div>
        )}

        {/* FOOTER */}
        <p className="mt-10 text-xs text-gray-400 text-center">
          For research and screening purposes only. Not a replacement for medical diagnosis.
        </p>
      </div>
    </div>
  );
}

export default App;
