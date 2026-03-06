
import { useState } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Leaf, Lock, Mail, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';
import { NavItem } from '../home/HomePage';
import { useLogin } from '@/features/auth/useAuth';


export default function LoginPage() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const { mutate: login, isPending, error } = useLogin();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        login({ email, password });
    };

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
                    <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
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
                            onClick={() => navigate('/register')}
                            className="bg-primary text-white px-5 py-2 rounded-xl text-sm font-bold shadow-lg shadow-primary/20"
                        >
                            Sign Up
                        </motion.button>
                    </nav>
                </div>
            </header>

            <main className="flex-1 flex items-center justify-center p-6 sm:p-12 z-10">
                <div className="w-full max-w-md">
                    <div className="bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden relative">
                        <div className="absolute top-0 left-0 w-full h-2 bg-primary"></div>
                        <div className="p-8 sm:p-12">
                            <div className="flex flex-col items-center mb-10">
                                <div className="bg-primary/10 p-4 rounded-2xl mb-6">
                                    <Lock className="text-primary" size={32} />
                                </div>
                                <h2 className="text-2xl font-bold text-slate-900">Welcome Back</h2>
                                <p className="text-slate-500 mt-1">Login to your account</p>
                            </div>

                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 mb-5"
                                >
                                    <AlertCircle size={16} className="shrink-0" />
                                    <span>{error.message}</span>
                                </motion.div>
                            )}

                            <form className="space-y-5" onSubmit={handleSubmit}>
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-sm font-semibold text-slate-700">Email Address</label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                        <input
                                            className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-slate-400"
                                            placeholder="example@domain.com"
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <div className="flex justify-between items-center">
                                        <label className="text-sm font-semibold text-slate-700">Password</label>
                                        <a href="#" className="text-xs font-bold text-primary hover:underline">Forgot?</a>
                                    </div>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                        <input
                                            className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-slate-400"
                                            placeholder="••••••••"
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="pt-4">
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="w-full bg-primary hover:bg-green-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/25 transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                                        type="submit"
                                        disabled={isPending}
                                    >
                                        {isPending ? (
                                            <>
                                                <Loader2 size={20} className="animate-spin" />
                                                Logging in…
                                            </>
                                        ) : (
                                            <>
                                                Login
                                                <ArrowRight size={20} />
                                            </>
                                        )}
                                    </motion.button>
                                </div>
                            </form>
                            <div className="mt-10 pt-8 border-t border-slate-100 text-center">
                                <p className="text-slate-600">
                                    Don't have an account?
                                    <button onClick={() => navigate('/register')} className="text-primary font-bold hover:underline ml-1">Sign up here</button>
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