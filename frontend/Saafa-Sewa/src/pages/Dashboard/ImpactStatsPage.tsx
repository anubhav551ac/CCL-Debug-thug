
import { TrendingUp, Star, Clock, Trophy, ChevronRight, User } from 'lucide-react';

function ImpactStats() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
            {/* Left Column - Stats & Leaderboard */}
            <div className="lg:col-span-8 space-y-6">
                <div className="glass-panel rounded-[2.5rem] p-10 border border-slate-100">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-8 h-1 bg-primary rounded-full" />
                        <div className="w-8 h-1 bg-slate-100 rounded-full" />
                        <div className="w-8 h-1 bg-slate-100 rounded-full" />
                    </div>
                    <h2 className="text-4xl font-black text-slate-900 mb-2">Municipality Impact Overview</h2>
                    <p className="text-slate-400 font-medium mb-10">Real-time civic accountability and waste management metrics across Kathmandu.</p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <StatCard
                            label="TOTAL DUMPS RESOLVED"
                            value="12,482"
                            trend="+18% this month"
                            trendUp={true}
                        />
                        <StatCard
                            label="TOTAL BOUNTIES PAID"
                            value="रू 84.2K"
                            subValue="Civic Fund Contribution"
                            icon={<Star size={14} className="text-primary fill-primary" />}
                        />
                        <StatCard
                            label="AVG. RESPONSE TIME"
                            value="14.2h"
                            subValue="Optimized cycle"
                            icon={<Clock size={14} className="text-blue-500" />}
                        />
                    </div>

                    <div className="mt-16">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">MUNICIPALITY PERFORMANCE</p>
                                <h3 className="text-2xl font-black text-slate-900">Kathmandu Area Leaderboard</h3>
                            </div>
                            <button className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline">View All Wards</button>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="text-left border-b border-slate-50">
                                        <th className="pb-6 text-[10px] font-black text-slate-300 uppercase tracking-widest">Municipality/Area</th>
                                        <th className="pb-6 text-[10px] font-black text-slate-300 uppercase tracking-widest">Active Red Pins</th>
                                        <th className="pb-6 text-[10px] font-black text-slate-300 uppercase tracking-widest">Response Rate %</th>
                                        <th className="pb-6 text-[10px] font-black text-slate-300 uppercase tracking-widest">Impact Points</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    <WardRow ward="Maharajgunj" name="Maharajgunj, Kathmandu" pins="12 Reports" rate={94} points="42,800" color="text-primary" />
                                    <WardRow ward="Baneshwor" name="Baneshwor, Kathmandu" pins="08 Reports" rate={88} points="38,120" color="text-primary" />
                                    <WardRow ward="Naxal" name="Naxal, Kathmandu" pins="24 Reports" rate={62} points="21,450" color="text-amber-500" />
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Column - Heroes & Pledgers */}
            <div className="lg:col-span-4 space-y-6">
                {/* Community Heroes Widget */}
                <div className="glass-panel rounded-[2.5rem] p-8 border border-slate-100 shadow-xl">
                    <div className="flex justify-between items-start mb-8">
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">IMPACT LEADERS</p>
                            <h3 className="text-2xl font-black text-slate-900">Community Heroes</h3>
                        </div>
                        <Trophy size={24} className="text-primary" />
                    </div>

                    <div className="space-y-6">
                        <HeroItem
                            rank={1}
                            name="Sunita Shrestha"
                            stat="42 Bounties Cleared"
                            amount="रू 8,400"
                            avatar="https://api.dicebear.com/7.x/avataaars/svg?seed=Sunita"
                        />
                        <HeroItem
                            rank={2}
                            name="Rohan K.C."
                            stat="38 Bounties Cleared"
                            amount="रू 7,600"
                            avatar="https://api.dicebear.com/7.x/avataaars/svg?seed=Rohan"
                        />
                        <HeroItem
                            rank={3}
                            name="Maya Gurung"
                            stat="29 Bounties Cleared"
                            amount="रू 5,800"
                            avatar="https://api.dicebear.com/7.x/avataaars/svg?seed=Maya"
                        />
                    </div>

                    <button className="w-full mt-10 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-900 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">
                        View All Gig-Workers
                    </button>
                </div>

                {/* Top Pledgers Widget */}
                <div className="glass-panel rounded-[2.5rem] p-8 border border-slate-100">
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-8">TOP PLEDGERS (MAHARAJGUNJ)</h3>

                    <div className="space-y-6">
                        <PledgerItem name="Nabil Bank" amount="रू 25,000" icon={<BankIcon />} />
                        <PledgerItem name="CG Group" amount="रू 18,500" icon={<BusinessIcon />} />
                        <PledgerItem name="Kushal S." amount="रू 12,000" icon={<User size={18} className="text-slate-400" />} />
                    </div>

                    <p className="mt-10 text-[10px] text-slate-400 font-medium leading-relaxed">
                        Pledgers contribute to the bounty pool that incentivizes quick waste clearance by our hero network.
                    </p>
                </div>
            </div>
        </div>
    );
}

