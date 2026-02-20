import { Html, useProgress } from "@react-three/drei";
import { useEffect } from "react";

export default function Loader() {
  const { progress } = useProgress();

  // Optional: lock scroll while loading
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <Html fullscreen>
      <div style={styles.container}>
        {/* Spinner */}
        <div style={styles.spinner} />

        {/* Loading Text */}
        <p style={styles.text}>Loading {progress.toFixed(0)}%</p>

        {/* Internal CSS Animation */}
        <style>
          {`
            @keyframes spin {
              to {
                transform: rotate(360deg);
              }
            }
          `}
        </style>
      </div>
    </Html>
  );
}

const styles = {
  container: {
    width: "100vw",
    height: "100vh",
    background: "black",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    color: "white",
    fontFamily: "sans-serif",
  },
  spinner: {
    width: "60px",
    height: "60px",
    border: "6px solid #333",
    borderTop: "6px solid #00ffff",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
    marginBottom: "20px",
  },
  text: {
    fontSize: "22px",
    letterSpacing: "1px",
  },
};
