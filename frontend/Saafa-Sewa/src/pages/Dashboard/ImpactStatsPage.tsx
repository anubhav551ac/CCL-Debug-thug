import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy } from 'lucide-react';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store'; // Adjusted for alias if needed

// ─── Animation Variants ────────────────────────────────────────────────────────
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.1,
            duration: 0.5,
        },
    },
};

const rowVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

// ─── Mock Data ─────────────────────────────────────────────────────────────────
const MOCK_LEADERS = [
    { id: 'm1', name: 'Sunita Shrestha', area: 'Maharajgunj', activePins: 4, rate: 94, points: 8400, role: 'CIVIC HERO' },
    { id: 'm2', name: 'Rohan K.C.', area: 'Baneshwor', activePins: 2, rate: 88, points: 7600, role: 'CIVIC HERO' },
    { id: 'm3', name: 'Maya Gurung', area: 'Naxal', activePins: 1, rate: 82, points: 5800, role: 'CITIZEN' },
    { id: 'm4', name: 'Nabil Bank', area: 'Corporate Sponsor', activePins: 0, rate: 100, points: 25000, role: 'PARTNER' },
    { id: 'm5', name: 'Kushal S.', area: 'Thamel', activePins: 5, rate: 76, points: 4200, role: 'CITIZEN' },
];

export default function ImpactStatsPage() {
    const currentUser = useSelector((state: RootState) => state.user.user);
    const [isLoading, setIsLoading] = useState(true);
    const [leaderboard, setLeaderboard] = useState<any[]>([]);

    useEffect(() => {
        // Simulate a 1-second hydration period
        const timer = setTimeout(() => {
            const combined = [...MOCK_LEADERS];
            
            // Reconcile current user into leaderboard
            if (currentUser) {
                const userEntry = {
                    id: currentUser.id || 'u1',
                    name: currentUser.name || 'Current User',
                    area: currentUser.municipality || 'Kathmandu Sector',
                    activePins: currentUser.totalReports || 0,
                    rate: 100, // Simplification
                    points: currentUser.reputation || 0,
                    role: currentUser.role || 'CITIZEN',
                    isCurrentUser: true,
                };
                
                // Add user if they have points and aren't mock-mirrored, otherwise just insert.
                // In a real app we'd merge cleanly.
                combined.push(userEntry);
            }

            // Sort by points descending
            combined.sort((a, b) => b.points - a.points);
            
            setLeaderboard(combined);
            setIsLoading(false);
        }, 1000);

        return () => clearTimeout(timer);
    }, [currentUser]);

    return (
        <div className="h-full pb-8">
            {/* The Elite Leaderboard Container */}
            <div 
                className="glass-panel rounded-[2.5rem] p-8 md:p-10 border relative overflow-hidden h-full flex flex-col"
                style={{ borderColor: 'rgba(16,185,129,0.15)', boxShadow: '0 0 40px rgba(16,185,129,0.05)' }}
            >
                {/* Header elements */}
                <div className="flex items-center gap-2 mb-6">
                    <div className="w-8 h-1 bg-emerald-500 rounded-full" />
                    <div className="w-8 h-1 bg-slate-200 rounded-full" />
                </div>
                
                <div className="flex justify-between items-end mb-10">
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-2 flex items-center gap-2">
                            <Trophy size={14} /> THE ELITE LEADERBOARD
                        </p>
                        <h2 className="text-3xl md:text-4xl font-black text-slate-900 leading-tight">Civic Command <br/>Rankings</h2>
                    </div>
                    {/* Action button representing some global action */}
                    <button className="hidden sm:flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-full text-xs font-bold hover:bg-emerald-600 transition-colors">
                        Deploy Resources
                    </button>
                </div>

                <div className="flex-1 overflow-x-auto w-full custom-scrollbar">
                    <table className="w-full min-w-[800px] border-collapse">
                        <thead>
                            <tr className="border-b border-slate-200">
                                <th className="pb-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest pl-6">Rank & Citizen</th>
                                <th className="pb-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Pins</th>
                                <th className="pb-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Response Rate</th>
                                <th className="pb-4 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest pr-6">Impact Points</th>
                            </tr>
                        </thead>
                        <AnimatePresence mode="wait">
                            {isLoading ? (
                                <motion.tbody 
                                    key="skeleton"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0, transition: { duration: 0.2 } }}
                                >
                                    {[1, 2, 3, 4, 5].map((i) => (
                                        <SkeletonRow key={i} />
                                    ))}
                                </motion.tbody>
                            ) : (
                                <motion.tbody 
                                    key="content"
                                    variants={containerVariants}
                                    initial="hidden"
                                    animate="visible"
                                    className="divide-y divide-transparent"
                                >
                                    {leaderboard.map((entry, idx) => (
                                        <LeaderboardRow key={entry.id} rank={idx + 1} data={entry} />
                                    ))}
                                </motion.tbody>
                            )}
                        </AnimatePresence>
                    </table>
                </div>
            </div>
        </div>
    );
}

