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
        <div className="flex flex-col h-screen text-mission-text bg-mission-bg p-2 gap-2 overflow-hidden selection:bg-mission-cyan selection:text-black">
            {/* HEADER */}
            <header className="flex items-center justify-between p-3 bg-mission-panel/50 border border-mission-border/50 rounded backdrop-blur-sm shrink-0">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-mission-cyan">
                        <Rocket size={24} />
                        <h1 className="text-xl font-bold tracking-widest uppercase font-mono">
                            ISRO <span className="text-white opacity-50">IRoC-U GCS</span>
                        </h1>
                    </div>
                    <div className="h-6 w-px bg-mission-border" />
                    <div className="text-xs uppercase tracking-wider text-mission-muted">
                        <div>Project ASCEND</div>
                        <div className="text-[10px] opacity-60">Autonomous Scientific Sortie & Exploration</div>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className={clsx("flex items-center gap-2 text-xs font-mono px-3 py-1 rounded border",
                        isConnected ? "border-mission-green/30 text-mission-green bg-mission-green/5" : "border-mission-alert/30 text-mission-alert bg-mission-alert/5"
                    )}>
                        {isConnected ? <Wifi size={14} /> : <WifiOff size={14} />}
                        {isConnected ? "LINK ESTABLISHED" : "LINK LOST"}
                    </div>
                    <div className="text-right text-[10px] text-mission-muted hidden md:block">
                        <div>UTC {new Date().toISOString().split('T')[0]}</div>
                        <div>LATENCY: 42ms</div>
                    </div>
                </div>
            </header>

            {/* MAIN GRID */}
            <main className="flex-1 grid grid-cols-12 grid-rows-12 gap-2 min-h-0">

                {/* TOP ROW: STATUS & TELEMETRY */}
                <div className="col-span-12 lg:col-span-3 row-span-3 lg:row-span-3">
                    <MissionStatus
                        state={telemetry.missionState}
                        sortieNumber={telemetry.sortieNumber}
                        missionTime={telemetry.missionTime}
                        isEmergency={telemetry.isEmergency}
                    />
                </div>
                <div className="col-span-12 lg:col-span-9 row-span-3 lg:row-span-3">
                    <TelemetryPanel data={telemetry} alerts={alerts} />
                </div>

                {/* MIDDLE: MAP & 3D & IMAGES */}
                <div className="col-span-12 lg:col-span-4 row-span-6">
                    <ArenaMap data={telemetry} features={recentFeatures} />
                </div>

                {/* 3D Viewer - Centerpiece */}
                <div className="col-span-12 lg:col-span-4 row-span-6 relative group overflow-hidden">
                    <PointCloud3D features={recentFeatures} />
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] text-mission-muted bg-black/80 px-2 rounded pointer-events-none">
                        Mouse: Rotate • Scroll: Zoom
                    </div>
                </div>

                {/* Image Validation */}
                <div className="col-span-12 lg:col-span-4 row-span-6">
                    <ImageValidation features={recentFeatures} />
                </div>

                {/* BOTTOM: LOGS & DOCKING */}
                <div className="col-span-12 lg:col-span-8 row-span-3">
                    <SortieLogs />
                </div>
                <div className="col-span-12 lg:col-span-4 row-span-3">
                    <DockingCharge data={telemetry} />
                </div>
            </main>

            {/* FOOTER */}
            <footer className="shrink-0 flex items-center justify-between px-4 py-1 text-[10px] text-mission-muted border-t border-mission-border/30 bg-black/20">
                <div>
                    ASCEND OPERATES WITHOUT HUMAN INTERVENTION. LIMITED TO OBSERVATION ONLY.
                </div>
                <div className="font-mono">
                    VER 1.0.4-RELEASE • ISRO ROBOTICS CHALLENGE 2026
                </div>
            </footer>
        </div>
    );
};
