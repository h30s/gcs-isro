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
        <div className="bg-mission-panel border border-mission-border p-3 sm:p-4 rounded-lg shadow-lg relative overflow-hidden group h-full flex flex-col">
            {/* Decorative neon line */}
            <div className={clsx("absolute top-0 left-0 w-1 h-full transition-colors duration-500",
                isEmergency ? "bg-mission-alert" : "bg-mission-cyan"
            )} />

            <h2 className="text-mission-muted text-[10px] sm:text-xs uppercase tracking-widest mb-2 sm:mb-3 flex items-center gap-2 pl-2">
                <Activity size={14} /> Mission Status
            </h2>

            <div className="flex flex-col gap-2 sm:gap-3 flex-1 pl-2">
                {/* Main State Display */}
                <div className="flex items-center justify-between gap-2">
                    <div className="min-w-0">
                        <div className={clsx(
                            "text-xl sm:text-3xl font-bold font-mono tracking-widest transition-all duration-300 truncate",
                            isEmergency && "text-mission-alert"
                        )}
                            style={{ textShadow: `0 0 15px ${isEmergency ? '#ff003c' : 'rgba(0, 240, 255, 0.5)'}` }}>
                            {state}
                        </div>
                        <div className="text-[10px] sm:text-xs text-mission-muted mt-0.5 sm:mt-1 uppercase">Current Phase</div>
                    </div>
                    <div className="text-right shrink-0">
                        <div className="text-lg sm:text-2xl font-mono text-mission-text tabular-nums">{formatTime(missionTime)}</div>
                        <div className="text-[10px] sm:text-xs text-mission-muted mt-0.5 sm:mt-1 flex items-center justify-end gap-1">
                            <Clock size={10} /> <span className="hidden sm:inline">Mission</span> Time
                        </div>
                    </div>
                </div>

                {/* State Pipeline - horizontally scrollable on mobile */}
                <div className="flex items-center gap-0.5 py-1 sm:py-2 overflow-x-auto scrollbar-hide">
                    {MISSION_STATES.map((s, i) => (
                        <div key={s} className="flex items-center shrink-0">
                            <div className={clsx(
                                "px-1 sm:px-1.5 py-0.5 rounded text-[8px] sm:text-[9px] font-bold uppercase tracking-tight transition-all duration-300 whitespace-nowrap",
                                s === state
                                    ? "bg-mission-cyan/20 text-mission-cyan border border-mission-cyan/50 shadow-[0_0_8px_rgba(0,240,255,0.4)]"
                                    : i < currentIndex
                                        ? "bg-mission-green/10 text-mission-green/70 border border-mission-green/30"
                                        : "bg-mission-bg text-mission-muted/50 border border-mission-border/50"
                            )}>
                                {s}
                            </div>
                            {i < MISSION_STATES.length - 1 && (
                                <ChevronRight size={8} className={clsx(
                                    "mx-0.5 flex-shrink-0",
                                    i < currentIndex ? "text-mission-green/50" : "text-mission-border"
                                )} />
                            )}
                        </div>
                    ))}
                </div>

                {/* Sortie & Autonomy */}
                <div className="flex items-center justify-between pt-2 sm:pt-3 border-t border-mission-border/50 mt-auto gap-2 flex-wrap">
                    <div>
                        <div className="text-base sm:text-lg font-mono text-mission-text">#{sortieNumber.toString().padStart(3, '0')}</div>
                        <div className="text-[10px] sm:text-xs text-mission-muted">Sortie</div>
                    </div>

                    <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
                        <div className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-mission-cyan/10 border border-mission-cyan/30 rounded flex items-center gap-1 text-mission-cyan text-[9px] sm:text-[10px] font-bold uppercase tracking-wider">
                            <ShieldCheck size={10} />
                            <span className="hidden sm:inline">100%</span> Auto
                        </div>
                        {isEmergency && (
                            <div className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-mission-alert/10 border border-mission-alert/30 rounded flex items-center gap-1 text-mission-alert text-[9px] sm:text-[10px] font-bold uppercase tracking-wider animate-pulse">
                                <TriangleAlert size={10} />
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
