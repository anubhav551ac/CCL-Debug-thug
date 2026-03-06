import { motion, AnimatePresence } from 'motion/react';
import { Star, FileText, Coins, X, MapPin } from 'lucide-react';
import { generateAvatarContent } from '../utils/avatarHelpers';
import type { User } from '../store/userSlice';

interface ProfileCardModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: User | null;
    isLoading?: boolean;
}

const SkeletonLoader = () => (
    <div className="w-full bg-white rounded-3xl overflow-hidden shadow-2xl">
        {/* Banner Skeleton */}
        <div className="h-40 bg-gradient-to-r from-slate-200 to-slate-300 animate-pulse" />

        {/* Content Skeleton */}
        <div className="relative px-8 pb-8">
            {/* Avatar Skeleton */}
            <div className="flex justify-center -mt-20 mb-6">
                <div className="w-40 h-40 rounded-full bg-slate-200 animate-pulse border-4 border-white shadow-lg" />
            </div>

            {/* Name Skeleton */}
            <div className="text-center mb-2">
                <div className="h-8 w-40 bg-slate-200 rounded-lg animate-pulse mx-auto mb-2" />
                <div className="h-5 w-24 bg-slate-200 rounded animate-pulse mx-auto" />
            </div>

            {/* Badges Skeleton */}
            <div className="flex gap-2 justify-center mb-8">
                <div className="h-6 w-20 bg-slate-200 rounded-full animate-pulse" />
                <div className="h-6 w-24 bg-slate-200 rounded-full animate-pulse" />
            </div>

            {/* Stats Skeleton */}
            <div className="grid grid-cols-3 gap-4 mb-8">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-slate-50 p-4 rounded-2xl text-center">
                        <div className="h-8 w-8 bg-slate-200 rounded-full animate-pulse mx-auto mb-2" />
                        <div className="h-4 w-12 bg-slate-200 rounded animate-pulse mx-auto mb-2" />
                        <div className="h-6 w-10 bg-slate-200 rounded animate-pulse mx-auto" />
                    </div>
                ))}
            </div>

            {/* Button Skeleton */}
            <div className="h-12 w-full bg-slate-200 rounded-2xl animate-pulse" />
        </div>
    </div>
);

