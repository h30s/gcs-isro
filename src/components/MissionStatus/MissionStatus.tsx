import clsx from 'clsx';
import type { MissionState } from '../../types/mission';
import { Activity, Clock, ShieldCheck, TriangleAlert } from 'lucide-react';

interface Props {
    state: MissionState;
    sortieNumber: number;
    missionTime: number;
    isEmergency: boolean;
}

export const MissionStatus: React.FC<Props> = ({ state, sortieNumber, missionTime, isEmergency }) => {
    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="bg-mission-panel border border-mission-border p-4 rounded-lg shadow-lg relative overflow-hidden group">
            {/* Decorative neon line */}
            <div className={clsx("absolute top-0 left-0 w-1 h-full transition-colors duration-500",
                isEmergency ? "bg-mission-alert" : "bg-mission-cyan"
            )} />

            <h2 className="text-mission-muted text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
                <Activity size={14} /> Mission Status
            </h2>

            <div className="flex flex-col gap-6">
                {/* Main State Display */}
                <div className="flex items-center justify-between">
                    <div>
                        <div className="text-4xl font-bold font-mono tracking-widest transition-colors duration-300"
                            style={{ textShadow: `0 0 10px ${isEmergency ? '#ff003c' : 'rgba(0, 240, 255, 0.3)'}` }}>
                            {state}
                        </div>
                        <div className="text-xs text-mission-muted mt-1 uppercase">Current Phase</div>
                    </div>
                    <div className="text-right">
                        <div className="text-2xl font-mono text-mission-text">{formatTime(missionTime)}</div>
                        <div className="text-xs text-mission-muted mt-1 flex items-center justify-end gap-1">
                            <Clock size={10} /> Mission Time
                        </div>
                    </div>
                </div>

                {/* Sortie & Autonomy */}
                <div className="flex items-center justify-between pt-4 border-t border-mission-border/50">
                    <div>
                        <div className="text-lg font-mono text-mission-text">#{sortieNumber.toString().padStart(3, '0')}</div>
                        <div className="text-xs text-mission-muted">Sortie Number</div>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="px-3 py-1 bg-mission-cyan/10 border border-mission-cyan/30 rounded flex items-center gap-2 text-mission-cyan text-xs font-bold uppercase tracking-wider">
                            <ShieldCheck size={14} />
                            100% Autonomous
                        </div>
                        {isEmergency && (
                            <div className="px-3 py-1 bg-mission-alert/10 border border-mission-alert/30 rounded flex items-center gap-2 text-mission-alert text-xs font-bold uppercase tracking-wider animate-pulse">
                                <TriangleAlert size={14} />
                                EMERGENCY
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Background decoration */}
            <div className="absolute top-2 right-2 opacity-5 pointer-events-none">
                <Activity size={100} />
            </div>
        </div>
    );
};