function StatCard({ label, value, trend, subValue, trendUp, icon }: any) {
    return (
        <div className="bg-slate-50 rounded-[2rem] p-8 border border-slate-100">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">{label}</h4>
            <div className="flex items-baseline gap-2 mb-3">
                <span className="text-4xl font-black text-slate-900 tracking-tight">{value}</span>
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
                        <span className="text-[10px] font-bold text-slate-500">{subValue}</span>
                    </div>
                )}
            </div>
        </div>
    );
}

function WardRow({ ward, name, pins, rate, points, color }: any) {
    return (
        <tr className="group hover:bg-slate-50 transition-colors">
            <td className="py-6">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary font-black text-sm">
                        {ward}
                    </div>
                    <span className="text-sm font-bold text-slate-900">{name}</span>
                </div>
            </td>
            <td className="py-6">
                <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full bg-rose-500`} />
                    <span className="text-sm font-bold text-slate-900">{pins}</span>
                </div>
            </td>
            <td className="py-6">
                <div className="flex items-center gap-4">
                    <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden max-w-[100px]">
                        <div className={`h-full ${rate > 80 ? 'bg-primary' : 'bg-amber-500'}`} style={{ width: `${rate}%` }} />
                    </div>
                    <span className="text-xs font-black text-slate-900">{rate}%</span>
                </div>
            </td>
            <td className="py-6 text-right">
                <span className="text-sm font-black text-slate-900">{points}</span>
            </td>
        </tr>
    );
}

function HeroItem({ rank, name, stat, amount, avatar }: any) {
    return (
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
                <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-slate-100 overflow-hidden border-2 border-slate-200">
                        <img src={avatar} alt={name} className="w-full h-full object-cover" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-amber-400 rounded-full flex items-center justify-center text-[10px] font-black text-white border-2 border-white">
                        {rank}
                    </div>
                </div>
                <div>
                    <h4 className="text-sm font-bold text-slate-900">{name}</h4>
                    <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">{stat}</p>
                </div>
            </div>
            <span className="text-sm font-black text-slate-900">{amount}</span>
        </div>
    );
}

function PledgerItem({ name, amount, icon }: any) {
    return (
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
                    {icon}
                </div>
                <span className="text-sm font-bold text-slate-900">{name}</span>
            </div>
            <span className="text-sm font-black text-slate-900">{amount}</span>
        </div>
    );
}

function BankIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500">
            <rect x="2" y="10" width="20" height="12" rx="2" />
            <path d="M12 22V10" />
            <path d="M18 22V10" />
            <path d="M6 22V10" />
            <path d="m2 10 10-8 10 8" />
        </svg>
    );
}

function BusinessIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-500">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <path d="M3 9h18" />
            <path d="M9 21V9" />
        </svg>
    );
}

export default ImpactStats;
