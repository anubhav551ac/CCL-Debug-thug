import { motion } from 'motion/react';
import { TrendingUp, Star, Clock, MapPin, Info, Zap, Activity, Target, Award, Users } from 'lucide-react';

function DashboardPage() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full pb-8">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-8 space-y-6">
                {/* Personal Impact Card */}
                <div className="glass-panel rounded-[2.5rem] p-8 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Award size={120} className="text-primary" />
                    </div>
                    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <div className="px-3 py-1 bg-primary/10 rounded-full">
                                    <span className="text-[10px] font-black text-primary uppercase tracking-widest">Personal Command</span>
                                </div>
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Level 12 Commander</span>
                            </div>
                            <h2 className="text-4xl font-black text-slate-900 mb-2">Your Civic Score: <span className="text-primary">842</span></h2>
                            <p className="text-slate-500 font-medium max-w-md">You're in the top 5% of Ward 10. Your actions directly impact Kathmandu's cleanliness.</p>
                        </div>
                        <div className="flex gap-4">
                            <div className="glass-card p-4 min-w-[120px] text-center">
                                <p className="text-2xl font-black text-primary">5kg</p>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Plastic Saved</p>
                            </div>
                            <div className="glass-card p-4 min-w-[120px] text-center">
                                <p className="text-2xl font-black text-primary">2</p>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Cleanups Triggered</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Top Trending Bounties */}
                <div className="glass-panel rounded-[2.5rem] p-8">
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
                        <BountyProgressCard
                            location="Ward 3, Naxal"
                            current={400}
                            target={500}
                            urgency="High"
                        />
                        <BountyProgressCard
                            location="Ward 10, Baneshwor"
                            current={850}
                            target={1000}
                            urgency="Medium"
                        />
                    </div>
                </div>

                <div className="glass-panel rounded-[2.5rem] p-10">
                    <div className="flex items-center justify-between mb-10">
                        <div>
                            <h2 className="text-3xl font-black text-slate-900 mb-1">Command Overview</h2>
                            <p className="text-slate-400 font-medium text-sm">Real-time status of civic accountability.</p>
                        </div>
                        <div className="flex items-center gap-3 glass-card p-2">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Heatmap</span>
                            <button className="w-12 h-6 bg-slate-200 rounded-full relative transition-colors hover:bg-slate-300">
                                <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <StatCard
                            label="TOTAL REPORTS"
                            value="42"
                            trend="+12% this week"
                            trendUp={true}
                        />
                        <StatCard
                            label="ACTIVE BOUNTIES"
                            value="Rs. 12k"
                            subValue="8 Open Tasks"
                            icon={<Target size={14} className="text-primary" />}
                        />
                        <StatCard
                            label="AVG. RESOLVE TIME"
                            value="18h"
                            subValue="Optimized cycle"
                            icon={<Clock size={14} className="text-slate-400" />}
                        />
                    </div>

                    <div className="mt-12">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-widest">ACTIVE SECTOR MONITOR</h3>
                            <motion.button
                                whileTap={{ scale: 0.95 }}
                                className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline"
                            >
                                View Live Map
                            </motion.button>
                        </div>
                        <div className="relative h-80 glass-card overflow-hidden border-4 border-white">
                            <img
                                src="https://picsum.photos/seed/map/1200/800"
                                alt="Map"
                                className="w-full h-full object-cover opacity-40 grayscale"
                                referrerPolicy="no-referrer"
                            />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="relative">
                                    <div className="w-32 h-32 bg-primary/10 rounded-full animate-ping absolute -inset-8" />
                                    <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center relative z-10">
                                        <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center shadow-lg">
                                            <MapPin className="text-white" size={20} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


            </div>

            {/* Right Column - Sidebar Widgets */}
            <div className="lg:col-span-4 space-y-6">
                {/* Community Live Feed */}
                <div className="glass-panel rounded-[2.5rem] p-8 flex flex-col h-[500px]">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                            <Activity size={20} />
                        </div>
                        <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-900">COMMUNITY LIVE FEED</h3>
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-6 custom-scrollbar pr-2">
                        <ActivityItem
                            user="Sandeep"
                            action="pledged Rs. 100"
                            location="Ward 3"
                            time="2m ago"
                            icon={<Users size={15} />}
                        />
                        <ActivityItem
                            user="Kabaadi-wala"
                            action="claimed a bounty"
                            location="Naxal"
                            time="15m ago"
                            icon={<Zap size={15} />}
                        />
                        <ActivityItem
                            user="Priya"
                            action="reported new dump"
                            location="Ward 10"
                            time="1h ago"
                            icon={<Info size={15} />}
                        />
                        <ActivityItem
                            user="Metropolis"
                            action="resolved report"
                            location="Ward 7"
                            time="3h ago"
                            icon={<CheckCircle size={15} />}
                        />
                    </div>
                </div>

                {/* Ward Performance Bar */}
                <div className="glass-panel rounded-[2.5rem] p-8 shadow-xl relative overflow-hidden">
                    <div className="flex justify-between items-start mb-8">
                        <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">WARD PERFORMANCE</h3>
                        <TrendingUp size={16} className="text-primary" />
                    </div>

                    <div className="space-y-6">
                        <div>
                            <div className="flex justify-between mb-2">
                                <span className="text-xs font-bold text-slate-700">Ward 10 (Best)</span>
                                <span className="text-xs font-black text-primary">98% Resolve</span>
                            </div>
                            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: '98%' }}
                                    className="h-full bg-primary"
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between mb-2">
                                <span className="text-xs font-bold text-slate-700">Ward 03 (Worst)</span>
                                <span className="text-xs font-black text-rose-500">12% Resolve</span>
                            </div>
                            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: '12%' }}
                                    className="h-full bg-rose-500"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Response Cycle Widget */}
                <div className="glass-panel rounded-[2.5rem] p-8">
                    <div className="flex items-center gap-2 mb-8">
                        <div className="w-5 h-0.5 bg-primary" />
                        <div className="w-2 h-0.5 bg-primary" />
                        <h3 className="text-[10px] font-black uppercase tracking-widest text-primary ml-1">THE ESCALATION ENGINE</h3>
                    </div>

                    <div className="space-y-8">
                        <CycleStep
                            phase="01"
                            title="GOVERNMENT WINDOW"
                            desc="72-hour priority window for Ward cleanup."
                            color="bg-primary"
                            active={true}
                        />
                        <CycleStep
                            phase="02"
                            title="JANTA OVERRIDE"
                            desc="If ignored 7+ days, bounty unlocks for community."
                            color="bg-amber-500"
                            active={true}
                        />
                        <CycleStep
                            phase="03"
                            title="CIVIC COMMAND"
                            desc="Persistent failure leads to public leaderboard ranking."
                            color="bg-rose-500"
                            active={true}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatCard({ label, value, trend, subValue, trendUp, icon }: any) {
    return (
        <motion.div
            whileTap={{ scale: 0.98 }}
            className="glass-card p-8 hover:bg-primary/5 transition-all group cursor-pointer"
        >
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 group-hover:text-primary transition-colors">{label}</h4>
            <div className="flex items-baseline gap-2 mb-3">
                <span className="text-5xl font-black text-slate-900 tracking-tight">{value}</span>
            </div>
            <div className="flex items-center gap-2">
                {trend && (
                    <div className="flex items-center gap-1">
                        <TrendingUp size={12} className={trendUp ? 'text-primary' : 'text-rose-500'} />
                        <span className={`text-[10px] font-bold ${trendUp ? 'text-primary' : 'text-rose-500'}`}>{trend}</span>
                    </div>
                )}
                {subValue && (
                    <div className="flex items-center gap-1.5">
                        {icon}
                        <span className="text-[10px] font-bold text-slate-400">{subValue}</span>
                    </div>
                )}
            </div>
        </motion.div>
    );
}

