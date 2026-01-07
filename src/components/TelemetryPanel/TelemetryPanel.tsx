import { Battery, Signal, Zap, Navigation, AlertTriangle, CheckCircle2, Info, XCircle } from 'lucide-react';
import { RadialBarChart, RadialBar, ResponsiveContainer, PolarAngleAxis } from 'recharts';
import type { MissionEvent, TelemetryData } from '../../types/mission';
import clsx from 'clsx';

interface Props {
    data: TelemetryData;
    alerts?: MissionEvent[];
}

const CircularGauge = ({ value, color, label, icon: Icon }: { value: number, color: string, label: string, icon: any }) => {
    const chartData = [{ name: 'val', value: value, fill: color }];

    return (
        <div className="flex flex-col items-center justify-center w-full gap-0.5">
            <div className="relative w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 mx-auto flex-shrink-0">
                <div className="absolute inset-0 flex items-center justify-center text-mission-text font-mono z-10 flex-col">
                    <Icon size={10} className="mb-0 sm:mb-0.5 opacity-80" style={{ color }} />
                    <span className="text-[10px] sm:text-xs lg:text-sm font-bold">{Math.round(value)}%</span>
                </div>
                <ResponsiveContainer width="100%" height="100%">
                    <RadialBarChart innerRadius="70%" outerRadius="100%" data={chartData} startAngle={90} endAngle={-270} barSize={5}>
                        <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                        <RadialBar background dataKey="value" cornerRadius={10} />
                    </RadialBarChart>
                </ResponsiveContainer>
            </div>
            <span className="text-[7px] sm:text-[8px] lg:text-[9px] uppercase tracking-wider text-mission-muted leading-tight">{label}</span>
        </div>
    );
};

const AlertIcon = ({ type }: { type: MissionEvent['type'] }) => {
    switch (type) {
        case 'CRITICAL': return <XCircle size={12} className="text-mission-alert" />;
        case 'WARNING': return <AlertTriangle size={12} className="text-mission-amber" />;
        case 'SUCCESS': return <CheckCircle2 size={12} className="text-mission-green" />;
        default: return <Info size={12} className="text-mission-cyan" />;
    }
};

export const TelemetryPanel: React.FC<Props> = ({ data, alerts = [] }) => {
    // Determine colors based on thresholds
    const batteryColor = data.batteryLevel < 20 ? '#ff003c' : data.batteryLevel < 50 ? '#ffaa00' : '#0aff00';
    const signalColor = data.signalStrength < 40 ? '#ff003c' : '#00f0ff';
    const navColor = data.navigationConfidence < 70 ? '#ffaa00' : '#0aff00';

    // Add glow classes based on status
    const getGlowClass = (val: number, type: 'battery' | 'signal' | 'nav') => {
        if (type === 'battery' && val < 20) return 'shadow-[0_0_10px_rgba(255,0,60,0.3)]';
        if (type === 'battery' && val > 80) return 'shadow-[0_0_10px_rgba(10,255,0,0.2)]';
        if (type === 'signal' && val > 80) return 'shadow-[0_0_10px_rgba(0,240,255,0.2)]';
        return '';
    };

    const recentAlerts = alerts.slice(0, 3);

    return (
        <div className="bg-mission-panel/90 border border-mission-border p-3 sm:p-4 rounded-lg shadow-lg flex flex-col h-full backdrop-blur-sm relative overflow-hidden group">
            {/* Decorative corner accents */}
            <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-mission-border/50 rounded-tr-lg opacity-50"></div>
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-mission-border/50 rounded-bl-lg opacity-50"></div>

            <h2 className="text-mission-muted text-[10px] sm:text-xs uppercase tracking-[0.2em] mb-4 flex items-center gap-2 border-b border-mission-border/30 pb-2">
                <Zap size={14} className="text-mission-cyan/70" /> Telemetry Vitals
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 flex-1 items-center px-1">
                <CircularGauge value={data.batteryLevel} color={batteryColor} label="Battery" icon={Battery} />
                <CircularGauge value={data.signalStrength} color={signalColor} label="RF Signal" icon={Signal} />
                <CircularGauge value={data.navigationConfidence} color={navColor} label="Nav Conf" icon={Navigation} />
                <CircularGauge value={data.computeHealth} color="#00f0ff" label="Compute" icon={Zap} />
            </div>

            <div className="mt-4 pt-3 border-t border-mission-border/30 flex flex-col lg:grid lg:grid-cols-2 gap-4">
                <div className="hidden sm:grid grid-cols-2 gap-x-6 gap-y-1">
                    <div className="flex justify-between items-baseline text-[10px] font-mono text-mission-muted">
                        <span>V_Batt</span>
                        <span className="text-mission-text font-bold text-xs">{(data.batteryLevel * 0.12 + 10).toFixed(1)}V</span>
                    </div>
                    <div className="flex justify-between items-baseline text-[10px] font-mono text-mission-muted">
                        <span>I_Draw</span>
                        <span className="text-mission-text font-bold text-xs">{(2.4 + Math.random()).toFixed(1)}A</span>
                    </div>
                    <div className="flex justify-between items-baseline text-[10px] font-mono text-mission-muted">
                        <span>Temp</span>
                        <span className="text-mission-text font-bold text-xs">42°C</span>
                    </div>
                    <div className="flex justify-between items-baseline text-[10px] font-mono text-mission-muted">
                        <span>UpTime</span>
                        <span className="text-mission-text font-bold text-xs">00:42:12</span>
                    </div>
                </div>

                {/* Alerts Section - Compact */}
                <div className="flex flex-col justify-end gap-1">
                    <div className="text-[9px] uppercase text-mission-muted tracking-wider flex items-center gap-1 mb-1">
                        <AlertTriangle size={10} /> Live Alerts
                    </div>
                    {recentAlerts.length === 0 ? (
                        <div className="text-[10px] text-mission-muted/40 font-mono italic p-1">-- No active alerts --</div>
                    ) : (
                        <div className="flex flex-col gap-1.5">
                            {recentAlerts.map(alert => (
                                <div key={alert.id} className={clsx(
                                    "flex items-center gap-2 text-[10px] font-mono px-2 py-1 rounded border-l-2 bg-mission-bg/50",
                                    alert.type === 'CRITICAL' && "border-mission-alert text-mission-alert",
                                    alert.type === 'WARNING' && "border-mission-amber text-mission-amber",
                                    alert.type === 'SUCCESS' && "border-mission-green text-mission-green",
                                    alert.type === 'INFO' && "border-mission-cyan text-mission-cyan"
                                )}>
                                    <AlertIcon type={alert.type} />
                                    <span className="truncate opacity-90">{alert.message}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
