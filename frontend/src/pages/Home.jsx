import { Link } from "react-router-dom";
import { ScanLine, Camera, ShieldCheck, Zap, Brain, Leaf } from "lucide-react";
import VeinMotif from "../components/VeinMotif.jsx";

const features = [
  { icon: Leaf, title: "Plant Identification", desc: "Identify species instantly using the PlantNet API." },
  { icon: ShieldCheck, title: "AI Disease Detection", desc: "A Hugging Face vision model flags disease from a single photo." },
  { icon: Brain, title: "AI Plant Doctor", desc: "Ask follow-up questions to a Groq-powered chat assistant." },
  { icon: Zap, title: "Weather-Aware Care", desc: "Watering and treatment tips adjusted to today's weather." }
];

export default function Home() {
  return (
    <div>
      <section className="relative overflow-hidden rounded-3xl border border-canopy-700 bg-canopy-900/40 px-8 py-16">
        <VeinMotif className="pointer-events-none absolute right-0 top-0 h-full w-1/2 opacity-70" />
        <div className="relative max-w-xl">
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-mint-400">AI-Powered Plant Intelligence</span>
          <h1 className="mt-4 font-display text-5xl leading-[1.05] text-white">
            Your Plant's <span className="italic text-mint-400">Personal Doctor</span>
          </h1>
          <p className="mt-5 font-body text-base text-bark/80">
            Snap a photo, get instant AI diagnostics. Detect diseases, identify species, and
            receive personalized care plans — powered by computer vision and generative AI.
          </p>
          <div className="mt-8 flex gap-3">
            <Link
              to="/scan"
              className="flex items-center gap-2 rounded-full bg-mint-500 px-5 py-2.5 font-body text-sm font-semibold text-canopy-950 transition hover:bg-mint-400"
            >
              <Camera size={16} /> Scan a Plant
            </Link>
            <Link
              to="/dashboard"
              className="flex items-center gap-2 rounded-full border border-canopy-700 px-5 py-2.5 font-body text-sm text-bark transition hover:border-mint-500/50 hover:text-mint-400"
            >
              <ScanLine size={16} /> View Dashboard
            </Link>
          </div>
        </div>
      </section>

      <section className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {features.map(({ icon: Icon, title, desc }) => (
          <div key={title} className="rounded-2xl border border-canopy-700 bg-canopy-900/40 p-5 transition hover:border-mint-500/40">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-mint-500/10 text-mint-400">
              <Icon size={17} />
            </span>
            <h3 className="mt-4 font-display text-base text-white">{title}</h3>
            <p className="mt-1.5 font-body text-sm text-bark/70">{desc}</p>
          </div>
        ))}
      </section>

      <section className="mt-14 rounded-2xl border border-canopy-700 bg-canopy-900/30 p-8">
        <h2 className="font-display text-2xl text-white">Tech stack</h2>
        <div className="mt-5 grid grid-cols-2 gap-x-8 gap-y-2 font-mono text-sm text-bark/70 sm:grid-cols-3">
          <p>React + Vite + Tailwind</p>
          <p>Node.js + Express</p>
          <p>PlantNet API</p>
          <p>Hugging Face ResNet</p>
          <p>Groq LLM</p>
          <p>OpenWeather API</p>
        </div>
      </section>
    </div>
  );
}
