import React, { useRef, useEffect } from 'react';
import { Map as MapIcon } from 'lucide-react';
import type { TelemetryData, DetectedFeature } from '../../types/mission';

interface Props {
    data: TelemetryData;
    features?: DetectedFeature[];
}

export const ArenaMap: React.FC<Props> = ({ data, features = [] }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Arena config (meters)
    const AREA_SIZE = 20; // -10 to 10

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Clear
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Dimensions
        const w = canvas.width;
        const h = canvas.height;
        const scale = w / AREA_SIZE; // pixels per meter
        const cx = w / 2;
        const cy = h / 2;

        // Draw Grid
        ctx.strokeStyle = 'rgba(0, 243, 255, 0.1)';
        ctx.lineWidth = 1;

        // Grid lines every 1 meter
        for (let i = -AREA_SIZE / 2; i <= AREA_SIZE / 2; i += 1) {
            const pos = i * scale;
            // Vert
            ctx.beginPath();
            ctx.moveTo(cx + pos, 0);
            ctx.lineTo(cx + pos, h);
            ctx.stroke();
            // Horiz
            ctx.beginPath();
            ctx.moveTo(0, cy + pos);
            ctx.lineTo(w, cy + pos);
            ctx.stroke();
        }

        // Draw detected features
        features.forEach(feat => {
            const fx = cx + feat.position.x * scale;
            const fy = cy - feat.position.y * scale;

            // Color by type
            let color = '#888888'; // rock
            if (feat.type === 'oxide') color = '#ff3333';
            else if (feat.type === 'ice') color = '#00f0ff';

            // Outer glow
            ctx.beginPath();
            ctx.fillStyle = color.replace(')', ', 0.3)').replace('rgb', 'rgba').replace('#', 'rgba(');
            ctx.arc(fx, fy, 8, 0, Math.PI * 2);
            ctx.fill();

            // Inner dot
            ctx.beginPath();
            ctx.fillStyle = color;
            ctx.arc(fx, fy, 4, 0, Math.PI * 2);
            ctx.fill();
        });

        // Origin (Base Station)
        ctx.fillStyle = '#0aff00';
        ctx.beginPath();
        ctx.arc(cx, cy, 6, 0, Math.PI * 2);
        ctx.fill();

        // Base station ring
        ctx.strokeStyle = 'rgba(10, 255, 0, 0.3)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(cx, cy, 10, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = 'rgba(10, 255, 0, 0.7)';
        ctx.font = '10px monospace';
        ctx.fillText("BASE", cx + 14, cy + 4);

        // Path
        if (data.currentPath.length > 1) {
            ctx.strokeStyle = 'rgba(255, 170, 0, 0.6)';
            ctx.lineWidth = 2;
            ctx.beginPath();
            data.currentPath.forEach((pt, i) => {
                const x = cx + pt.x * scale;
                const y = cy - pt.y * scale; // Invert Y for canvas
                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            });
            ctx.stroke();
        }

        // Current Pos
        const uavX = cx + data.uavPosition.x * scale;
        const uavY = cy - data.uavPosition.y * scale;

        // Pulse ring
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(0, 240, 255, 0.4)';
        ctx.lineWidth = 2;
        ctx.arc(uavX, uavY, 12, 0, Math.PI * 2);
        ctx.stroke();

        // Drone dot
        ctx.fillStyle = '#00f0ff';
        ctx.beginPath();
        ctx.arc(uavX, uavY, 6, 0, Math.PI * 2);
        ctx.fill();

        // Label
        ctx.fillStyle = '#00f0ff';
        ctx.font = '10px monospace';
        ctx.fillText(`${data.uavPosition.x.toFixed(1)}, ${data.uavPosition.y.toFixed(1)}`, uavX + 12, uavY - 12);

    }, [data, features]);

    return (
        <div className="bg-mission-panel border border-mission-border p-4 rounded-lg shadow-lg flex flex-col h-full relative overflow-hidden">
            <div className="absolute top-4 left-4 z-10">
                <h2 className="text-mission-muted text-xs uppercase tracking-widest flex items-center gap-2">
                    <MapIcon size={14} /> Arena Localization (Relative)
                </h2>
            </div>

            <div className="flex-1 flex items-center justify-center bg-[#050505] rounded border border-mission-border/30 overflow-hidden relative mt-8">
                <canvas
                    ref={canvasRef}
                    width={600}
                    height={600}
                    className="w-full h-full object-contain"
                />
                <div className="absolute bottom-2 right-2 text-xs text-mission-muted font-mono bg-black/50 px-2 py-1 rounded">
                    Scale: 1m/grid • Base Frame
                </div>
                <div className="absolute bottom-2 left-2 flex gap-2">
                    {['oxide', 'ice', 'rock'].map(type => (
                        <div key={type} className="flex items-center gap-1 text-[9px] uppercase bg-black/50 px-1.5 py-0.5 rounded">
                            <div className={`w-2 h-2 rounded-full ${type === 'oxide' ? 'bg-[#ff3333]' :
                                    type === 'ice' ? 'bg-[#00f0ff]' : 'bg-[#888888]'
                                }`} />
                            <span className="text-mission-muted">{type}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
