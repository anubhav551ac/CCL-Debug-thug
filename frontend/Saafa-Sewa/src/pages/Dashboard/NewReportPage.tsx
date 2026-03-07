import { Camera, MapPin,  ChevronRight, Zap } from 'lucide-react';

function NewReportPage() {

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
            {/* Left Column - Form */}
            <div className="lg:col-span-8 space-y-6">
                <div className="glass-panel rounded-[2.5rem] p-10 border border-slate-100">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-8 h-1 bg-primary rounded-full" />
                        <div className="w-8 h-1 bg-slate-100 rounded-full" />
                        <div className="w-8 h-1 bg-slate-100 rounded-full" />
                    </div>
                    <h2 className="text-4xl font-black text-slate-900 mb-2">Report Micro-Dump</h2>
                    <p className="text-slate-400 font-medium mb-12">Provide visual evidence and pinpoint the exact location.</p>

                    {/* Section 1: Evidence Capture */}
                    <div className="mb-12">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-widest">1. EVIDENCE CAPTURE</h3>
                            <span className="text-[10px] font-bold text-slate-400 italic">High-res photos preferred</span>
                        </div>

                        <div className="relative group">
                            <div className="border-2 border-dashed border-slate-100 rounded-[2rem] p-16 flex flex-col items-center justify-center transition-all group-hover:border-primary group-hover:bg-slate-50 cursor-pointer">
                                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 mb-6 group-hover:bg-primary group-hover:text-white group-hover:shadow-lg transition-all">
                                    <Camera size={32} />
                                </div>
                                <h4 className="text-lg font-bold text-slate-900 mb-2">Drop incident photo here</h4>
                                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">JPG, PNG OR HEIC FORMAT</p>
                                <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" />
                            </div>
                        </div>
                    </div>

                    {/* Section 2: Geo-Location Pin */}
                    <div className="mb-12">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-widest">2. GEO-LOCATION PIN</h3>
                            <div className="flex items-center gap-2 bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
                                <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse" />
                                <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">SIGNAL LOCKED</span>
                            </div>
                        </div>

                        <div className="relative h-80 bg-slate-100 rounded-[2.5rem] overflow-hidden border-4 border-white shadow-inner">
                            <img
                                src="https://picsum.photos/seed/map-kathmandu/1200/800"
                                alt="Map"
                                className="w-full h-full object-cover opacity-40 grayscale"
                                referrerPolicy="no-referrer"
                            />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="relative">
                                    <div className="w-32 h-32 bg-primary/10 rounded-full animate-ping absolute -inset-8" />
                                    <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center relative z-10">
                                        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg">
                                            <MapPin className="text-primary" size={20} />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Location Overlay */}
                            <div className="absolute bottom-6 left-6 right-6">
                                <div className="bg-white/90 backdrop-blur-md rounded-3xl p-6 shadow-xl border border-white flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                                            <MapPin size={24} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">DETECTED AREA</p>
                                            <h4 className="text-lg font-black text-slate-900">Near Pashupatinath Area, Kathmandu</h4>
                                        </div>
                                    </div>
                                    <button className="bg-slate-900 text-white px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-800 transition-colors">
                                        ADJUST
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between pt-8 border-t border-slate-100">
                        <button className="text-[10px] font-black text-slate-300 uppercase tracking-widest hover:text-slate-600 transition-colors">
                            DISCARD ENTRY
                        </button>
                        <button className="bg-primary text-white px-10 py-5 rounded-2xl font-black text-lg flex items-center gap-3 shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]">
                            DROP TICKING PIN
                            <ChevronRight size={24} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Right Column - Sidebar Widgets */}
            <div className="lg:col-span-4 space-y-6">
                {/* Response Cycle Widget */}
                <div className="glass-panel rounded-[2.5rem] p-8 border border-slate-100">
                    <div className="flex items-center gap-2 mb-8">
                        <div className="w-5 h-0.5 bg-primary" />
                        <div className="w-2 h-0.5 bg-primary" />
                        <h3 className="text-[10px] font-black uppercase tracking-widest text-primary ml-1">THE ESCALATION ENGINE</h3>
                    </div>

                    <div className="space-y-8">
                        <CycleStep
                            phase="01"
                            title="GOVERNMENT WINDOW"
                            desc="72-hour priority window for area cleanup."
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
                            title="WALL OF SHAME"
                            desc="Persistent failure leads to public leaderboard ranking."
                            color="bg-rose-500"
                            active={true}
                        />
                    </div>

                    <div className="mt-10 bg-primary/5 rounded-2xl p-6 border border-primary/10">
                        <div className="flex items-center gap-2 mb-2 text-primary">
                            <Zap size={14} className="fill-primary" />
                            <span className="text-[10px] font-black uppercase tracking-widest">PRO TIP</span>
                        </div>
                        <p className="text-xs text-slate-500 italic leading-relaxed">
                            "Hey @KathmanduMetropolis, this trash pile in Maharajgunj has been ignored for 12 days. Do better. #CleanUp"
                        </p>
                    </div>
                </div>
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
                <p className="text-xs text-slate-400 leading-relaxed">{desc}</p>
            </div>
        </div>
    );
}

export default NewReportPage;
