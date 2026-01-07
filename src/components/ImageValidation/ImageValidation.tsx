import { Archive, Check, X, Camera } from 'lucide-react';
import type { DetectedFeature } from '../../types/mission';
import clsx from 'clsx';

interface Props {
    features: DetectedFeature[];
}

export const ImageValidation: React.FC<Props> = ({ features }) => {
    // We mock the seed image for now
    const seedImage = "https://images.unsplash.com/photo-1614730341194-75c60740a070?w=400&q=80"; // Mars-like texture

    return (
        <div className="bg-mission-panel border border-mission-border p-4 rounded-lg shadow-lg flex flex-col h-full">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-mission-muted text-xs uppercase tracking-widest flex items-center gap-2">
                    <Camera size={14} /> Feature Validation Pipeline
                </h2>
                <div className="flex gap-2 text-[10px] uppercase">
                    <span className="flex items-center gap-1 text-mission-green"><Check size={10} /> Valid</span>
                    <span className="flex items-center gap-1 text-mission-alert"><X size={10} /> Rejected</span>
                </div>
            </div>

            <div className="flex-1 grid grid-cols-2 gap-4 min-h-0">
                {/* Reference / Seed */}
                <div className="flex flex-col gap-2 relative">
                    <div className="text-[10px] uppercase text-mission-muted bg-black/50 px-2 py-1 rounded w-fit absolute top-2 left-2 z-10">Target Signature (Seed)</div>
                    <div className="flex-1 bg-black border border-mission-border rounded overflow-hidden relative">
                        <img src={seedImage} alt="Reference" className="w-full h-full object-cover opacity-60 grayscale hover:grayscale-0 transition-all" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                    </div>
                </div>

                {/* Captured Stream */}
                <div className="flex flex-col gap-2 overflow-y-auto pr-1 custom-scrollbar">
                    {features.length === 0 && (
                        <div className="text-center text-mission-muted text-xs py-10 flex flex-col items-center">
                            <Archive className="mb-2 opacity-50" />
                            Waiting for telemetry...
                        </div>
                    )}

                    {features.map(feat => (
                        <div key={feat.id} className="bg-mission-bg border border-mission-border p-2 rounded flex gap-3 text-xs relative group hover:border-mission-cyan/50 transition-colors">
                            <div className="w-16 h-16 bg-gray-800 rounded overflow-hidden shrink-0">
                                {/* Mock captured image */}
                                <div className={clsx("w-full h-full",
                                    feat.type === 'oxide' ? 'bg-red-900/40' :
                                        feat.type === 'ice' ? 'bg-cyan-900/40' : 'bg-gray-700/40'
                                )} />
                            </div>
                            <div className="flex flex-col justify-between flex-1">
                                <div className="flex justify-between items-start">
                                    <span className="font-mono text-mission-cyan uppercase font-bold">{feat.type} P-32</span>
                                    <span className={clsx("px-1.5 py-0.5 rounded text-[10px] font-bold uppercase",
                                        feat.status === 'valid' ? 'bg-mission-green/20 text-mission-green' :
                                            feat.status === 'rejected' ? 'bg-mission-alert/20 text-mission-alert' : 'bg-mission-muted/20 text-mission-muted'
                                    )}>{feat.status}</span>
                                </div>
                                <div className="space-y-1 text-mission-muted">
                                    <div className="flex justify-between">
                                        <span>Conf:</span>
                                        <span className={clsx(feat.confidence > 85 ? "text-mission-green" : "text-mission-amber")}>
                                            {feat.confidence.toFixed(1)}%
                                        </span>
                                    </div>
                                    <div className="text-[10px] opacity-70 font-mono">
                                        T+{Math.floor((Date.now() - feat.timestamp) / 1000)}s
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
