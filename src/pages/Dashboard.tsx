import { useMissionData } from '../hooks/useMissionData';
import { MissionStatus } from '../components/MissionStatus/MissionStatus';
import { TelemetryPanel } from '../components/TelemetryPanel/TelemetryPanel';
import { ArenaMap } from '../components/ArenaMap/ArenaMap';
import { PointCloud3D } from '../components/PointCloud3D/PointCloud3D';
import { ImageValidation } from '../components/ImageValidation/ImageValidation';
import { SortieLogs } from '../components/SortieLogs/SortieLogs';
import { DockingCharge } from '../components/DockingStatus/DockingCharge';
import { Rocket, Wifi, WifiOff } from 'lucide-react';
import clsx from 'clsx';

export const Dashboard = () => {
    const { telemetry, recentFeatures, alerts, isConnected } = useMissionData();

    return (
        <div className="flex flex-col min-h-screen text-mission-text bg-mission-bg p-2 gap-2 selection:bg-mission-cyan selection:text-black">
            {/* HEADER */}
            <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-2 sm:p-3 bg-mission-panel/50 border border-mission-border/50 rounded backdrop-blur-sm shrink-0 gap-2">
                <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
                    <div className="flex items-center gap-2 text-mission-cyan">
                        <Rocket size={20} className="sm:w-6 sm:h-6" />
                        <h1 className="text-base sm:text-xl font-bold tracking-widest uppercase font-mono">
                            Eternal <span className="text-white opacity-50 hidden xs:inline">IRoC-U</span> <span className="text-white opacity-50">GCS</span>
                        </h1>
                    </div>
                    <div className="hidden md:block h-6 w-px bg-mission-border" />
                    <div className="hidden md:block text-xs uppercase tracking-wider text-mission-muted">
                        <div>Project ASCEND</div>
                        <div className="text-[10px] opacity-60">Autonomous Scientific Sortie & Exploration</div>
                    </div>
                </div>

                <div className="flex items-center gap-2 sm:gap-4">
                    <div className={clsx("flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs font-mono px-2 sm:px-3 py-1 rounded border",
                        isConnected ? "border-mission-green/30 text-mission-green bg-mission-green/5" : "border-mission-alert/30 text-mission-alert bg-mission-alert/5"
                    )}>
                        {isConnected ? <Wifi size={12} /> : <WifiOff size={12} />}
                        <span className="hidden sm:inline">{isConnected ? "LINK ESTABLISHED" : "LINK LOST"}</span>
                        <span className="sm:hidden">{isConnected ? "LINKED" : "LOST"}</span>
                    </div>
                    <div className="text-right text-[10px] text-mission-muted hidden lg:block">
                        <div>UTC {new Date().toISOString().split('T')[0]}</div>
                        <div>LATENCY: 42ms</div>
                    </div>
                </div>
            </header>

            {/* MAIN CONTENT - Scrollable on mobile, grid on desktop */}
            <main className="flex-1 overflow-y-auto lg:overflow-hidden">
                <div className="flex flex-col lg:grid lg:grid-cols-12 lg:grid-rows-12 gap-2 lg:h-full p-1">

                    {/* TOP ROW: STATUS & TELEMETRY */}
                    <div className="h-auto lg:min-h-0 lg:col-span-3 lg:row-span-3 lg:row-start-1">
                        <MissionStatus
                            state={telemetry.missionState}
                            sortieNumber={telemetry.sortieNumber}
                            missionTime={telemetry.missionTime}
                            isEmergency={telemetry.isEmergency}
                        />
                    </div>
                    <div className="h-auto lg:min-h-0 lg:col-span-9 lg:row-span-3 lg:row-start-1 lg:col-start-4">
                        <TelemetryPanel data={telemetry} alerts={alerts} />
                    </div>

                    {/* MIDDLE: MAP & 3D & IMAGES */}
                    <div className="h-[250px] sm:h-[300px] lg:min-h-0 lg:col-span-4 lg:row-span-6 lg:row-start-4 lg:col-start-1 border border-mission-border/30 rounded-lg overflow-hidden">
                        <ArenaMap data={telemetry} features={recentFeatures} />
                    </div>

                    {/* 3D Viewer - Centerpiece */}
                    <div className="h-[250px] sm:h-[300px] lg:min-h-0 lg:col-span-4 lg:row-span-6 lg:row-start-4 lg:col-start-5 relative group overflow-hidden border border-mission-border/30 rounded-lg">
                        <PointCloud3D features={recentFeatures} />
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] text-mission-muted bg-black/80 px-2 rounded pointer-events-none z-20">
                            Mouse: Rotate • Scroll: Zoom
                        </div>
                    </div>

                    {/* Image Validation */}
                    <div className="h-[250px] sm:h-[280px] lg:min-h-0 lg:col-span-4 lg:row-span-6 lg:row-start-4 lg:col-start-9 overflow-hidden">
                        <ImageValidation features={recentFeatures} />
                    </div>

                    {/* BOTTOM: LOGS & DOCKING */}
                    <div className="h-auto lg:min-h-0 lg:col-span-8 lg:row-span-3 lg:row-start-10 lg:col-start-1 overflow-hidden">
                        <SortieLogs />
                    </div>
                    <div className="h-auto lg:min-h-0 lg:col-span-4 lg:row-span-3 lg:row-start-10 lg:col-start-9 overflow-hidden">
                        <DockingCharge data={telemetry} />
                    </div>
                </div>
            </main>

            {/* FOOTER */}
            <footer className="shrink-0 flex flex-col sm:flex-row items-center justify-between px-2 sm:px-4 py-1 text-[9px] sm:text-[10px] text-mission-muted border-t border-mission-border/30 bg-black/20 gap-1">
                <div className="text-center sm:text-left">
                    ASCEND: AUTONOMOUS OBSERVATION ONLY
                </div>
                <div className="font-mono hidden sm:block">
                    VER 1.0.4 • ISRO IRoC 2026
                </div>
            </footer>
        </div>
    );
};
