import { ClipboardList, CheckCircle2, XCircle } from 'lucide-react';

interface SortieRecord {
    id: number;
    time: string;
    duration: string;
    featuresFound: number;
    validationSuccess: number;
    batteryUsed: number;
    status: 'COMPLETE' | 'ABORTED' | 'ACTIVE';
}

const DEMO_LOGS: SortieRecord[] = [
    { id: 2, time: '14:32:00', duration: 'ACTIVE', featuresFound: 12, validationSuccess: 84, batteryUsed: 12, status: 'ACTIVE' },
    { id: 1, time: '12:15:00', duration: '24m 12s', featuresFound: 45, validationSuccess: 92, batteryUsed: 68, status: 'COMPLETE' },
    { id: 0, time: '10:00:00', duration: '05m 30s', featuresFound: 2, validationSuccess: 100, batteryUsed: 15, status: 'ABORTED' },
];

export const SortieLogs: React.FC = () => {
    return (
        <div className="bg-mission-panel border border-mission-border p-4 rounded-lg shadow-lg flex flex-col h-full">
            <h2 className="text-mission-muted text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
                <ClipboardList size={14} /> Sortie History
            </h2>

            <div className="flex-1 overflow-auto custom-scrollbar">
                <table className="w-full text-left border-collapse">
                    <thead className="sticky top-0 bg-mission-panel z-10">
                        <tr className="text-[10px] text-mission-muted uppercase border-b border-mission-border">
                            <th className="pb-2 pl-2">ID</th>
                            <th className="pb-2">Time</th>
                            <th className="pb-2">Dur</th>
                            <th className="pb-2 text-center">Feat</th>
                            <th className="pb-2 text-center">Val%</th>
                            <th className="pb-2">Stat</th>
                        </tr>
                    </thead>
                    <tbody className="text-xs font-mono">
                        {DEMO_LOGS.map((log) => (
                            <tr key={log.id} className="border-b border-mission-border/30 hover:bg-mission-border/20 transition-colors group">
                                <td className="py-3 pl-2 text-mission-cyan">#{log.id.toString().padStart(3, '0')}</td>
                                <td className="py-3 text-mission-text">{log.time}</td>
                                <td className="py-3 text-mission-muted">{log.duration}</td>
                                <td className="py-3 text-center">{log.featuresFound}</td>
                                <td className="py-3 text-center text-mission-green">{log.validationSuccess}%</td>
                                <td className="py-3">
                                    {log.status === 'COMPLETE' && <span className="text-mission-green flex items-center gap-1"><CheckCircle2 size={12} /> OK</span>}
                                    {log.status === 'ABORTED' && <span className="text-mission-alert flex items-center gap-1"><XCircle size={12} /> ABT</span>}
                                    {log.status === 'ACTIVE' && <span className="text-mission-cyan animate-pulse">RUN</span>}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
