import clsx from 'clsx';
import type { MissionState } from '../../types/mission';
import { Activity, Clock, ShieldCheck, TriangleAlert, ChevronRight } from 'lucide-react';

interface Props {
    state: MissionState;
    sortieNumber: number;
    missionTime: number;
    isEmergency: boolean;
}

const MISSION_STATES: MissionState[] = ['IDLE', 'SEEDING', 'SEARCH', 'DETECT', 'RETURN', 'DOCKED', 'CHARGING'];

export const MissionStatus: React.FC<Props> = ({ state, sortieNumber, missionTime, isEmergency }) => {
    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const currentIndex = MISSION_STATES.indexOf(state);

    return (
        <div className="bg-mission-panel border border-mission-border p-4 rounded-lg shadow-lg relative overflow-hidden group h-full flex flex-col">
            {/* Decorative neon line */}
            <div className={clsx("absolute top-0 left-0 w-1 h-full transition-colors duration-500",
                isEmergency ? "bg-mission-alert" : "bg-mission-cyan"
            )} />

            <h2 className="text-mission-muted text-xs uppercase tracking-widest mb-3 flex items-center gap-2">
                <Activity size={14} /> Mission Status
            </h2>

            <div className="flex flex-col gap-3 flex-1">
                {/* Main State Display */}
                <div className="flex items-center justify-between">
                    <div>
                        <div className={clsx(
                            "text-3xl font-bold font-mono tracking-widest transition-all duration-300",
                            isEmergency && "text-mission-alert"
                        )}
                            style={{ textShadow: `0 0 15px ${isEmergency ? '#ff003c' : 'rgba(0, 240, 255, 0.5)'}` }}>
                            {state}
                        </div>
                        <div className="text-xs text-mission-muted mt-1 uppercase">Current Phase</div>
                    </div>
                    <div className="text-right">
                        <div className="text-2xl font-mono text-mission-text tabular-nums">{formatTime(missionTime)}</div>
                        <div className="text-xs text-mission-muted mt-1 flex items-center justify-end gap-1">
                            <Clock size={10} /> Mission Time
                        </div>
                    </div>
                </div>

                {/* State Pipeline */}
                <div className="flex items-center gap-0.5 py-2 overflow-x-auto">
                    {MISSION_STATES.map((s, i) => (
                        <div key={s} className="flex items-center">
                            <div className={clsx(
                                "px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-tight transition-all duration-300 whitespace-nowrap",
                                s === state
                                    ? "bg-mission-cyan/20 text-mission-cyan border border-mission-cyan/50 shadow-[0_0_8px_rgba(0,240,255,0.4)]"
                                    : i < currentIndex
                                        ? "bg-mission-green/10 text-mission-green/70 border border-mission-green/30"
                                        : "bg-mission-bg text-mission-muted/50 border border-mission-border/50"
                            )}>
                                {s}
                            </div>
                            {i < MISSION_STATES.length - 1 && (
                                <ChevronRight size={10} className={clsx(
                                    "mx-0.5 flex-shrink-0",
                                    i < currentIndex ? "text-mission-green/50" : "text-mission-border"
                                )} />
                            )}
                        </div>
                    ))}
                </div>

                {/* Sortie & Autonomy */}
                <div className="flex items-center justify-between pt-3 border-t border-mission-border/50 mt-auto">
                    <div>
                        <div className="text-lg font-mono text-mission-text">#{sortieNumber.toString().padStart(3, '0')}</div>
                        <div className="text-xs text-mission-muted">Sortie</div>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="px-2 py-1 bg-mission-cyan/10 border border-mission-cyan/30 rounded flex items-center gap-1.5 text-mission-cyan text-[10px] font-bold uppercase tracking-wider">
                            <ShieldCheck size={12} />
                            100% Autonomous
                        </div>
                        {isEmergency && (
                            <div className="px-2 py-1 bg-mission-alert/10 border border-mission-alert/30 rounded flex items-center gap-1.5 text-mission-alert text-[10px] font-bold uppercase tracking-wider animate-pulse">
                                <TriangleAlert size={12} />
                                ALERT
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Background decoration */}
            <div className="absolute top-2 right-2 opacity-5 pointer-events-none">
                <Activity size={80} />
            </div>
        </div>
    );
};
