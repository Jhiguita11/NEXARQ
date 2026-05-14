'use client';

import { useEffect, useState } from 'react';

interface SplashScreenProps {
  onComplete: () => void;
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const [phase, setPhase] = useState<'enter' | 'hold' | 'exit'>('enter');

  useEffect(() => {
    const holdTimer = setTimeout(() => setPhase('hold'), 100);
    const exitTimer = setTimeout(() => setPhase('exit'), 2400);
    const doneTimer = setTimeout(() => onComplete(), 3100);
    return () => {
      clearTimeout(holdTimer);
      clearTimeout(exitTimer);
      clearTimeout(doneTimer);
    };
  }, [onComplete]);

  return (
    <div
      className="splash-root"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: '#fff',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: phase === 'exit' ? 0 : 1,
        transition: phase === 'exit' ? 'opacity 0.7s ease' : 'none',
        pointerEvents: phase === 'exit' ? 'none' : 'all',
      }}
    >
      {/* Subtle gold ambient glow */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(ellipse at 50% 48%, rgba(212,175,55,0.12) 0%, transparent 65%)',
        pointerEvents: 'none',
      }} />

      {/* Orbit ring — purely decorative, animates around logo */}
      <div
        style={{
          position: 'absolute',
          width: 320,
          height: 320,
          borderRadius: '50%',
          border: '1px solid rgba(212,175,55,0.35)',
          animation: 'splash-orbit-ring 3s linear infinite',
          opacity: phase === 'hold' || phase === 'exit' ? 1 : 0,
          transition: 'opacity 0.8s ease 0.6s',
        }}
      />
      <div
        style={{
          position: 'absolute',
          width: 260,
          height: 260,
          borderRadius: '50%',
          border: '1px solid rgba(212,175,55,0.20)',
          animation: 'splash-orbit-ring 4.5s linear infinite reverse',
          opacity: phase === 'hold' || phase === 'exit' ? 1 : 0,
          transition: 'opacity 0.8s ease 0.8s',
        }}
      />

      {/* Logo wrapper */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          transform: phase === 'enter' ? 'scale(0.72) translateY(12px)' : 'scale(1) translateY(0)',
          opacity: phase === 'enter' ? 0 : 1,
          transition: 'transform 0.9s cubic-bezier(0.34,1.56,0.64,1), opacity 0.7s ease',
        }}
      >
        <img
          src="/logo-transparent.png"
          alt="NEXARQ 360"
          style={{
            width: 240,
            height: 'auto',
            position: 'relative',
            zIndex: 1,
            display: 'block',
          }}
          draggable={false}
        />
      </div>

      {/* Progress bar */}
      <div
        style={{
          marginTop: 48,
          position: 'relative',
          zIndex: 2,
          width: 180,
          height: 2,
          background: 'rgba(212,175,55,0.25)',
          borderRadius: 2,
          overflow: 'hidden',
          opacity: phase === 'enter' ? 0 : 1,
          transition: 'opacity 0.5s ease 0.4s',
        }}
      >
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(90deg, #D4AF37, #f0d060, #D4AF37)',
          borderRadius: 2,
          transformOrigin: 'left center',
          animation: phase !== 'enter' ? 'splash-progress 2s ease-out 0.3s both' : 'none',
        }} />
      </div>

      {/* Tagline */}
      <p
        style={{
          marginTop: 20,
          color: 'rgba(180,145,20,0.8)',
          fontSize: 11,
          letterSpacing: '0.25em',
          textTransform: 'uppercase',
          fontWeight: 500,
          zIndex: 2,
          position: 'relative',
          opacity: phase === 'enter' ? 0 : 1,
          transition: 'opacity 0.6s ease 0.7s',
        }}
      >
        Recorrido Virtual 360°
      </p>

      <style>{`
        @keyframes splash-orbit-ring {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes splash-progress {
          from { transform: scaleX(0); }
          to   { transform: scaleX(1); }
        }
      `}</style>
    </div>
  );
}
