import { useEffect, useState } from "react";
import { Sprout, Trash2, Droplets } from "lucide-react";
import { getGarden, deletePlant, updatePlant } from "../api/api.js";

export default function MyGarden() {
  const [plants, setPlants] = useState([]);

  const load = () => getGarden().then(setPlants).catch(() => {});
  useEffect(() => { load(); }, []);

  const handleWater = async (id) => {
    await updatePlant(id, { lastWatered: new Date().toISOString() });
    load();
  };

  const handleDelete = async (id) => {
    await deletePlant(id);
    load();
  };

  return (
    <div>
      <h1 className="font-display text-3xl text-white">My Garden</h1>
      <p className="mt-2 font-body text-sm text-bark/70">Plants you've saved from the Scan page.</p>

      {plants.length === 0 ? (
        <div className="mt-8 flex min-h-[200px] flex-col items-center justify-center rounded-2xl border border-dashed border-canopy-700 bg-canopy-900/20 text-center">
          <Sprout className="text-mint-400/60" size={28} />
          <p className="mt-3 font-body text-sm text-bark/40">No plants saved yet. Diagnose one on the Scan page and add it here.</p>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {plants.map((p) => (
            <div key={p.id} className="rounded-2xl border border-canopy-700 bg-canopy-900/40 p-5">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-display text-lg text-white">{p.name}</h3>
                  <p className="font-body text-xs italic text-bark/50">{p.species}</p>
                </div>
                <button onClick={() => handleDelete(p.id)} className="text-bark/30 hover:text-amber-400">
                  <Trash2 size={15} />
                </button>
              </div>
              {p.notes && <p className="mt-3 font-body text-sm text-bark/70">{p.notes}</p>}
              <div className="mt-4 flex items-center justify-between">
                <span className="font-mono text-[11px] text-bark/40">
                  Watered {new Date(p.lastWatered).toLocaleDateString()}
                </span>
                <button
                  onClick={() => handleWater(p.id)}
                  className="flex items-center gap-1.5 rounded-full bg-mint-500/10 px-3 py-1 font-body text-xs text-mint-400 hover:bg-mint-500/20"
                >
                  <Droplets size={12} /> Log watering
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
