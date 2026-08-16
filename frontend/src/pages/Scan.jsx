import { useState, useRef } from "react";
import { UploadCloud, Camera, Loader2, Leaf, ShieldAlert, ShieldCheck, Send, Bot, PlusCircle } from "lucide-react";
import { identifyPlant, diagnoseDisease, sendChatMessage, addPlantToGarden } from "../api/api.js";

export default function Scan() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [identity, setIdentity] = useState(null);
  const [diagnosis, setDiagnosis] = useState(null);
  const [error, setError] = useState(null);
  const [chatInput, setChatInput] = useState("");
  const [chatLog, setChatLog] = useState([]);
  const [chatBusy, setChatBusy] = useState(false);
  const [saved, setSaved] = useState(false);
  const fileInputRef = useRef(null);

  const onFileChange = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setIdentity(null);
    setDiagnosis(null);
    setChatLog([]);
    setSaved(false);
    setError(null);
  };

  const runAnalysis = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    try {
      const [idResult, diagResult] = await Promise.all([identifyPlant(file), diagnoseDisease(file)]);
      setIdentity(idResult);
      setDiagnosis(diagResult);
    } catch (err) {
      console.error(err);
      setError("Something went wrong analyzing this image. Make sure the backend server is running.");
    } finally {
      setLoading(false);
    }
  };

  const askDoctor = async () => {
    if (!chatInput.trim()) return;
    const userMsg = chatInput.trim();
    setChatLog((prev) => [...prev, { role: "user", content: userMsg }]);
    setChatInput("");
    setChatBusy(true);
    try {
      const { reply } = await sendChatMessage(
        userMsg,
        { plant: identity?.commonName, disease: diagnosis?.disease },
        chatLog
      );
      setChatLog((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch (err) {
      setChatLog((prev) => [...prev, { role: "assistant", content: "Sorry, I couldn't reach the AI doctor service." }]);
    } finally {
      setChatBusy(false);
    }
  };

  const saveToGarden = async () => {
    if (!identity) return;
    await addPlantToGarden({
      name: identity.commonName,
      species: identity.scientificName,
      notes: diagnosis ? `Last diagnosis: ${diagnosis.disease} (${diagnosis.confidence}%)` : ""
    });
    setSaved(true);
  };

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
      {/* Upload panel */}
      <div className="lg:col-span-2">
        <h1 className="font-display text-3xl text-white">Scan a Plant</h1>
        <p className="mt-2 font-body text-sm text-bark/70">
          Upload a clear photo of a leaf or the whole plant for identification and disease detection.
        </p>

        <div
          onClick={() => fileInputRef.current?.click()}
          className="mt-6 flex aspect-square cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-canopy-700 bg-canopy-900/30 text-center transition hover:border-mint-500/50"
        >
          {preview ? (
            <img src={preview} alt="Selected plant" className="h-full w-full rounded-2xl object-cover" />
          ) : (
            <>
              <UploadCloud className="text-mint-400" size={32} />
              <p className="mt-3 font-body text-sm text-bark/70">Click to upload an image</p>
              <p className="mt-1 font-mono text-xs text-bark/40">JPG, PNG up to 10MB</p>
            </>
          )}
        </div>
        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={onFileChange} />

        <div className="mt-4 flex gap-3">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 rounded-full border border-canopy-700 px-4 py-2 font-body text-sm text-bark hover:border-mint-500/50"
          >
            <Camera size={15} /> Choose Photo
          </button>
          <button
            onClick={runAnalysis}
            disabled={!file || loading}
            className="flex items-center gap-2 rounded-full bg-mint-500 px-4 py-2 font-body text-sm font-semibold text-canopy-950 transition hover:bg-mint-400 disabled:opacity-40"
          >
            {loading ? <Loader2 size={15} className="animate-spin" /> : <Leaf size={15} />}
            {loading ? "Analyzing..." : "Diagnose Plant"}
          </button>
        </div>
        {error && <p className="mt-3 font-body text-sm text-amber-400">{error}</p>}
      </div>

      {/* Results panel */}
      <div className="lg:col-span-3">
        {!identity && !diagnosis && (
          <div className="flex h-full min-h-[300px] items-center justify-center rounded-2xl border border-canopy-700 bg-canopy-900/20 font-body text-sm text-bark/40">
            Results will appear here after you diagnose a plant.
          </div>
        )}

        {identity && (
          <div className="rounded-2xl border border-canopy-700 bg-canopy-900/40 p-6">
            <div className="flex items-start justify-between">
              <div>
                <span className="font-mono text-xs uppercase tracking-wide text-mint-400">Plant Identification</span>
                <h2 className="mt-1 font-display text-2xl text-white">{identity.commonName}</h2>
                <p className="font-body text-sm italic text-bark/60">{identity.scientificName}</p>
              </div>
              <span className="rounded-full bg-mint-500/10 px-3 py-1 font-mono text-xs text-mint-400">
                {identity.confidence}% match
              </span>
            </div>
            {identity.alternatives?.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {identity.alternatives.map((alt) => (
                  <span key={alt.commonName} className="rounded-full border border-canopy-700 px-2.5 py-1 font-mono text-xs text-bark/60">
                    {alt.commonName} · {alt.confidence}%
                  </span>
                ))}
              </div>
            )}
            <button
              onClick={saveToGarden}
              disabled={saved}
              className="mt-5 flex items-center gap-2 font-body text-sm text-mint-400 hover:text-mint-300 disabled:text-bark/40"
            >
              <PlusCircle size={15} /> {saved ? "Saved to My Garden" : "Add to My Garden"}
            </button>
          </div>
        )}

        {diagnosis && (
          <div className="mt-5 rounded-2xl border border-canopy-700 bg-canopy-900/40 p-6">
            <div className="flex items-start justify-between">
              <div>
                <span className="font-mono text-xs uppercase tracking-wide text-mint-400">Disease Detection</span>
                <h2 className="mt-1 flex items-center gap-2 font-display text-2xl text-white">
                  {diagnosis.isHealthy ? <ShieldCheck className="text-mint-400" size={20} /> : <ShieldAlert className="text-amber-400" size={20} />}
                  {diagnosis.disease}
                </h2>
              </div>
              <span className="rounded-full bg-amber-500/10 px-3 py-1 font-mono text-xs text-amber-400">
                {diagnosis.confidence}% confidence
              </span>
            </div>
            <p className="mt-3 font-body text-sm text-bark/70">{diagnosis.summary}</p>
            <ul className="mt-4 space-y-1.5">
              {diagnosis.recommendedActions?.map((action, i) => (
                <li key={i} className="flex items-start gap-2 font-body text-sm text-bark/80">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-mint-400" />
                  {action}
                </li>
              ))}
            </ul>
            {diagnosis.note && <p className="mt-4 font-mono text-xs text-amber-400/70">{diagnosis.note}</p>}
          </div>
        )}

        {(identity || diagnosis) && (
          <div className="mt-5 rounded-2xl border border-canopy-700 bg-canopy-900/40 p-6">
            <div className="flex items-center gap-2">
              <Bot size={17} className="text-mint-400" />
              <span className="font-display text-lg text-white">Ask the AI Plant Doctor</span>
            </div>
            <div className="mt-4 max-h-64 space-y-3 overflow-y-auto pr-1">
              {chatLog.map((m, i) => (
                <div key={i} className={`rounded-xl px-3.5 py-2.5 font-body text-sm ${m.role === "user" ? "ml-auto max-w-[80%] bg-mint-500/15 text-bark" : "max-w-[85%] bg-canopy-800 text-bark/80"}`}>
                  {m.content}
                </div>
              ))}
            </div>
            <div className="mt-4 flex gap-2">
              <input
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && askDoctor()}
                placeholder="e.g. How often should I water it?"
                className="flex-1 rounded-full border border-canopy-700 bg-canopy-950 px-4 py-2 font-body text-sm text-bark placeholder:text-bark/30 focus:border-mint-500 focus:outline-none"
              />
              <button
                onClick={askDoctor}
                disabled={chatBusy}
                className="flex items-center justify-center rounded-full bg-mint-500 px-3.5 text-canopy-950 hover:bg-mint-400 disabled:opacity-40"
              >
                {chatBusy ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