const ProfileCardModal: React.FC<ProfileCardModalProps> = ({
    isOpen,
    onClose,
    user,
    isLoading = false,
}) => {
    if (!user && !isLoading) return null;

    const roleDisplay = user?.role
        ? user.role.split('_').join(' ')
        : 'Member';

    const avatarContent = user
        ? generateAvatarContent(user.name, user.profilePic)
        : null;

    // Ensure stats default to 0 if missing
    const totalReports = user?.totalReports ?? 0;
    const reputation = user?.reputation ?? 0;
    const mockBalance = user?.mockBalance ?? 0;
    const municipality = user?.municipality || 'Not set';

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-xl bg-slate-900/30"
                >
                    <motion.div
                        initial={{ scale: 0.85, opacity: 0, y: 30 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.85, opacity: 0, y: 30 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        onClick={(e) => e.stopPropagation()}
                        className="w-full max-w-md"
                    >
                        {isLoading ? (
                            <SkeletonLoader />
                        ) : (
                            <div className="w-full bg-white rounded-3xl overflow-hidden shadow-2xl">
                                {/* Top Banner - Green Gradient */}
                                <div className="relative h-40 bg-gradient-to-br from-emerald-700 via-emerald-600 to-green-600 overflow-hidden">
                                    {/* Abstract pattern overlay */}
                                    <div className="absolute inset-0 opacity-20">
                                        <svg
                                            className="w-full h-full"
                                            viewBox="0 0 400 160"
                                            preserveAspectRatio="none"
                                        >
                                            <defs>
                                                <pattern
                                                    id="pattern"
                                                    x="0"
                                                    y="0"
                                                    width="40"
                                                    height="40"
                                                    patternUnits="userSpaceOnUse"
                                                >
                                                    <circle cx="20" cy="20" r="2" fill="white" opacity="0.3" />
                                                </pattern>
                                            </defs>
                                            <rect width="400" height="160" fill="url(#pattern)" />
                                        </svg>
                                    </div>
                                </div>

                                {/* Profile Content */}
                                <div className="relative px-8 pb-8">
                                    {/* Avatar Container - Overlapping */}
                                    <div className="flex justify-center -mt-20 mb-6 relative">
                                        <div className="relative">
                                            {avatarContent?.type === 'image' ? (
                                                <img
                                                    src={avatarContent.imageUrl}
                                                    alt={user?.name}
                                                    className="w-40 h-40 rounded-full border-4 border-white shadow-lg object-cover"
                                                />
                                            ) : (
                                                <div
                                                    className={`w-40 h-40 rounded-full border-4 border-white shadow-lg flex items-center justify-center ${avatarContent?.bgColor} text-white text-5xl font-black`}
                                                >
                                                    {avatarContent?.initials}
                                                </div>
                                            )}
                                            {/* Online Indicator */}
                                            <div className="absolute bottom-3 right-3 w-5 h-5 bg-emerald-500 rounded-full border-3 border-white shadow-md" />
                                        </div>
                                    </div>

                                    {/* User Name and Role */}
                                    <div className="text-center mb-4">
                                        <h2 className="text-3xl font-black text-slate-900 mb-1">
                                            {user?.name}
                                        </h2>
                                        <p className="text-sm font-bold text-emerald-600 uppercase tracking-widest">
                                            {roleDisplay}
                                        </p>
                                    </div>

                                    {/* Badges */}
                                    <div className="flex flex-wrap gap-2 justify-center mb-8">
                                        <span className="px-4 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold flex items-center gap-1">
                                            <MapPin size={12} />
                                            {municipality}
                                        </span>
                                        <span className="px-4 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">
                                            Eco-Warrior
                                        </span>
                                    </div>

                                    {/* Stats Grid - 3 Columns */}
                                    <div className="grid grid-cols-3 gap-4 mb-8">
                                        {/* Reputation */}
                                        <div className="bg-gradient-to-br from-slate-50 to-slate-100 p-4 rounded-2xl text-center border border-slate-200 hover:shadow-md transition-shadow">
                                            <div className="flex justify-center mb-2">
                                                <Star
                                                    size={24}
                                                    className="text-yellow-500 fill-yellow-500"
                                                />
                                            </div>
                                            <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-1">
                                                Reputation
                                            </p>
                                            <p className="text-2xl font-black text-slate-900">
                                                {reputation}
                                            </p>
                                        </div>

                                        {/* Reports */}
                                        <div className="bg-gradient-to-br from-slate-50 to-slate-100 p-4 rounded-2xl text-center border border-slate-200 hover:shadow-md transition-shadow">
                                            <div className="flex justify-center mb-2">
                                                <FileText
                                                    size={24}
                                                    className="text-blue-500"
                                                />
                                            </div>
                                            <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-1">
                                                Reports
                                            </p>
                                            <p className="text-2xl font-black text-slate-900">
                                                {totalReports}
                                            </p>
                                        </div>

                                        {/* Balance */}
                                        <div className="bg-gradient-to-br from-slate-50 to-slate-100 p-4 rounded-2xl text-center border border-slate-200 hover:shadow-md transition-shadow">
                                            <div className="flex justify-center mb-2">
                                                <Coins
                                                    size={24}
                                                    className="text-amber-500"
                                                />
                                            </div>
                                            <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-1">
                                                Balance
                                            </p>
                                            <p className="text-2xl font-black text-slate-900">
                                                {mockBalance}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Action Button */}
                                    <div className="flex gap-3">
                                        <motion.button
                                            whileTap={{ scale: 0.95 }}
                                            onClick={onClose}
                                            className="flex-1 bg-emerald-700 hover:bg-emerald-800 text-white py-3 rounded-2xl font-black text-sm transition-all shadow-lg shadow-emerald-700/20"
                                        >
                                            Edit Profile
                                        </motion.button>
                                        <motion.button
                                            whileTap={{ scale: 0.95 }}
                                            onClick={onClose}
                                            className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-2xl font-bold transition-all"
                                        >
                                            <X size={20} />
                                        </motion.button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ProfileCardModal;
