'use client';

import { useTourStore } from '@/lib/tour-store';
import BrandLogo from '@/components/brand-logo';

export default function BrandBadge() {
  const { config, selectedApartment } = useTourStore();

  return (
    <div
      className="fixed top-3 right-3 md:top-4 md:right-4 z-[60] flex items-center gap-2 md:gap-2.5 px-3 md:px-4 py-2 md:py-2.5 rounded-xl backdrop-blur-xl border cursor-default select-none"
      style={{
        background: 'rgba(0,0,0,0.5)',
        borderColor: 'rgba(232,217,176,0.12)',
      }}
    >
      <BrandLogo className="h-[22px] md:h-7" />
      <div className="w-px self-stretch" style={{ background: 'rgba(232,217,176,0.2)' }} />
      <div>
        <p className="text-xs font-bold tracking-wide max-w-[120px] sm:max-w-none truncate" style={{ color: '#E8D9B0' }}>
          {selectedApartment ? selectedApartment.name : config.brand.name}
        </p>
        <p className="hidden sm:block text-[10px] text-white/30">
          {selectedApartment ? config.brand.tagline : 'Recorrido Virtual'}
        </p>
      </div>
    </div>
  );
}
