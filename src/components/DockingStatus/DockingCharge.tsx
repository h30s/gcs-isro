import { PlugZap, Check, RefreshCw, Target } from 'lucide-react';
import type { TelemetryData } from '../../types/mission';
import clsx from 'clsx';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis } from 'recharts';

interface Props {
    data: TelemetryData;
}

const CHARGING_CURVE = Array.from({ length: 20 }, (_, i) => ({
    time: i,
    current: i < 5 ? i * 1 : 5 - (i - 5) * 0.2 // Fake curve
}));

export const DockingCharge: React.FC<Props> = ({ data }) => {
    const isDocked = data.missionState === 'DOCKED' || data.missionState === 'CHARGING';
    const isCharging = data.missionState === 'CHARGING';
    const isApproaching = data.missionState === 'RETURN';
    const alignment = data.dockingAlignment ?? 0;

    return (
        <div className="bg-mission-panel border border-mission-border p-4 rounded-lg shadow-lg flex flex-col h-full relative overflow-hidden group">
            <h2 className="text-mission-muted text-xs uppercase tracking-widest mb-4 flex items-center gap-2 shrink-0">
                <PlugZap size={14} /> Docking & Power
            </h2>

            <div className="flex-1 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-mission-border scrollbar-track-transparent hover:scrollbar-thumb-mission-cyan/50">
                <div className="flex gap-4 items-stretch h-24 pb-4">
                    {/* Status Badge */}
                    <div className={clsx("flex-1 p-3 rounded border flex flex-col items-center justify-center gap-1 transition-all duration-500 relative overflow-hidden",
                        isCharging ? "bg-mission-green/5 border-mission-green/30 text-mission-green shadow-[0_0_15px_rgba(10,255,0,0.1)]" :
                            isDocked ? "bg-mission-cyan/5 border-mission-cyan/30 text-mission-cyan" :
                                isApproaching ? "bg-mission-amber/5 border-mission-amber/30 text-mission-amber" :
                                    "bg-mission-bg border-mission-border text-mission-muted"
                    )}>
                        {isCharging && <div className="absolute inset-0 bg-mission-green/5 animate-pulse" />}

                        {isCharging ? <RefreshCw className={clsx("mb-1 z-10", isCharging && "animate-spin")} size={24} /> :
                            isDocked ? <Check className="mb-1 z-10" size={24} /> :
                                isApproaching ? <Target className="mb-1 animate-pulse z-10" size={24} /> :
                                    <PlugZap className="mb-1 opacity-40 z-10" size={24} />}

                        <span className="text-sm font-bold uppercase tracking-wider z-10">
                            {isCharging ? 'CHARGING' : isDocked ? 'DOCKED' : isApproaching ? 'APPROACHING' : 'UNDOCKED'}
                        </span>

                        {(isApproaching || isDocked) && (
                            <div className="text-[10px] opacity-70 flex items-center gap-1 z-10 font-mono mt-1">
                                <Target size={10} />
                                ALIGN: {isDocked ? '100%' : `${alignment.toFixed(0)}%`}
                            </div>
                        )}
                    </div>

                    {/* Current Reading */}
                    <div className="w-1/3 p-3 rounded border border-mission-border/50 bg-mission-bg/50 flex flex-col justify-center items-center backdrop-blur-sm">
                        <div className="text-[9px] text-mission-muted uppercase tracking-wider mb-1">Input</div>
                        <div className="text-2xl font-mono font-bold text-mission-cyan">
                            {data.chargingCurrent?.toFixed(1) || '0.0'}
                        </div>
                        <span className="text-[10px] text-mission-muted font-bold">kW</span>
                    </div>
                </div>

                {/* Charging Graph */}
                <div className="relative min-h-[100px] border-t border-mission-border/30 pt-2 pb-4">
                    <div className="absolute inset-0 pt-2 opacity-60">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={isCharging ? CHARGING_CURVE : []}>
                                <defs>
                                    <linearGradient id="colorCurrent" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#0aff00" stopOpacity={0.4} />
                                        <stop offset="95%" stopColor="#0aff00" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="time" hide />
                                <YAxis hide domain={[0, 6]} />
                                <Area type="step" dataKey="current" stroke="#0aff00" strokeWidth={2} fillOpacity={1} fill="url(#colorCurrent)" isAnimationActive={true} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                    {!isCharging && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-mission-muted/30 gap-2">
                            <div className="w-full h-px bg-mission-border/30 w-3/4"></div>
                            <div className="text-[9px] font-mono uppercase tracking-widest">Power Source Disconnected</div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
