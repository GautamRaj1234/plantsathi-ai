// Signature visual motif: a branching leaf-vein network, echoing how
// PlantSathi traces symptoms back through a decision path to a diagnosis.
export default function VeinMotif({ className = "" }) {
  return (
    <svg
      viewBox="0 0 600 400"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path d="M300 380 C 300 300, 300 260, 300 180 C 300 120, 300 60, 300 10" stroke="#3CBB8E" strokeWidth="2" strokeOpacity="0.5" />
      {[
        "M300 320 C 260 300, 220 290, 170 270",
        "M300 320 C 340 300, 380 290, 430 270",
        "M300 240 C 265 220, 230 210, 190 190",
        "M300 240 C 335 220, 370 210, 410 190",
        "M300 160 C 270 145, 245 135, 210 120",
        "M300 160 C 330 145, 355 135, 390 120",
        "M300 90 C 280 78, 260 70, 235 58",
        "M300 90 C 320 78, 340 70, 365 58"
      ].map((d, i) => (
        <path key={i} d={d} stroke="#5ED9AC" strokeWidth="1.4" strokeOpacity="0.35" />
      ))}
      {[
        [170, 270], [430, 270], [190, 190], [410, 190],
        [210, 120], [390, 120], [235, 58], [365, 58]
      ].map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r="3" fill="#7FE8C0" fillOpacity="0.6" />
      ))}
    </svg>
  );
}
