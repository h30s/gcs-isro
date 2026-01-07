import { useEffect, useState } from 'react';
import type { DetectedFeature, TelemetryData } from '../types/mission';
import { mockSocket } from '../services/mockSocket';
import { INITIAL_TELEMETRY } from '../services/mockData';

export const useMissionData = () => {
    const [telemetry, setTelemetry] = useState<TelemetryData>(INITIAL_TELEMETRY);
    const [recentFeatures, setRecentFeatures] = useState<DetectedFeature[]>([]);
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

        mockSocket.on('telemetry', handleTelemetry);
        mockSocket.on('feature', handleFeature);

        return () => {
            mockSocket.off('telemetry', handleTelemetry);
            mockSocket.off('feature', handleFeature);
            mockSocket.disconnect();
            setIsConnected(false);
        };
    }, []);

    return { telemetry, recentFeatures, isConnected };
};
