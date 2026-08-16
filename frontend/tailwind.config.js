/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // Botanical dark palette — a shaded canopy, not a generic dark-mode gray
        canopy: {
          950: "#070F0C",
          900: "#0B1712",
          800: "#122318",
          700: "#1B3324",
          600: "#254631"
        },
        mint: {
          400: "#7FE8C0",
          500: "#5ED9AC",
          600: "#3CBB8E"
        },
        amber: {
          400: "#F2B25C",
          500: "#E89B3A"
        },
        bark: "#C9BBA3"
      },
      fontFamily: {
        display: ["Fraunces", "serif"],
        body: ["Manrope", "sans-serif"],
        mono: ["IBM Plex Mono", "monospace"]
      },
      backgroundImage: {
        "vein-pattern": "radial-gradient(circle at 20% 20%, rgba(94,217,172,0.08), transparent 40%), radial-gradient(circle at 80% 60%, rgba(242,178,92,0.06), transparent 45%)"
      }
    }
  },
  plugins: []
};