// ─── Sub-components ────────────────────────────────────────────────────────────

function SkeletonRow() {
    return (
        <tr className="border-b-[12px] border-transparent">
            {/* Using a subtle light background with modern shimmer for skeleton */}
            <td colSpan={4} className="bg-white rounded-2xl h-20 px-6 relative overflow-hidden border border-slate-100 shadow-sm">
                <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-slate-200/50 to-transparent" />
                <div className="flex items-center justify-between w-full opacity-40">
                    <div className="flex items-center gap-4 w-1/3">
                        <div className="w-10 h-10 rounded-full bg-slate-200" />
                        <div className="space-y-2 flex-1">
                            <div className="h-4 bg-slate-200 rounded w-2/3" />
                            <div className="h-3 bg-slate-200 rounded w-1/3" />
                        </div>
                    </div>
                    <div className="h-4 bg-slate-200 rounded w-16" />
                    <div className="h-4 bg-slate-200 rounded w-24" />
                    <div className="h-6 bg-slate-200 rounded w-20" />
                </div>
            </td>
        </tr>
    );
}

function LeaderboardRow({ rank, data }: { rank: number; data: any }) {
    const isTop3 = rank <= 3;
    const rankColor = rank === 1 ? 'text-amber-600' : rank === 2 ? 'text-slate-500' : rank === 3 ? 'text-amber-700' : 'text-slate-500';

    return (
        <motion.tr 
            variants={rowVariants}
            className={`group bg-white border-b-[12px] border-transparent hover:bg-slate-50 transition-colors rounded-2xl ${
                data.isCurrentUser ? 'ring-2 ring-emerald-500 ring-inset' : ''
            }`}
        >
            <td className="py-5 pl-6 rounded-l-2xl">
                <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black ${
                        isTop3 ? 'bg-slate-100 border border-slate-200 shadow-inner' : 'bg-transparent text-slate-500'
                    }`}>
                        <span className={isTop3 ? rankColor : ''}>#{rank}</span>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-slate-100 overflow-hidden flex items-center justify-center border border-slate-200">
                        {data.role === 'PARTNER' ? (
                            <Trophy size={18} className="text-emerald-600" />
                        ) : (
                            <img 
                                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${data.name}`} 
                                alt={data.name} 
                                className="w-full h-full object-cover" 
                            />
                        )}
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-slate-900 tracking-wide">{data.name}</span>
                            {data.isCurrentUser && (
                                <span className="bg-emerald-500/20 text-emerald-600 text-[8px] px-1.5 py-0.5 rounded uppercase font-black tracking-widest">You</span>
                            )}
                        </div>
                        <span className="text-[10px] font-medium text-slate-500">{data.area} · <span className="text-emerald-600">{data.role}</span></span>
                    </div>
                </div>
            </td>
            
            <td className="py-5">
                <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${data.activePins > 0 ? 'bg-rose-500 animate-pulse' : 'bg-slate-400'}`} />
                    <span className="text-sm font-bold text-slate-700">{data.activePins}</span>
                </div>
            </td>
            
            <td className="py-5">
                <div className="flex items-center gap-3">
                    <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden w-24">
                        <div className="h-full bg-emerald-500" style={{ width: `${data.rate}%` }} />
                    </div>
                    <span className="text-xs font-black text-slate-700">{data.rate}%</span>
                </div>
            </td>
            
            <td className="py-5 pr-6 rounded-r-2xl text-right">
                <div className="flex items-baseline justify-end gap-1">
                    <span className="text-xl font-black text-emerald-600 tracking-tighter">{data.points.toLocaleString()}</span>
                    <span className="text-[9px] font-bold text-slate-500 uppercase">pts</span>
                </div>
            </td>
        </motion.tr>
    );
}
