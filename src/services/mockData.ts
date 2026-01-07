import type { DetectedFeature, TelemetryData } from '../types/mission';

// Initial state
export const INITIAL_TELEMETRY: TelemetryData = {
    missionState: 'IDLE',
    sortieNumber: 1,
    missionTime: 0,
    batteryLevel: 100,
    signalStrength: 100,
    navigationConfidence: 100,
    computeHealth: 98,
    uavPosition: { x: 0, y: 0, z: 0 },
    currentPath: [],
    lastUpdate: Date.now(),
    isEmergency: false,
};

// Simulation constants

// Random feature generator
export const generateFeature = (id: string, position: { x: number, y: number, z: number }): DetectedFeature => {
    const types = ['oxide', 'ice', 'rock'] as const;
    return {
        id,
        type: types[Math.floor(Math.random() * types.length)],
        position,
        confidence: 75 + Math.random() * 24,
        timestamp: Date.now(),
        status: Math.random() > 0.8 ? 'rejected' : 'valid',
    };
};
