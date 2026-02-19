import { useEffect, useState } from "react"
import { useProgress } from "@react-three/drei"

export default function IntroAnimation({ onDone }) {
  const { progress } = useProgress()
  const [fade, setFade] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => {
      setFade(true)
      setTimeout(onDone, 600)
    }, 3500) // animation duration

    return () => clearTimeout(t)
  }, [onDone])

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      background: "black",
      color: "white",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      fontFamily: "sans-serif",
      letterSpacing: "3px",
      transition: "opacity 0.6s ease",
      opacity: fade ? 0 : 1,
      zIndex: 9999
    }}>
      <h1 style={{ fontSize: 32 }}>CITY OF THE FUTURE</h1>

      <div style={{
        width: 260,
        height: 3,
        background: "#222",
        marginTop: 24
      }}>
        <div style={{
          width: `${progress}%`,
          height: "100%",
          background: "#0af",
          transition: "width 0.2s"
        }} />
      </div>

      <p style={{ marginTop: 12 }}>
        Loading Assets {progress.toFixed(0)}%
      </p>
    </div>
  )
}
