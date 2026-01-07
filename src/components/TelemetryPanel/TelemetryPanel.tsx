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
        <div className="flex flex-col items-center justify-center relative w-full aspect-square max-w-[120px]">
            <div className="absolute inset-0 flex items-center justify-center text-mission-text font-mono z-10 flex-col">
                <Icon size={16} className="mb-1 opacity-80" style={{ color }} />
                <span className="text-lg font-bold">{Math.round(value)}%</span>
            </div>
            <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart innerRadius="70%" outerRadius="100%" data={chartData} startAngle={90} endAngle={-270} barSize={6}>
                    <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                    <RadialBar background dataKey="value" cornerRadius={10} />
                </RadialBarChart>
            </ResponsiveContainer>
            <span className="text-[10px] uppercase tracking-widest text-mission-muted mt-[-10px]">{label}</span>
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

    const recentAlerts = alerts.slice(0, 3);

    return (
        <div className="bg-mission-panel border border-mission-border p-4 rounded-lg shadow-lg flex flex-col h-full">
            <h2 className="text-mission-muted text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
                <Zap size={14} /> Telemetry Vitals
            </h2>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 flex-1 items-center">
                <CircularGauge value={data.batteryLevel} color={batteryColor} label="Battery" icon={Battery} />
                <CircularGauge value={data.signalStrength} color={signalColor} label="RF Signal" icon={Signal} />
                <CircularGauge value={data.navigationConfidence} color={navColor} label="Nav Conf" icon={Navigation} />
                <CircularGauge value={data.computeHealth} color="#00f0ff" label="Compute" icon={Zap} />
            </div>

            <div className="mt-4 pt-3 border-t border-mission-border/50 grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <div className="flex justify-between text-xs font-mono text-mission-muted">
                        <span>UAV V_Batt:</span>
                        <span className="text-mission-text">{(data.batteryLevel * 0.12 + 10).toFixed(1)}V</span>
                    </div>
                    <div className="flex justify-between text-xs font-mono text-mission-muted">
                        <span>Temp:</span>
                        <span className="text-mission-text">42°C</span>
                    </div>
                </div>

                {/* Alerts Section */}
                <div className="space-y-1">
                    <div className="text-[9px] uppercase text-mission-muted tracking-wider flex items-center gap-1">
                        <AlertTriangle size={10} /> Alerts
                    </div>
                    {recentAlerts.length === 0 ? (
                        <div className="text-[10px] text-mission-muted/50 font-mono">No active alerts</div>
                    ) : (
                        recentAlerts.map(alert => (
                            <div key={alert.id} className={clsx(
                                "flex items-center gap-1.5 text-[10px] font-mono px-1.5 py-0.5 rounded",
                                alert.type === 'CRITICAL' && "bg-mission-alert/10 text-mission-alert",
                                alert.type === 'WARNING' && "bg-mission-amber/10 text-mission-amber",
                                alert.type === 'SUCCESS' && "bg-mission-green/10 text-mission-green",
                                alert.type === 'INFO' && "bg-mission-cyan/10 text-mission-cyan"
                            )}>
                                <AlertIcon type={alert.type} />
                                <span className="truncate">{alert.message}</span>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};
