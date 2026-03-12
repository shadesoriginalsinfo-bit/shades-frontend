import { useState, useEffect } from "react"
import { Clock, Sparkles } from "lucide-react"
import { Badge } from "@/components/ui/badge"

const LAUNCH_DATE = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)

function useCountdown(target: Date) {
  const calc = () => {
    const diff = Math.max(0, target.getTime() - Date.now())
    return {
      days: Math.floor(diff / 86400000),
      hours: Math.floor((diff % 86400000) / 3600000),
      minutes: Math.floor((diff % 3600000) / 60000),
      seconds: Math.floor((diff % 60000) / 1000),
    }
  }
  const [t, setT] = useState(calc)
  useEffect(() => {
    const id = setInterval(() => setT(calc()), 1000)
    return () => clearInterval(id)
  }, [])
  return t
}

function CountUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className="relative w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-black tracking-tighter"
        style={{
          background: "linear-gradient(135deg, #0f0f0f 60%, #1a1a2e)",
          border: "1px solid rgba(139,92,246,0.25)",
          boxShadow: "0 0 24px rgba(139,92,246,0.15), inset 0 1px 0 rgba(255,255,255,0.06)",
          fontFamily: "'DM Mono', monospace",
          color: "#e2d9f3",
        }}
      >
        <span className="tabular-nums">{String(value).padStart(2, "0")}</span>
      </div>
      <span className="text-[10px] uppercase tracking-[0.2em] text-purple-400/60 font-medium">{label}</span>
    </div>
  )
}

export default function HomePage() {
  const t = useCountdown(LAUNCH_DATE)

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden"
      style={{
        background: "#060608",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      {/* Ambient glow blobs */}
      <div
        className="absolute top-[-10%] left-[20%] w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(109,40,217,0.12) 0%, transparent 70%)",
          filter: "blur(40px)",
          animation: "pulse 6s ease-in-out infinite",
        }}
      />
      <div
        className="absolute bottom-[-10%] right-[15%] w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 70%)",
          filter: "blur(40px)",
          animation: "pulse 8s ease-in-out infinite 2s",
        }}
      />

      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(139,92,246,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.03) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-2xl w-full gap-8">

        {/* Badge */}
        <Badge
          variant="outline"
          className="text-purple-300 border-purple-500/30 bg-purple-500/10 px-4 py-1.5 text-xs tracking-widest uppercase gap-2"
        >
          <Sparkles size={11} className="text-purple-400" />
          Something's brewing
        </Badge>

        {/* Headline */}
        <div className="flex flex-col gap-3">
          <h1
            className="text-6xl md:text-7xl font-black leading-none tracking-tight"
            style={{
              fontFamily: "'DM Sans', sans-serif",
              background: "linear-gradient(135deg, #f5f0ff 0%, #c4b5fd 50%, #7c3aed 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Coming Soon
          </h1>
          <p className="text-purple-200/40 text-lg font-light tracking-wide">
            We're crafting something you'll love. <br />
            Stay tuned — it won't be long.
          </p>
        </div>

        {/* Countdown */}
        <div className="flex items-end gap-4">
          <CountUnit value={t.days} label="Days" />
          <span className="text-purple-500/50 text-3xl font-thin pb-7">:</span>
          <CountUnit value={t.hours} label="Hours" />
          <span className="text-purple-500/50 text-3xl font-thin pb-7">:</span>
          <CountUnit value={t.minutes} label="Mins" />
          <span className="text-purple-500/50 text-3xl font-thin pb-7">:</span>
          <CountUnit value={t.seconds} label="Secs" />
        </div>

        {/* Divider */}
        <div className="w-full h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(139,92,246,0.2), transparent)" }} />

        {/* Footer note */}
        <p className="text-purple-400/25 text-xs tracking-widest uppercase flex items-center gap-2">
          <Clock size={10} />
          Launching in approx. 30 days
        </p>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;700;900&family=DM+Mono:wght@400;700&display=swap');
        @keyframes pulse {
          0%, 100% { opacity: 0.8; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.05); }
        }
      `}</style>
    </div>
  )
}