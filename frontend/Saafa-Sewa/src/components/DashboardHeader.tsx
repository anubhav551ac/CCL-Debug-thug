
import { motion } from 'motion/react'
import { Home, ChevronRight, Bell } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react';
import { useUser } from '../store'
import { generateAvatarContent } from '../utils/avatarHelpers'
import ProfileCardModal from './ProfileCardModal'

function DashboardHeader({ currentScreen }: { currentScreen: string }) {

    const [showProfile, setShowProfile] = useState(false);
    const { user, isLoading } = useUser();


    const navigate = useNavigate();

    const setProfile = () => {
        console.log("Setting profile...");
        setShowProfile(true);
    }

    return (
        <>
            <header className="flex items-center justify-between px-8 py-4 mb-2">
                <div className="flex items-center gap-3 text-sm text-slate-400">
                    <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => navigate('/')}
                        className="w-8 h-8 glass-card flex items-center justify-center text-slate-400 hover:text-primary transition-all"
                    >
                        <Home size={16} />
                    </motion.button>
                    <ChevronRight size={14} />
                    <span className="font-black text-slate-900 uppercase tracking-widest text-[10px]">
                        {currentScreen.replace('-', ' ')}
                    </span>
                </div>

                <div className="flex items-center gap-6">
                    <motion.button
                        whileTap={{ scale: 0.9 }}
                        className="w-10 h-10 glass-card flex items-center justify-center text-slate-400 hover:text-primary transition-all relative"
                    >
                        <Bell size={20} />
                        <div className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white" />
                    </motion.button>

                    <div className="flex items-center gap-3 pl-6 border-l border-slate-200">
                        {isLoading ? (
                            <div className="w-24 h-4 bg-slate-200 rounded animate-pulse" />
                        ) : (
                            <div className="text-right">
                                <p className="text-sm font-black text-slate-900">
                                    {user?.name || "User"}
                                </p>
                            </div>
                        )}
                        <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={setProfile}
                            className="w-10 h-10 rounded-full bg-slate-100 overflow-hidden border-2 border-primary shadow-md transition-all"
                        >
                            {isLoading ? (
                                <div className="w-full h-full bg-slate-200 animate-pulse" />
                            ) : (
                                (() => {
                                    const avatarContent = generateAvatarContent(user?.name || "User", user?.profilePic);
                                    return avatarContent.type === "image" ? (
                                        <img
                                            src={avatarContent.imageUrl}
                                            alt="Avatar"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className={`w-full h-full ${avatarContent.bgColor} flex items-center justify-center text-white font-bold text-sm`}>
                                            {avatarContent.initials}
                                        </div>
                                    );
                                })()
                            )}
                        </motion.button>
                    </div>
                </div>
            </header>

            {/* Profile Card Modal */}
            <ProfileCardModal
                isOpen={showProfile}
                onClose={() => setShowProfile(false)}
                user={user}
                isLoading={isLoading}
            />
        </>
    )
}

export default DashboardHeader