'use client';

import { useEffect, useState } from 'react';
import { assetPath } from '@/lib/asset-path';
import BrandLogo from '@/components/brand-logo';

const BRAND = (path: string) => assetPath(`/projects/melendez/branding/${path}`);

// Valle Alto palette — fondo sage oscuro profundo
const BG    = '#1A2420'; // sage oscuro profundo
const BEIGE = '#E8D9B0'; // arena/crema (logo natural)
const SAGE  = '#8FA89A'; // sage claro (anillos)
const LIMA  = '#C8CF6A'; // verde-lima (acento)

interface SplashScreenProps {
  onComplete: () => void;
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const [phase, setPhase] = useState<'enter' | 'hold' | 'exit'>('enter');

  useEffect(() => {
    const holdTimer = setTimeout(() => setPhase('hold'), 100);
    const exitTimer = setTimeout(() => setPhase('exit'), 2800);
    const doneTimer = setTimeout(() => onComplete(), 3600);
    return () => {
      clearTimeout(holdTimer);
      clearTimeout(exitTimer);
      clearTimeout(doneTimer);
    };
  }, [onComplete]);

  const visible = phase !== 'enter';

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: BG,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: phase === 'exit' ? 0 : 1,
        transition: phase === 'exit' ? 'opacity 1s cubic-bezier(0.4,0,0.2,1)' : 'none',
        pointerEvents: phase === 'exit' ? 'none' : 'all',
      }}
    >
      {/* Ambient glow */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: `radial-gradient(ellipse at 50% 50%, ${SAGE}18 0%, transparent 60%)`,
        pointerEvents: 'none',
      }} />

      {/* Orbit rings */}
      <div style={{
        position: 'absolute',
        width: 310,
        height: 310,
        borderRadius: '50%',
        border: `1px solid ${SAGE}60`,
        animation: 'splash-orbit 4s linear infinite',
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.8s ease 0.5s',
      }} />
      <div style={{
        position: 'absolute',
        width: 245,
        height: 245,
        borderRadius: '50%',
        border: `1px solid ${SAGE}35`,
        animation: 'splash-orbit 6s linear infinite reverse',
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.8s ease 0.7s',
      }} />

      {/* Logo — centrado exacto */}
      <div style={{
        position: 'relative',
        zIndex: 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        transform: visible ? 'scale(1) translateY(0)' : 'scale(0.75) translateY(14px)',
        opacity: visible ? 1 : 0,
        transition: 'transform 0.9s cubic-bezier(0.34,1.56,0.64,1), opacity 0.7s ease',
      }}>
        <BrandLogo
          style={{
            width: 220,
            filter: `drop-shadow(0 0 14px ${BEIGE}28)`,
          }}
        />
      </div>

      {/* Tagline + progress — absoluto debajo del logo, no afecta centrado */}
      <div style={{
        position: 'absolute',
        top: 'calc(50% + 210px)',
        left: 0,
        right: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 10,
        zIndex: 2,
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.6s ease 0.9s',
      }}>
        <div style={{
          width: 130,
          height: 1.5,
          background: `${LIMA}25`,
          borderRadius: 2,
          overflow: 'hidden',
        }}>
          <div style={{
            height: '100%',
            background: `linear-gradient(90deg, transparent, ${LIMA}, transparent)`,
            transformOrigin: 'left center',
            animation: visible ? 'splash-progress 2.4s ease-out 0.3s both' : 'none',
          }} />
        </div>
        <p style={{
          margin: 0,
          color: `${LIMA}AA`,
          fontSize: 9,
          letterSpacing: '0.30em',
          textTransform: 'uppercase',
          fontWeight: 500,
        }}>
          Recorrido Virtual 360°
        </p>
      </div>

      {/* Co-branding footer */}
      <div style={{
        position: 'absolute',
        bottom: 30,
        left: 0,
        right: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 20,
        zIndex: 2,
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.7s ease 1.1s',
      }}>
        <img
          src={BRAND('LogoMelendezHorizontal.png')}
          alt="Constructora Meléndez"
          style={{ height: 32, width: 'auto', objectFit: 'contain' }}
          draggable={false}
        />
        <div style={{ width: 1, height: 22, background: `${BEIGE}25` }} />
        <img
          src={BRAND('MIES LOGO_Horizontal Blanco.png')}
          alt="MIESGROUP"
          style={{ height: 18, width: 'auto', objectFit: 'contain' }}
          draggable={false}
        />
      </div>

      <style>{`
        @keyframes splash-orbit {
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
