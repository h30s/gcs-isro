import { useEffect, useState } from 'react';
import type { DetectedFeature, MissionEvent, TelemetryData } from '../types/mission';
import { mockSocket } from '../services/mockSocket';
import { INITIAL_TELEMETRY } from '../services/mockData';

export const useMissionData = () => {
    const [telemetry, setTelemetry] = useState<TelemetryData>(INITIAL_TELEMETRY);
    const [recentFeatures, setRecentFeatures] = useState<DetectedFeature[]>([]);
    const [alerts, setAlerts] = useState<MissionEvent[]>([]);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        mockSocket.connect();
        setIsConnected(true);

        const handleTelemetry = (data: TelemetryData) => {
            setTelemetry(data);
        };

        const handleFeature = (feature: DetectedFeature) => {
            setRecentFeatures(prev => [feature, ...prev].slice(0, 50)); // Keep last 50
        };

        const handleEvent = (event: MissionEvent) => {
            setAlerts(prev => [event, ...prev].slice(0, 10)); // Keep last 10 alerts
        };

        mockSocket.on('telemetry', handleTelemetry);
        mockSocket.on('feature', handleFeature);
        mockSocket.on('event', handleEvent);

        return () => {
            mockSocket.off('telemetry', handleTelemetry);
            mockSocket.off('feature', handleFeature);
            mockSocket.off('event', handleEvent);
            mockSocket.disconnect();
            setIsConnected(false);
        };
    }, []);

    return { telemetry, recentFeatures, alerts, isConnected };
};
