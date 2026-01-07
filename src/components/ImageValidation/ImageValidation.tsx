import { Archive, Check, X, Camera, Scan, Mountain, Snowflake, Flame } from 'lucide-react';
import type { DetectedFeature, FeatureType } from '../../types/mission';
import clsx from 'clsx';

interface Props {
    features: DetectedFeature[];
}

// SVG placeholder for seed images by type
const SeedImagePlaceholder = ({ type }: { type: FeatureType }) => {
    const config = {
        oxide: { bg: 'bg-gradient-to-br from-red-900/60 to-orange-900/40', icon: Flame, color: 'text-red-400' },
        ice: { bg: 'bg-gradient-to-br from-cyan-900/60 to-blue-900/40', icon: Snowflake, color: 'text-cyan-400' },
        rock: { bg: 'bg-gradient-to-br from-gray-700/60 to-stone-800/40', icon: Mountain, color: 'text-gray-400' },
    };
    const c = config[type];
    const Icon = c.icon;

    return (
        <div className={clsx("w-full h-full flex items-center justify-center", c.bg)}>
            <Icon size={32} className={clsx(c.color, "opacity-60")} />
        </div>
    );
};

export const ImageValidation: React.FC<Props> = ({ features }) => {
    // Get latest feature type for seed display, default to oxide
    const latestType: FeatureType = features[0]?.type || 'oxide';

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
                    <div className="text-[10px] uppercase text-mission-muted bg-black/50 px-2 py-1 rounded w-fit absolute top-2 left-2 z-10 flex items-center gap-1">
                        <Scan size={10} /> Target Signature
                    </div>
                    <div className="flex-1 bg-black border border-mission-border rounded overflow-hidden relative">
                        <SeedImagePlaceholder type={latestType} />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                        <div className="absolute bottom-2 left-2 text-[10px] uppercase text-mission-muted font-mono">
                            {latestType.toUpperCase()} SEED
                        </div>
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
                        <div key={feat.id} className={clsx(
                            "bg-mission-bg border p-2 rounded flex gap-3 text-xs relative group transition-all duration-300",
                            feat.status === 'valid' ? "border-mission-green/30 hover:border-mission-green/50" :
                                feat.status === 'rejected' ? "border-mission-alert/30 hover:border-mission-alert/50" :
                                    "border-mission-border hover:border-mission-cyan/50"
                        )}>
                            <div className="w-14 h-14 rounded overflow-hidden shrink-0 border border-mission-border/50">
                                <SeedImagePlaceholder type={feat.type} />
                            </div>
                            <div className="flex flex-col justify-between flex-1 min-w-0">
                                <div className="flex justify-between items-start gap-2">
                                    <span className="font-mono text-mission-cyan uppercase font-bold text-[11px] truncate">{feat.type}</span>
                                    <span className={clsx("px-1.5 py-0.5 rounded text-[9px] font-bold uppercase shrink-0",
                                        feat.status === 'valid' ? 'bg-mission-green/20 text-mission-green' :
                                            feat.status === 'rejected' ? 'bg-mission-alert/20 text-mission-alert' : 'bg-mission-amber/20 text-mission-amber'
                                    )}>{feat.status}</span>
                                </div>
                                <div className="space-y-0.5 text-mission-muted">
                                    <div className="flex justify-between text-[10px]">
                                        <span>Conf:</span>
                                        <span className={clsx("font-mono", feat.confidence > 85 ? "text-mission-green" : "text-mission-amber")}>
                                            {feat.confidence.toFixed(1)}%
                                        </span>
                                    </div>
                                    <div className="text-[9px] opacity-60 font-mono">
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
