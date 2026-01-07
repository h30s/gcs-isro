export type MissionState =
    | 'IDLE'
    | 'SEEDING'
    | 'SEARCH'
    | 'DETECT'
    | 'RETURN'
    | 'DOCKED'
    | 'CHARGING';

export interface Vector3 {
    x: number;
    y: number;
    z: number;
}

export type FeatureType = 'oxide' | 'ice' | 'rock';

export interface DetectedFeature {
    id: string;
    type: FeatureType;
    position: Vector3;
    confidence: number;
    timestamp: number;
    imageUrl?: string;
    status: 'valid' | 'rejected' | 'pending';
}

export interface TelemetryData {
    missionState: MissionState;
    sortieNumber: number;
    missionTime: number; // seconds
    batteryLevel: number; // 0-100
    signalStrength: number; // 0-100
    navigationConfidence: number; // 0-100
    computeHealth: number; // 0-100
    uavPosition: Vector3; // Relative to base station
    currentPath: Vector3[]; // Trail
    lastUpdate: number;
    isEmergency: boolean;
    dockingAlignment?: number; // 0-100
    chargingCurrent?: number; // Amps
}

export interface MissionEvent {
    id: string;
    timestamp: number;
    type: 'INFO' | 'WARNING' | 'CRITICAL' | 'SUCCESS';
    message: string;
}
