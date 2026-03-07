import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TrendingUp, Clock, Info, Zap, Activity, Target, Award, CheckCircle, Shield } from 'lucide-react';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store';
import { apiRequest } from '@/lib/api';

// ─── Animation Variants ────────────────────────────────────────────────────────
const leftColVariants = {
    hidden: { x: -60, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};

const rightColVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.65, delay: 0.2, ease: 'easeOut' } },
};

// ─── Types ─────────────────────────────────────────────────────────────────────
interface CommunityUpdate {
    id: string;
    type: 'pledge' | 'cleanup' | 'report';
    user: string;
    userPic?: string;
    action: string;
    location: string;
    createdAt: string;
}

interface PinRanking {
    id: string;
    municipality: string;
    bountyPool: number;
    progress: number;
    priority: 'Low' | 'Medium' | 'High';
}

// ─── Component ─────────────────────────────────────────────────────────────────
function DashboardPage() {
    const userState = useSelector((state: RootState) => state.user.user);
    const [updates, setUpdates] = useState<CommunityUpdate[]>([]);
    const [rankings, setRankings] = useState<PinRanking[]>([]);
    const [isInitialLoading, setIsInitialLoading] = useState(true);

    const fetchData = async () => {
        try {
            const [updatesRes, rankingsRes] = await Promise.all([
                apiRequest<CommunityUpdate[]>('/api/v1/community/updates'),
                apiRequest<PinRanking[]>('/api/v1/pins/rankings')
            ]);
            setUpdates(updatesRes);
            setRankings(rankingsRes);
        } catch (error) {
            console.error('Failed to fetch dashboard data:', error);
        } finally {
            setIsInitialLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 30000); // Poll every 30 seconds
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full pb-8">

            {/* ── LEFT COLUMN (Primary – 8/12) ───────────────────────── */}
            <motion.div
                className="lg:col-span-8 space-y-6"
                variants={leftColVariants}
                initial="hidden"
                animate="visible"
            >
                {/* Community Live Feed */}
                <div
                    className="glass-panel rounded-[2.5rem] p-8 flex flex-col min-h-[400px]"
                    style={{ border: '1px solid rgba(16,185,129,0.20)', boxShadow: '0 0 30px rgba(16,185,129,0.05)' }}
                >
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-9 h-9 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500">
                            <Activity size={18} />
                        </div>
                        <div>
                            <h2 className="text-md font-black uppercase tracking-widest text-slate-800">
                                COMMUNITY LIVE FEED
                            </h2>
                            <p className="text-[9px] text-slate-400 font-medium tracking-wide uppercase">
                                Real-time civic actions — Kathmandu Metro
                            </p>
                        </div>
                        {/* Pulse dot */}
                        <div className="ml-auto flex items-center gap-2">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                            </span>
                            <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">LIVE</span>
                        </div>
                    </div>

                    {/* Feed items */}
                    <div className="space-y-1 relative overflow-hidden flex-1">
                        <AnimatePresence initial={false}>
                            {updates.map((item) => (
                                <motion.div
                                    key={item.id}
                                    initial={{ opacity: 0, y: -20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.4, ease: "easeOut" }}
                                >
                                    <ActivityItem 
                                        user={item.user}
                                        action={item.action}
                                        location={item.location}
                                        time={new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}
                                        type={item.type}
                                    />
                                </motion.div>
                            ))}
                        </AnimatePresence>
                        {isInitialLoading && (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Activity className="animate-spin text-emerald-500" size={24} />
                            </div>
                        )}
                    </div>
                </div>

                {/* Top Trending Bounties */}
                <div
                    className="glass-panel rounded-[2.5rem] p-8"
                    style={{ border: '1px solid rgba(16,185,129,0.20)', boxShadow: '0 0 30px rgba(16,185,129,0.05)' }}
                >
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-500">
                            <TrendingUp size={20} />
                        </div>
                        <div>
                            <h3 className="text-lg font-black text-slate-900">Top Trending Bounties</h3>
                            <p className="text-xs text-slate-400 font-medium">Reports closest to hitting their funding threshold.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {rankings.map(ranking => (
                            <BountyProgressCard 
                                key={ranking.id}
                                location={ranking.municipality}
                                current={ranking.bountyPool}
                                target={1000}
                                urgency={ranking.priority}
                                progress={ranking.progress}
                            />
                        ))}
                        {!isInitialLoading && rankings.length === 0 && (
                            <p className="col-span-2 text-center text-slate-400 py-10 font-medium">No trending bounties found.</p>
                        )}
                    </div>
                </div>
            </motion.div>

            {/* ── RIGHT COLUMN (Secondary – 4/12) ────────────────────── */}
            <motion.div
                className="lg:col-span-4 space-y-5"
                variants={rightColVariants}
                initial="hidden"
                animate="visible"
            >
                {/* Civic Score Status Card */}
                <div className="glass-panel rounded-[2rem] p-6 relative overflow-hidden group"
                    style={{ border: '1px solid rgba(16,185,129,0.15)' }}>
                    <div className="absolute -top-6 -right-6 opacity-[0.06] group-hover:opacity-[0.10] transition-opacity">
                        <Award size={100} className="text-emerald-500" />
                    </div>
                    <p className="text-[9px] font-black text-emerald-500 uppercase tracking-widest mb-1">Civic Score</p>
                    <div className="flex items-baseline gap-2">
                        <span className="text-5xl font-black text-slate-900 tracking-tight">
                            {userState?.reputation ?? 0}
                        </span>
                        <span className="text-xs font-bold text-slate-400">pts</span>
                    </div>
                    <p className="text-[9px] text-slate-400 font-medium uppercase tracking-widest mt-1">
                        {userState?.name ?? 'Citizen'} · {userState?.role ?? 'CITIZEN'}
                    </p>
                </div>

                {/* Command Overview Stats */}
                <div className="glass-panel rounded-[2rem] p-6 space-y-4"
                    style={{ border: '1px solid rgba(16,185,129,0.15)' }}>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Command Overview</p>

                    <SidebarStatRow
                        label="TOTAL REPORTS"
                        value={userState?._count?.reportsCreated ?? 0}
                        icon={<Info size={13} />}
                        trend="+12% this week"
                        trendUp
                    />
                    <div className="h-px bg-slate-100" />
                    <SidebarStatRow
                        label="ACTIVE BOUNTIES"
                        value="Rs. 1k"
                        icon={<Target size={13} />}
                    />
                    <div className="h-px bg-slate-100" />
                    <SidebarStatRow
                        label="AVG. RESOLVE TIME"
                        value="3h"
                        icon={<Clock size={13} />}
                    />
                    <div className="h-px bg-slate-100" />
                    <SidebarStatRow
                        label="CLEANUPS DONE"
                        value={userState?._count?.cleanupsDone ?? 0}
                        icon={<Shield size={13} />}
                    />
                </div>

                {/* Municipality Performance */}
                <div className="glass-panel rounded-[2rem] p-6 shadow-lg relative overflow-hidden"
                    style={{ border: '1px solid rgba(16,185,129,0.15)' }}>
                    <div className="flex justify-between items-start mb-5">
                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">MUNICIPALITY PERFORMANCE</p>
                        <TrendingUp size={14} className="text-emerald-500" />
                    </div>

                    <div className="space-y-5">
                        <PerformanceBar label="Baneshwor (Best)" value={98} color="bg-emerald-500" textColor="text-emerald-600" />
                        <PerformanceBar label="Lazimpat" value={74} color="bg-amber-500" textColor="text-amber-500" />
                        <PerformanceBar label="Maharajgunj (Worst)" value={12} color="bg-rose-500" textColor="text-rose-500" />
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

// ─── Sub-components ────────────────────────────────────────────────────────────

function ActivityItem({ user, action, location, time, type }: {
    user: string; action: string; location: string; time: string; type: 'pledge' | 'cleanup' | 'report';
}) {
    const icons = {
        pledge: <Zap size={14} />,
        cleanup: <CheckCircle size={14} />,
        report: <Info size={14} />
    };

    return (
        <div className="flex items-center gap-3 py-2.5 px-3 rounded-xl hover:bg-emerald-500/5 transition-colors group border border-transparent hover:border-emerald-500/10">
            <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-emerald-500/10 group-hover:text-emerald-600 transition-colors flex-shrink-0">
                {icons[type]}
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-md text-slate-600 leading-tight truncate">
                    <span className="font-black text-slate-900">{user}</span>
                    {' '}{action}{' '}
                    <span className="font-semibold text-slate-700">{location}</span>
                </p>
            </div>
            <span className="font-mono text-md font-bold text-emerald-600/70 tracking-tight flex-shrink-0">{time}</span>
        </div>
    );
}

function BountyProgressCard({ location, current, target, urgency, progress }: {
    location: string; current: number; target: number; urgency: string; progress: number;
}) {
    return (
        <div className="glass-card p-6 border border-slate-100 hover:border-emerald-500/20 transition-all">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h4 className="font-bold text-slate-900 text-sm">{location}</h4>
                    <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${urgency === 'High' ? 'bg-orange-500/10 text-orange-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                        {urgency} Priority
                    </span>
                </div>
                <div className="text-right">
                    <p className="text-sm font-black text-emerald-600">Rs. {current}</p>
                    <p className="text-[10px] font-bold text-slate-400">of Rs. {target}</p>
                </div>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden mb-1.5">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    className={`h-full ${urgency === 'High' ? 'bg-orange-500' : 'bg-emerald-500'}`}
                />
            </div>
            <p className="text-[10px] font-bold text-slate-400 text-right">{Math.round(progress)}% Funded</p>
        </div>
    );
}

function SidebarStatRow({ label, value, icon, trend, trendUp }: {
    label: string; value: string | number; icon: React.ReactNode; trend?: string; trendUp?: boolean;
}) {
    return (
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
                <span className="text-slate-400">{icon}</span>
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{label}</span>
            </div>
            <div className="flex items-center gap-2">
                {trend && (
                    <span className={`text-[9px] font-bold ${trendUp ? 'text-emerald-500' : 'text-rose-500'}`}>{trend}</span>
                )}
                <span className="text-sm font-black text-slate-900">{value}</span>
            </div>
        </div>
    );
}

function PerformanceBar({ label, value, color, textColor }: {
    label: string; value: number; color: string; textColor: string;
}) {
    return (
        <div>
            <div className="flex justify-between mb-1.5">
                <span className="text-[10px] font-bold text-slate-700">{label}</span>
                <span className={`text-[10px] font-black ${textColor}`}>{value}% Resolve</span>
            </div>
            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${value}%` }}
                    transition={{ duration: 0.9, ease: 'easeOut' }}
                    className={`h-full ${color}`}
                />
            </div>
        </div>
    );
}

export default DashboardPage;