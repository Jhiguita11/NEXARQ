'use client';

import { useTourStore } from '@/lib/tour-store';
import { X, Info } from 'lucide-react';

export function InfoPanel() {
  const { showInfoPanel, infoPanelContent, hideInfo } = useTourStore();

  if (!showInfoPanel) return null;

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-lg">
      <div className="bg-black/80 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden animate-in slide-in-from-top-4 fade-in duration-300">
        <div className="flex items-start gap-3 p-4">
          <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
            <Info size={20} className="text-blue-400" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-white font-semibold text-sm mb-1">Información</h3>
            <p className="text-white/70 text-sm leading-relaxed">{infoPanelContent}</p>
          </div>
          <button
            onClick={hideInfo}
            className="text-white/40 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors flex-shrink-0"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
