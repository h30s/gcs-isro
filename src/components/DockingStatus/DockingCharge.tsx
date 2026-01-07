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
        <div className="bg-mission-panel border border-mission-border p-4 rounded-lg shadow-lg flex flex-col h-full relative overflow-hidden">
            <h2 className="text-mission-muted text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
                <PlugZap size={14} /> Docking & Power
            </h2>

            <div className="flex gap-4">
                {/* Status Badge */}
                <div className={clsx("flex-1 p-3 rounded border flex flex-col items-center justify-center gap-1 transition-all duration-500",
                    isCharging ? "bg-mission-green/10 border-mission-green/50 text-mission-green" :
                        isDocked ? "bg-mission-cyan/10 border-mission-cyan/50 text-mission-cyan" :
                            isApproaching ? "bg-mission-amber/10 border-mission-amber/50 text-mission-amber" :
                                "bg-mission-bg border-mission-border text-mission-muted"
                )}>
                    {isCharging ? <RefreshCw className={clsx("mb-1", isCharging && "animate-spin")} size={20} /> :
                        isDocked ? <Check className="mb-1" size={20} /> :
                            isApproaching ? <Target className="mb-1 animate-pulse" size={20} /> :
                                <PlugZap className="mb-1 opacity-50" size={20} />}
                    <span className="text-xs font-bold uppercase tracking-wider">
                        {isCharging ? 'CHARGING' : isDocked ? 'DOCKED' : isApproaching ? 'APPROACHING' : 'UNDOCKED'}
                    </span>
                    <div className="text-[10px] opacity-70 flex items-center gap-1">
                        <Target size={10} />
                        ALIGN: {isDocked ? '100%' : isApproaching ? `${alignment.toFixed(0)}%` : '--'}
                    </div>
                </div>

                {/* Current Reading */}
                <div className="flex-1 p-3 rounded border border-mission-border bg-mission-bg flex flex-col justify-center">
                    <div className="text-[10px] text-mission-muted uppercase">Input Current</div>
                    <div className="text-xl font-mono font-bold text-mission-cyan">
                        {data.chargingCurrent?.toFixed(1) || '0.0'} <span className="text-xs text-mission-muted">A</span>
                    </div>
                </div>
            </div>

            {/* Cool charging Graph */}
            <div className="flex-1 mt-4 relative min-h-[60px]">
                <div className="absolute inset-0 opacity-50">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={isCharging ? CHARGING_CURVE : []}>
                            <defs>
                                <linearGradient id="colorCurrent" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#0aff00" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#0aff00" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <XAxis dataKey="time" hide />
                            <YAxis hide domain={[0, 6]} />
                            <Area type="monotone" dataKey="current" stroke="#0aff00" fillOpacity={1} fill="url(#colorCurrent)" isAnimationActive={false} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
                {!isCharging && (
                    <div className="absolute inset-0 flex items-center justify-center text-[10px] text-mission-muted font-mono uppercase tracking-widest">
                        -- No Valid Source --
                    </div>
                )}
            </div>
        </div>
    );
};
