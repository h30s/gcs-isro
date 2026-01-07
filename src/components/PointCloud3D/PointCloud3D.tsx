import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Grid } from '@react-three/drei';
import { useRef, useMemo, useState } from 'react';
import * as THREE from 'three';
import { Cuboid, Filter, FilterX } from 'lucide-react';
import clsx from 'clsx';
import type { DetectedFeature, FeatureType } from '../../types/mission';

interface Props {
    features: DetectedFeature[];
}

const Point = ({ position, type }: { position: [number, number, number], type: FeatureType, confidence: number }) => {
    const meshRef = useRef<THREE.Mesh>(null);

    const color = useMemo(() => {
        switch (type) {
            case 'oxide': return '#ff3333';
            case 'ice': return '#00f0ff';
            case 'rock': return '#888888';
            default: return '#ffffff';
        }
    }, [type]);

    useFrame(() => {
        if (meshRef.current) {
            meshRef.current.rotation.y += 0.02;
        }
    });

    return (
        <mesh ref={meshRef} position={position}>
            <octahedronGeometry args={[0.2, 0]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} wireframe />
        </mesh>
    );
};



export const PointCloud3D: React.FC<Props> = ({ features }) => {
    const [showValidatedOnly, setShowValidatedOnly] = useState(false);

    const filteredFeatures = useMemo(() => {
        return showValidatedOnly ? features.filter(f => f.status === 'valid') : features;
    }, [features, showValidatedOnly]);

    return (
        <div className="bg-mission-panel border border-mission-border p-0 rounded-lg shadow-lg flex flex-col h-full relative overflow-hidden">
            <div className="absolute top-4 left-4 z-10 pointer-events-none">
                <h2 className="text-mission-muted text-xs uppercase tracking-widest flex items-center gap-2 bg-black/50 px-2 py-1 rounded backdrop-blur-sm">
                    <Cuboid size={14} /> 3D Point Cloud Scanner
                </h2>
            </div>

            {/* Toggle Button */}
            <div className="absolute top-4 right-4 z-10">
                <button
                    onClick={() => setShowValidatedOnly(!showValidatedOnly)}
                    className={clsx(
                        "flex items-center gap-1.5 text-[10px] uppercase font-bold px-2 py-1 rounded border transition-all duration-200",
                        showValidatedOnly
                            ? "bg-mission-green/20 border-mission-green/50 text-mission-green"
                            : "bg-black/50 border-mission-border text-mission-muted hover:border-mission-cyan/50 hover:text-mission-cyan"
                    )}
                >
                    {showValidatedOnly ? <Filter size={12} /> : <FilterX size={12} />}
                    {showValidatedOnly ? 'Validated' : 'Raw Scan'}
                </button>
            </div>

            <div className="w-full h-full bg-[#020202]">
                <Canvas camera={{ position: [5, 5, 5], fov: 45 }}>
                    <ambientLight intensity={0.5} />
                    <pointLight position={[10, 10, 10]} />

                    <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
                    <Grid infiniteGrid sectionSize={1} sectionColor="#00f0ff" cellColor="#111" fadeDistance={30} />

                    <OrbitControls makeDefault autoRotate autoRotateSpeed={0.5} minDistance={2} maxDistance={20} />

                    {/* Base Station Marker */}
                    <mesh position={[0, 0, 0]}>
                        <sphereGeometry args={[0.1]} />
                        <meshBasicMaterial color="#0aff00" />
                    </mesh>

                    {/* Features */}
                    {filteredFeatures.map((f) => (
                        <Point
                            key={f.id}
                            position={[f.position.x, f.position.z, f.position.y]}
                            type={f.type}
                            confidence={f.confidence}
                        />
                    ))}

                </Canvas>
            </div>

            <div className="absolute bottom-4 left-4 z-10 flex flex-col gap-1 pointer-events-none">
                {['oxide', 'ice', 'rock'].map(type => (
                    <div key={type} className="flex items-center gap-2 text-[10px] uppercase bg-black/50 px-2 py-1 rounded">
                        <div className={clsx("w-2 h-2 rounded-full",
                            type === 'oxide' ? 'bg-[#ff3333]' :
                                type === 'ice' ? 'bg-[#00f0ff]' : 'bg-[#888888]'
                        )} />
                        <span className="text-mission-muted">{type}</span>
                    </div>
                ))}
            </div>

            {/* Feature count indicator */}
            <div className="absolute bottom-4 right-4 z-10 text-[10px] font-mono text-mission-muted bg-black/50 px-2 py-1 rounded">
                {filteredFeatures.length} pts
            </div>
        </div>
    );
};
