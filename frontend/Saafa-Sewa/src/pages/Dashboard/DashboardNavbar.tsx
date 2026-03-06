
import { useNavigate, useLocation } from "react-router-dom"
import { motion, AnimatePresence } from 'motion/react';
import {
    LayoutDashboard,
    PlusCircle,
    Map as MapIcon,
    BarChart3,
    Settings,
    HelpCircle,
} from 'lucide-react';

function DashboardNavbar() {

    const navigate = useNavigate();
    const location = useLocation();

    return (
        <aside className="w-72 glass-panel m-4 rounded-[2.5rem] flex flex-col p-8 text-slate-900 shadow-2xl">
            <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/')}
                className="flex items-center gap-3 mb-12 hover:opacity-80 transition-opacity text-left w-full"
            >
                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                    <PlusCircle className="text-white" size={24} />
                </div>
                <h1 className="text-2xl font-black tracking-tight">Saafa <span className="text-primary">Sewa</span></h1>
            </motion.button>

            <nav className="flex-1 space-y-2">
                <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate('/app/dashboard')}
                    className={`w-full sidebar-item group ${location.pathname === '/app/dashboard' ? 'sidebar-item-active' : ''}`}
                >
                    <LayoutDashboard size={20} className="group-hover:scale-110 transition-transform" />
                    <span className="font-bold">Dashboard</span>
                </motion.button>
                <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate('/app/new-report')}
                    className={`w-full sidebar-item group ${location.pathname === '/app/new-report' ? 'sidebar-item-active' : ''}`}
                >
                    <PlusCircle size={20} className="group-hover:scale-110 transition-transform" />
                    <span className="font-bold">New Report</span>
                </motion.button>
                <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate('/app/live-map')}
                    className={`w-full sidebar-item group ${location.pathname === '/app/live-map' ? 'sidebar-item-active' : ''}`}
                >
                    <MapIcon size={20} className="group-hover:scale-110 transition-transform" />
                    <span className="font-bold">Live Map</span>
                </motion.button>
                <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate('/app/impact-stats')}
                    className={`w-full sidebar-item group ${location.pathname === '/app/impact-stats' ? 'sidebar-item-active' : ''}`}
                >
                    <BarChart3 size={20} className="group-hover:scale-110 transition-transform" />
                    <span className="font-bold">Impact Stats</span>
                </motion.button>

                <div className="pt-8 mt-8 border-t border-slate-200 space-y-2">
                    <motion.button whileTap={{ scale: 0.98 }} className="w-full sidebar-item group">
                        <Settings size={20} className="group-hover:rotate-45 transition-transform" />
                        <span className="font-bold">Settings</span>
                    </motion.button>
                    <motion.button whileTap={{ scale: 0.98 }} className="w-full sidebar-item group">
                        <HelpCircle size={20} className="group-hover:scale-110 transition-transform" />
                        <span className="font-bold">Support</span>
                    </motion.button>
                </div>
            </nav>

            <div className="mt-auto glass-card p-6 relative overflow-hidden">
                <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                        <span className="text-[10px] uppercase tracking-widest font-black text-primary">Command Active</span>
                    </div>
                    <p className="text-xs text-slate-500 mb-4 leading-relaxed font-medium">
                        Help us keep the city clean. Every report counts towards Ward points.
                    </p>
                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        className="w-full bg-primary text-white py-3 rounded-xl text-sm font-black transition-all shadow-lg shadow-primary/20"
                    >
                        Submit Feedback
                    </motion.button>
                </div>
            </div>
        </aside>
    )
}

export default DashboardNavbar