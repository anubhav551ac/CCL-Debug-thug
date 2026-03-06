import { useState } from "react";
import { motion } from "motion/react";
import { Leaf, User, Mail, Lock, Phone, MapPin, ArrowRight, Camera, UserPlus, Plus, AlertCircle, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useRegister } from "@/features/auth/useAuth";
import kathmanduPalikas from "@/pages/Dashboard/helpers/data/kathmandu-palikas.json";

// Extract unique municipalities from GeoJSON
const uniqueMunicipalities = Array.from(
    new Set(
        (kathmanduPalikas as any).features.map(
            (f: any) => `${f.properties.name}, ${f.properties.district}`
        )
    )
).sort();

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

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        phoneNumber: "",
        municipality: "",
        profilePic: "",
    });
    const [preview, setPreview] = useState<string | null>(null);

    const { mutate: register, isPending, error } = useRegister();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const [clientError, setClientError] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                setPreview(base64String);
                setForm((prev) => ({ ...prev, profilePic: base64String }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setClientError(null);

        if (form.password !== form.confirmPassword) {
            setClientError("Passwords do not match.");
            return;
        }

        register({
            name: form.name,
            email: form.email,
            password: form.password,
            phoneNumber: form.phoneNumber,
            municipality: form.municipality,
            profilePic: form.profilePic,
        });
    };

    const displayError = clientError ?? error?.message ?? null;

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
                                    <input
                                        type="file"
                                        id="profilePic"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                    />
                                    <label
                                        htmlFor="profilePic"
                                        className="size-32 rounded-full border-4 border-slate-100 bg-slate-50 flex items-center justify-center overflow-hidden shadow-inner cursor-pointer hover:border-primary/30 transition-colors relative"
                                    >
                                        {preview ? (
                                            <img src={preview} alt="Profile Preview" className="w-full h-full object-cover" />
                                        ) : (
                                            <UserPlus className="text-slate-300 text-5xl" size={48} />
                                        )}
                                        <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-center">
                                            <Camera className="text-white" size={24} />
                                        </div>
                                    </label>
                                    <div className="absolute bottom-1 right-1 bg-primary text-white p-2 rounded-full shadow-lg pointer-events-none">
                                        <Plus size={14} />
                                    </div>
                                </div>
                                <h2 className="mt-6 text-2xl font-bold text-slate-900">Create Account</h2>
                                <p className="text-slate-500 mt-1">Join the Escalation Engine today</p>
                            </div>

                            {displayError && (
                                <motion.div
                                    initial={{ opacity: 0, y: -8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 mb-5"
                                >
                                    <AlertCircle size={16} className="shrink-0" />
                                    <span>{displayError}</span>
                                </motion.div>
                            )}

                            <form className="space-y-5" onSubmit={handleSubmit}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div className="flex flex-col gap-1.5 md:col-span-2">
                                        <label className="text-sm font-semibold text-slate-700">Full Name</label>
                                        <div className="relative">
                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                            <input
                                                name="name"
                                                className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-slate-400"
                                                placeholder="John Doe"
                                                type="text"
                                                value={form.name}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-1.5 md:col-span-2">
                                        <label className="text-sm font-semibold text-slate-700">Email Address</label>
                                        <div className="relative">
                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                            <input
                                                name="email"
                                                className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-slate-400"
                                                placeholder="example@domain.com"
                                                type="email"
                                                value={form.email}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-sm font-semibold text-slate-700">Password</label>
                                        <div className="relative">
                                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                            <input
                                                name="password"
                                                className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-slate-400"
                                                placeholder="••••••••"
                                                type="password"
                                                value={form.password}
                                                onChange={handleChange}
                                                required
                                                minLength={6}
                                            />
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-sm font-semibold text-slate-700">Confirm Password</label>
                                        <div className="relative">
                                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                            <input
                                                name="confirmPassword"
                                                className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-slate-400"
                                                placeholder="••••••••"
                                                type="password"
                                                value={form.confirmPassword}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-sm font-semibold text-slate-700">Phone Number</label>
                                        <div className="relative">
                                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                            <input
                                                name="phoneNumber"
                                                className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-slate-400"
                                                placeholder="+977-98XXXXXXXX"
                                                type="tel"
                                                value={form.phoneNumber}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-sm font-semibold text-slate-700">Municipality</label>
                                        <div className="relative">
                                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                            <select
                                                name="municipality"
                                                className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none cursor-pointer"
                                                value={form.municipality}
                                                onChange={handleChange}
                                                required
                                            >
                                                <option disabled value="">Select Municipality</option>
                                                {uniqueMunicipalities.map((m) => (
                                                    <option key={m as string} value={m as string}>{m as string}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div className="pt-6">
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
                                                Creating Account…
                                            </>
                                        ) : (
                                            <>
                                                Register
                                                <ArrowRight size={20} />
                                            </>
                                        )}
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