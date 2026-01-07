import type { DetectedFeature, MissionEvent, TelemetryData } from '../types/mission';
import { generateFeature, INITIAL_TELEMETRY } from './mockData';

type Listener = (data: TelemetryData) => void;
type FeatureListener = (feature: DetectedFeature) => void;
type EventListener = (event: MissionEvent) => void;

class MockSocketService {
    private telemetry: TelemetryData = { ...INITIAL_TELEMETRY };
    private listeners: Listener[] = [];
    private featureListeners: FeatureListener[] = [];
    private eventListeners: EventListener[] = [];
    private intervalId: ReturnType<typeof setInterval> | null = null;
    private missionStartTime: number = Date.now();

    connect() {
        if (this.intervalId) return;
        this.missionStartTime = Date.now();
        this.intervalId = setInterval(() => this.updateLoop(), 1000); // 1Hz update
        console.log('Mock Socket Connected');
    }

    disconnect() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }

    on(event: 'telemetry', callback: Listener): void;
    on(event: 'feature', callback: FeatureListener): void;
    on(event: 'event', callback: EventListener): void;
    on(event: string, callback: any): void {
        if (event === 'telemetry') {
            this.listeners.push(callback);
        } else if (event === 'feature') {
            this.featureListeners.push(callback);
        } else if (event === 'event') {
            this.eventListeners.push(callback);
        }
    }

    off(event: 'telemetry', callback: Listener): void;
    off(event: 'feature', callback: FeatureListener): void;
    off(event: 'event', callback: EventListener): void;
    off(event: string, callback: any): void {
        if (event === 'telemetry') {
            this.listeners = this.listeners.filter(l => l !== callback);
        } else if (event === 'feature') {
            this.featureListeners = this.featureListeners.filter(l => l !== callback);
        } else if (event === 'event') {
            this.eventListeners = this.eventListeners.filter(l => l !== callback);
        }
    }

    private updateLoop() {
        // Update mission time
        this.telemetry.missionTime = Math.floor((Date.now() - this.missionStartTime) / 1000);

        // 1. Update Mission State
        this.updateMissionState();

        // 2. Simulate Movement
        this.updatePosition();

        // 3. Update Vitals
        this.updateVitals();

        // 4. Randomly trigger feature detection
        if (this.telemetry.missionState === 'SEARCH' || this.telemetry.missionState === 'DETECT') {
            if (Math.random() < 0.3) {
                const feature = generateFeature(
                    `feat-${Date.now()}`,
                    { ...this.telemetry.uavPosition }
                );
                this.featureListeners.forEach(l => l(feature));
            }
        }

        // 5. Randomly generate alerts
        this.generateAlerts();

        // 6. Emit
        this.telemetry.lastUpdate = Date.now();
        this.listeners.forEach(l => l({ ...this.telemetry }));
    }

    private generateAlerts() {
        // Low battery warning
        if (this.telemetry.batteryLevel < 30 && this.telemetry.batteryLevel > 28 && Math.random() > 0.7) {
            this.emitEvent('WARNING', 'Battery level below 30%');
        }
        // Navigation drift alert
        if (this.telemetry.navigationConfidence < 85 && Math.random() > 0.9) {
            this.emitEvent('WARNING', 'Navigation confidence degraded');
        }
        // Feature validation success
        if (Math.random() > 0.95) {
            this.emitEvent('SUCCESS', 'Feature validated and logged');
        }
    }

    private emitEvent(type: MissionEvent['type'], message: string) {
        const event: MissionEvent = {
            id: `evt-${Date.now()}`,
            timestamp: Date.now(),
            type,
            message,
        };
        this.eventListeners.forEach(l => l(event));
    }

    private updateMissionState() {
        // Auto-progress state basic implementation
        if (this.telemetry.missionState === 'IDLE' && Math.random() > 0.9) this.telemetry.missionState = 'SEEDING';
        else if (this.telemetry.missionState === 'SEEDING' && Math.random() > 0.8) this.telemetry.missionState = 'SEARCH';
        else if (this.telemetry.missionState === 'SEARCH') {
            if (this.telemetry.batteryLevel < 30) this.telemetry.missionState = 'RETURN';
            else if (Math.random() > 0.9) this.telemetry.missionState = 'DETECT';
        }
        else if (this.telemetry.missionState === 'DETECT' && Math.random() > 0.7) this.telemetry.missionState = 'SEARCH';
        else if (this.telemetry.missionState === 'RETURN' && this.telemetry.uavPosition.x < 0.5) {
            this.telemetry.missionState = 'DOCKED';
            this.telemetry.dockingAlignment = 100;
        }
        else if (this.telemetry.missionState === 'DOCKED') this.telemetry.missionState = 'CHARGING';
        else if (this.telemetry.missionState === 'CHARGING' && this.telemetry.batteryLevel > 95) {
            this.telemetry.missionState = 'IDLE';
            this.telemetry.sortieNumber++;
            this.telemetry.dockingAlignment = undefined;
        }

        // Simulate docking alignment during RETURN
        if (this.telemetry.missionState === 'RETURN') {
            const distance = Math.sqrt(
                this.telemetry.uavPosition.x ** 2 + this.telemetry.uavPosition.y ** 2
            );
            this.telemetry.dockingAlignment = Math.max(0, Math.min(100, 100 - distance * 10));
        }
    }

    private updatePosition() {
        const { missionState, uavPosition } = this.telemetry;
        const speed = 0.5;

        if (missionState === 'RETURN') {
            uavPosition.x -= Math.sign(uavPosition.x) * Math.min(Math.abs(uavPosition.x), speed);
            uavPosition.y -= Math.sign(uavPosition.y) * Math.min(Math.abs(uavPosition.y), speed);
            uavPosition.z = Math.max(0, uavPosition.z - 0.1);
        } else if (missionState === 'SEARCH' || missionState === 'DETECT') {
            uavPosition.x += (Math.random() - 0.5) * speed;
            uavPosition.y += (Math.random() - 0.5) * speed;
            uavPosition.z = 1 + (Math.random() - 0.5) * 0.2;
        } else if (missionState === 'IDLE' || missionState === 'DOCKED' || missionState === 'CHARGING') {
            uavPosition.x = 0;
            uavPosition.y = 0;
            uavPosition.z = 0;
        }

        if (missionState === 'SEARCH' || missionState === 'RETURN' || missionState === 'DETECT') {
            this.telemetry.currentPath.push({ ...uavPosition });
            if (this.telemetry.currentPath.length > 500) this.telemetry.currentPath.shift();
        } else if (missionState === 'IDLE') {
            this.telemetry.currentPath = [];
        }
    }

    private updateVitals() {
        if (this.telemetry.missionState === 'CHARGING') {
            this.telemetry.batteryLevel = Math.min(100, this.telemetry.batteryLevel + 2);
            this.telemetry.chargingCurrent = 5.0; // Amps
        } else if (this.telemetry.missionState !== 'IDLE' && this.telemetry.missionState !== 'DOCKED') {
            this.telemetry.batteryLevel = Math.max(0, this.telemetry.batteryLevel - 0.2);
            this.telemetry.chargingCurrent = 0;
        }
        this.telemetry.signalStrength = 80 + Math.random() * 20;
        this.telemetry.navigationConfidence = 90 + Math.random() * 10;
    }
}

export const mockSocket = new MockSocketService();