function BountyProgressCard({ location, current, target, urgency }: any) {
    const progress = (current / target) * 100;
    return (
        <div className="glass-card p-6 border border-slate-100 hover:border-primary/20 transition-all">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h4 className="font-bold text-slate-900">{location}</h4>
                    <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${urgency === 'High' ? 'bg-rose-500/10 text-rose-500' : 'bg-amber-500/10 text-amber-500'}`}>
                        {urgency} Priority
                    </span>
                </div>
                <div className="text-right">
                    <p className="text-sm font-black text-primary">Rs. {current}</p>
                    <p className="text-[10px] font-bold text-slate-400">of Rs. {target}</p>
                </div>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden mb-2">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    className={`h-full ${progress > 80 ? 'bg-primary' : 'bg-amber-500'}`}
                />
            </div>
            <p className="text-[10px] font-bold text-slate-400 text-right">{Math.round(progress)}% Funded</p>
        </div>
    );
}

function ActivityItem({ user, action, location, time, icon }: any) {
    return (
        <div className="flex gap-4 group">
            <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                {icon}
            </div>
            <div>
                <p className="text-md text-slate-600 leading-snug">
                    <span className="font-black text-slate-900">{user}</span> {action} in <span className="font-bold text-slate-900">{location}</span>
                </p>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{time}</span>
            </div>
        </div>
    );
}

function CycleStep({ phase, title, desc, color, active }: any) {
    return (
        <div className={`flex gap-4 ${!active ? 'opacity-40' : ''}`}>
            <div className="flex flex-col items-center">
                <div className={`w-3 h-3 rounded-full ${color} ${active ? 'ring-4 ring-primary/10' : ''}`} />
                <div className="w-0.5 flex-1 bg-slate-100 my-2" />
            </div>
            <div>
                <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest mb-1">PHASE {phase}: {title}</h4>
                <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
            </div>
        </div>
    );
}

function CheckCircle({ size, className }: any) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
    );
}

export default DashboardPage