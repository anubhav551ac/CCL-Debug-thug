import { motion } from "motion/react"
import { Leaf, User, Mail, Lock, Phone, MapPin, ArrowRight, Camera, UserPlus, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

const NavItem = ({ children, href = "#", onClick }: { children: React.ReactNode; href?: string; onClick?: () => void }) => (
    <a
        href={href}
        onClick={(e) => {
            if (onClick) {
                e.preventDefault();
                onClick();
            }
        }}
        className="text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-primary transition-colors cursor-pointer"
    >
        {children}
    </a>
);

const RegisterPage = () => {

    const navigate = useNavigate();

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="min-h-screen bg-background-light flex flex-col relative overflow-hidden"
        >
            <div className="bg-gradient-soft" />
            <header className="w-full bg-white border-b border-slate-200 z-10">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
                        <div className="bg-primary/10 p-2 rounded-lg">
                            <Leaf className="text-primary" size={20} />
                        </div>
                        <h1 className="text-slate-900 font-bold text-xl tracking-tight">Saafa Sewa</h1>
                    </div>
                    <nav className="hidden md:flex items-center gap-8">
                        <NavItem onClick={() => navigate('/')}>Home</NavItem>
                        <NavItem href="#">About</NavItem>
                        <NavItem href="#">Support</NavItem>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => navigate('/login')}
                            className="bg-primary text-white px-5 py-2 rounded-xl text-sm font-bold shadow-lg shadow-primary/20"
                        >
                            Login
                        </motion.button>
                    </nav>
                </div>
            </header>

            <main className="flex-1 flex items-center justify-center p-6 sm:p-12 z-10">
                <div className="w-full max-w-xl">
                    <div className="bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden relative">
                        <div className="absolute top-0 left-0 w-full h-2 bg-primary"></div>
                        <div className="p-8 sm:p-12">
                            <div className="flex flex-col items-center mb-10">
                                <div className="relative group">
                                    <div className="size-32 rounded-full border-4 border-slate-100 bg-slate-50 flex items-center justify-center overflow-hidden shadow-inner cursor-pointer hover:border-primary/30 transition-colors">
                                        <UserPlus className="text-slate-300 text-5xl" size={48} />
                                        <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Camera className="text-white" size={24} />
                                        </div>
                                    </div>
                                    <div className="absolute bottom-1 right-1 bg-primary text-white p-2 rounded-full shadow-lg">
                                        <Plus size={14} />
                                    </div>
                                </div>
                                <h2 className="mt-6 text-2xl font-bold text-slate-900">Create Account</h2>
                                <p className="text-slate-500 mt-1">Join the Escalation Engine today</p>
                            </div>

                            <form className="space-y-5">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div className="flex flex-col gap-1.5 md:col-span-2">
                                        <label className="text-sm font-semibold text-slate-700">Full Name</label>
                                        <div className="relative">
                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                            <input className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-slate-400" placeholder="John Doe" type="text" />
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-1.5 md:col-span-2">
                                        <label className="text-sm font-semibold text-slate-700">Email Address</label>
                                        <div className="relative">
                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                            <input className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-slate-400" placeholder="example@domain.com" type="email" />
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-sm font-semibold text-slate-700">Password</label>
                                        <div className="relative">
                                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                            <input className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-slate-400" placeholder="••••••••" type="password" />
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-sm font-semibold text-slate-700">Confirm Password</label>
                                        <div className="relative">
                                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                            <input className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-slate-400" placeholder="••••••••" type="password" />
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-sm font-semibold text-slate-700">Phone Number</label>
                                        <div className="relative">
                                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                            <input className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-slate-400" placeholder="+977-98XXXXXXXX" type="tel" />
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-sm font-semibold text-slate-700">Ward Number</label>
                                        <div className="relative">
                                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                            <select className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none cursor-pointer">
                                                <option disabled selected value="">Select Ward</option>
                                                <option value="1">Ward 1</option>
                                                <option value="2">Ward 2</option>
                                                <option value="3">Ward 3</option>
                                                <option value="4">Ward 4</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div className="pt-6">
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="w-full bg-primary hover:bg-green-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/25 transition-all flex items-center justify-center gap-2"
                                        type="submit"
                                    >
                                        Register
                                        <ArrowRight size={20} />
                                    </motion.button>
                                </div>
                            </form>
                            <div className="mt-10 pt-8 border-t border-slate-100 text-center">
                                <p className="text-slate-600">
                                    Already have an account?
                                    <button onClick={() => navigate("/login")} className="text-primary font-bold hover:underline ml-1">Login here</button>
                                </p>
                            </div>
                        </div>
                    </div>
                    <footer className="mt-8 text-center">
                        <p className="text-slate-400 text-xs">
                            © 2024 Saafa Sewa. All rights reserved. Clean Environment, Better Living.
                        </p>
                    </footer>
                </div>
            </main>
        </motion.div>
    );
};

export default RegisterPage;