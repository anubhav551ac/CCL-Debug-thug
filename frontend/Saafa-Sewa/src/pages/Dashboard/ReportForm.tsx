import React, { useState, useRef, useCallback } from 'react';
import { motion } from 'motion/react';
import {
    Camera,
    MapPin,
    Zap,
    ChevronRight,
    Trash2,
    Package,
    Truck,
    ShoppingBag,
    Hand,
    Leaf,
    Recycle,
    Cpu,
    Stethoscope,
    AlertOctagon,
    FileText,
    Upload,
    Info,
    Building2,
    Shield,
    Users,
    CheckCircle
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, useMapEvents, GeoJSON } from 'react-leaflet';
import L from 'leaflet';
import * as turf from '@turf/turf';
import 'leaflet/dist/leaflet.css';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import kathmanduPalikas from './helpers/data/kathmandu-palikas.json';
import { useCreatePin } from '../../features/pins/usePins';

// ─── Figtree Font ──────────────────────────────────────────────────────────────
const figtreeFontStyle = `
  @import url('https://fonts.googleapis.com/css2?family=Figtree:ital,wght@0,300..900;1,300..900&display=swap');
  .figtree-root * { font-family: 'Figtree', sans-serif !important; }
`;

// ─── Custom Marker Icon ─────────────────────────────────────────────────────────
const customIcon = L.divIcon({
    html: `
    <div class="relative flex items-center justify-center">
      <div class="absolute w-8 h-8 bg-rose-500/30 rounded-full animate-pulse"></div>
      <div class="w-4 h-4 bg-rose-500 rounded-full border-2 border-white shadow-lg"></div>
    </div>
  `,
    className: 'custom-marker-icon',
    iconSize: [32, 32],
    iconAnchor: [16, 16]
});

// ─── Types ──────────────────────────────────────────────────────────────────────
type WasteType = 'Organic' | 'Plastic' | 'Metal' | 'Paper' | 'Electronic' | 'Medical' | 'Hazardous';
type WasteSize = 'Handful' | 'Bagful' | 'Rickshawful' | 'Truckful';

const WASTE_TYPES: { type: WasteType; icon: React.ReactNode; color: string }[] = [
    { type: 'Organic', icon: <Leaf size={14} />, color: 'bg-emerald-500' },
    { type: 'Plastic', icon: <Recycle size={14} />, color: 'bg-blue-500' },
    { type: 'Metal', icon: <Trash2 size={14} />, color: 'bg-slate-500' },
    { type: 'Paper', icon: <FileText size={14} />, color: 'bg-amber-500' },
    { type: 'Electronic', icon: <Cpu size={14} />, color: 'bg-indigo-500' },
    { type: 'Medical', icon: <Stethoscope size={14} />, color: 'bg-rose-500' },
    { type: 'Hazardous', icon: <AlertOctagon size={14} />, color: 'bg-red-600' },
];

const WASTE_SIZES: { size: WasteSize; icon: React.ReactNode; desc: string }[] = [
    { size: 'Handful', icon: <Hand size={18} />, desc: 'Small litter' },
    { size: 'Bagful', icon: <ShoppingBag size={18} />, desc: 'Standard sack' },
    { size: 'Rickshawful', icon: <Package size={18} />, desc: 'Large pile' },
    { size: 'Truckful', icon: <Truck size={18} />, desc: 'Massive dump' },
];

// ─── GeoJSON Style Helper ───────────────────────────────────────────────────────
function getFeatureStyle(featureCode: number, selectedCode: number | null): L.PathOptions {
    const isSelected = selectedCode !== null && featureCode === selectedCode;
    return {
        fillColor: isSelected ? '#059669' : '#64748b',
        fillOpacity: isSelected ? 0.45 : 0.08,
        color: isSelected ? '#059669' : '#94a3b8',
        weight: isSelected ? 2.5 : 0.8,
    };
}

// ─── Location Picker Component ──────────────────────────────────────────────────
function LocationPicker({ onLocationSelect }: { onLocationSelect: (lat: number, lng: number) => void }) {
    const [position, setPosition] = useState<[number, number] | null>(null);

    useMapEvents({
        click(e) {
            setPosition([e.latlng.lat, e.latlng.lng]);
            onLocationSelect(e.latlng.lat, e.latlng.lng);
        },
    });

    return position === null ? null : (
        <Marker position={position} icon={customIcon} />
    );
}

// ─── Main Component ─────────────────────────────────────────────────────────────
function ReportForm() {
    const [selectedTypes, setSelectedTypes] = useState<WasteType[]>([]);
    const [selectedSize, setSelectedSize] = useState<WasteSize>('Bagful');
    const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [municipality, setMunicipality] = useState<string>('');
    const [municipalityStatus, setMunicipalityStatus] = useState<'pending' | 'found' | 'unknown'>('pending');
    const [selectedVdcCode, setSelectedVdcCode] = useState<number | null>(null);
    const [description, setDescription] = useState('');
    const [image, setImage] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const navigate = useNavigate();
    const { mutate: createPin, isPending: isCreatingPin } = useCreatePin();

    const handleSubmit = async () => {
        if (!location || !image || selectedTypes.length === 0 || !municipality) return;

        createPin({
            latitude: location.lat,
            longitude: location.lng,
            municipality,
            wasteType: selectedTypes.map(t => t.toUpperCase()),
            wasteSize: selectedSize.toUpperCase(),
            description,
            imageUrl: image,
        }, {
            onSuccess: () => {
                toast.success("Report Submitted", { description: "Your civic report has been securely transmitted." });
                navigate('/app/dashboard');
            }
        });
    };

    const handleLocationSelect = useCallback((lat: number, lng: number) => {
        setLocation({ lat, lng });
        const pt = turf.point([lng, lat]);

        let found = false;
        for (const feature of (kathmanduPalikas as any).features) {
            try {
                if (turf.booleanPointInPolygon(pt, feature)) {
                    const { name, district, code } = feature.properties;
                    const municipalityStr = `${name}, ${district}`;
                    setMunicipality(municipalityStr);
                    setSelectedVdcCode(code);
                    setMunicipalityStatus('found');
                    found = true;
                    break;
                }
            } catch {
                // skip malformed features
            }
        }

        if (!found) {
            setMunicipality('');
            setSelectedVdcCode(null);
            setMunicipalityStatus('unknown');
        }
    }, []);

    const toggleWasteType = (type: WasteType) => {
        setSelectedTypes(prev =>
            prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
        );
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    // GeoJSON style function — depends on selectedVdcCode
    const geoJsonStyle = useCallback((feature?: any): L.PathOptions => {
        return getFeatureStyle(feature?.properties?.code, selectedVdcCode);
    }, [selectedVdcCode]);

    // Municipality badge content
    const renderMunicipalityBadge = () => {
        if (municipalityStatus === 'pending') {
            return (
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest animate-pulse">
                    DROP PIN ON MAP
                </p>
            );
        }
        if (municipalityStatus === 'unknown') {
            return (
                <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest">
                    UNKNOWN AREA
                </p>
            );
        }
        return (
            <p className="text-xs font-black text-emerald-600 uppercase tracking-tight leading-tight max-w-[160px] text-right">
                {municipality}
            </p>
        );
    };

    return (
        <>
            <style>{figtreeFontStyle}</style>
            <div className="figtree-root grid grid-cols-1 lg:grid-cols-12 gap-6 h-full pb-8">
                {/* Left Column - Form (70%) */}
                <div className="lg:col-span-8 space-y-6">
                    <div className="glass-panel rounded-[2.5rem] p-10 border border-slate-200 shadow-2xl">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">REPORT MICRO-DUMP</h2>
                                <p className="text-slate-600 font-medium">Initialize civic response protocol.</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                                <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Live Uplink</span>
                            </div>
                        </div>

                        <div className="space-y-10">
                            {/* Evidence Capture */}
                            <section>
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                        <Camera size={14} /> 01. EVIDENCE CAPTURE
                                    </h3>
                                    {image && (
                                        <button
                                            onClick={() => setImage(null)}
                                            className="text-[10px] font-bold text-rose-500 hover:underline flex items-center gap-1"
                                        >
                                            <Trash2 size={12} /> REMOVE
                                        </button>
                                    )}
                                </div>

                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    className={`relative h-32 border-2 border-dashed rounded-2xl flex items-center justify-center cursor-pointer transition-all overflow-hidden
                    ${image ? 'border-emerald-500 bg-emerald-50/10' : 'border-slate-300 hover:border-emerald-500 hover:bg-slate-50'}`}
                                >
                                    {image ? (
                                        <div className="flex items-center gap-4 px-6 w-full">
                                            <div className="relative">
                                                <img src={image} alt="Preview" className="w-20 h-20 object-cover rounded-xl shadow-lg border-2 border-white" />
                                                {/* AI Validation Overlay */}
                                                <motion.div
                                                    initial={{ x: '-100%', opacity: 0 }}
                                                    animate={{ x: '100%', opacity: 1 }}
                                                    transition={{ duration: 1.5, ease: 'easeInOut' }}
                                                    className="absolute inset-0 rounded-xl bg-emerald-500/30 backdrop-blur-sm"
                                                >
                                                    <div className="absolute inset-0 flex items-center justify-center">
                                                        <div className="text-white font-black text-xs animate-pulse">✓ VERIFIED</div>
                                                    </div>
                                                </motion.div>
                                            </div>
                                            <div>
                                                <p className="text-sm font-black text-slate-900">IMAGE CAPTURED</p>
                                                <p className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                                                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                                                    AI VERIFIED
                                                </p>
                                            </div>
                                            <div className="ml-auto w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
                                                <Zap size={16} />
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center gap-2">
                                            <Upload className="text-slate-400" size={24} />
                                            <p className="text-xs font-black text-slate-500 uppercase tracking-widest">Drop incident photo or click to upload</p>
                                        </div>
                                    )}
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleImageChange}
                                        className="hidden"
                                        accept="image/*"
                                    />
                                </div>
                            </section>

                            {/* Categorical Triage */}
                            <section className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div>
                                    <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                                        <Trash2 size={14} /> 02. WASTE TYPE
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {WASTE_TYPES.map((item) => {
                                            const isHighPriority = item.type === 'Medical' || item.type === 'Hazardous';
                                            const isSelected = selectedTypes.includes(item.type);
                                            return (
                                                <button
                                                    key={item.type}
                                                    onClick={() => toggleWasteType(item.type)}
                                                    className={`flex items-center gap-2 px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border
                                                    ${isSelected
                                                            ? (
                                                                isHighPriority
                                                                    ? `${item.color} text-white border-transparent shadow-lg shadow-red-500/40 ring-2 ring-red-400`
                                                                    : `${item.color} text-white border-transparent shadow-lg shadow-emerald-500/10`
                                                            )
                                                            : (
                                                                isHighPriority
                                                                    ? 'bg-white text-slate-500 border-2 border-rose-300 hover:border-rose-500 hover:bg-rose-50'
                                                                    : 'bg-white text-slate-500 border-slate-200 hover:border-slate-400'
                                                            )}`}
                                                >
                                                    {item.icon}
                                                    {item.type}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                                        <Package size={14} /> 03. WASTE SIZE
                                    </h3>
                                    <div className="flex gap-2">
                                        {WASTE_SIZES.map((item) => (
                                            <button
                                                key={item.size}
                                                onClick={() => setSelectedSize(item.size)}
                                                className={`flex-1 flex flex-col items-center gap-2 p-3 rounded-xl transition-all border
                                                ${selectedSize === item.size
                                                        ? 'bg-emerald-600 text-white border-transparent shadow-lg shadow-emerald-500/10'
                                                        : 'bg-white text-slate-500 border-slate-200 hover:border-slate-400'}`}
                                            >
                                                {item.icon}
                                                <span className="text-[8px] font-black uppercase tracking-tighter">{item.size}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </section>

                            {/* Tactical Location Picker */}
                            <section>
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                        <MapPin size={14} /> 04. TACTICAL LOCATION
                                    </h3>

                                    {/* ── Municipality Badge ── */}
                                    <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-2xl px-4 py-2 shadow-sm">
                                        <Building2
                                            size={14}
                                            className={
                                                municipalityStatus === 'found'
                                                    ? 'text-emerald-600'
                                                    : municipalityStatus === 'unknown'
                                                        ? 'text-rose-500'
                                                        : 'text-slate-400'
                                            }
                                        />
                                        <div className="text-right">
                                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-0.5">
                                                Detected Municipality
                                            </p>
                                            {renderMunicipalityBadge()}
                                        </div>
                                    </div>
                                </div>

                                <div className="relative h-[500px] rounded-[2.5rem] overflow-hidden border-4 border-white shadow-2xl bg-slate-100">
                                    <MapContainer
                                        center={[27.7172, 85.3240]}
                                        zoom={13}
                                        className="w-full h-full"
                                        zoomControl={false}
                                    >
                                        <TileLayer
                                            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                                            attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
                                        />

                                        {/* ── Municipality Boundaries Layer ── */}
                                        <GeoJSON
                                            key={selectedVdcCode ?? 'none'}
                                            data={kathmanduPalikas as any}
                                            style={geoJsonStyle}
                                        />

                                        <LocationPicker onLocationSelect={handleLocationSelect} />
                                    </MapContainer>

                                    {/* Tactical Crosshair Overlay */}
                                    <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-40">
                                        <svg className="w-12 h-12 text-emerald-500 opacity-60" viewBox="0 0 100 100">
                                            {/* Horizontal line */}
                                            <line x1="20" y1="50" x2="80" y2="50" stroke="currentColor" strokeWidth="2" strokeDasharray="5,5" />
                                            {/* Vertical line */}
                                            <line x1="50" y1="20" x2="50" y2="80" stroke="currentColor" strokeWidth="2" strokeDasharray="5,5" />
                                            {/* Center circle */}
                                            <circle cx="50" cy="50" r="8" fill="none" stroke="currentColor" strokeWidth="2" />
                                            {/* Corner brackets */}
                                            <g stroke="currentColor" strokeWidth="2.5" fill="none">
                                                <path d="M 25 25 L 35 25 L 35 35" />
                                                <path d="M 75 25 L 65 25 L 65 35" />
                                                <path d="M 25 75 L 35 75 L 35 65" />
                                                <path d="M 75 75 L 65 75 L 65 65" />
                                            </g>
                                        </svg>
                                    </div>

                                    {/* Coordinates Overlay - Compact */}
                                    <div className="absolute bottom-4 left-4 right-4 z-[1000]">
                                        <div className="glass-panel p-3 rounded-2xl flex items-center justify-between border-white/20 bg-white/90">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white shadow-lg">
                                                    <MapPin size={16} />
                                                </div>
                                                <div>
                                                    <p className="text-[7px] font-black text-slate-500 uppercase tracking-widest leading-none">GPS</p>
                                                    <p className="text-[9px] font-mono font-bold text-slate-900 leading-none">
                                                        {location
                                                            ? `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`
                                                            : 'WAITING...'}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="w-px h-6 bg-slate-200" />
                                            <div className="text-right">
                                                <p className="text-[7px] font-black text-slate-500 uppercase tracking-widest leading-none">STATUS</p>
                                                <div className="flex items-center gap-1">
                                                    <div className={`w-1.5 h-1.5 rounded-full ${location ? 'bg-emerald-500' : 'bg-rose-500 animate-pulse'}`} />
                                                    <span className="text-[9px] font-black text-slate-900 uppercase tracking-widest leading-none">
                                                        {location ? 'LOCKED' : 'SEARCH'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Contextual Description */}
                            <section>
                                <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <FileText size={14} /> 05. CONTEXTUAL INTEL
                                </h3>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Describe the situation... (e.g., 'Large pile of medical waste near the school gate, needs immediate attention.')"
                                    className="w-full h-32 bg-slate-50 border border-slate-200 rounded-2xl p-6 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500/50 transition-all font-medium resize-none"
                                />
                            </section>

                            <div className="flex items-center justify-between pt-6 border-t border-slate-200">
                                <button className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-rose-500 transition-colors">
                                    ABORT MISSION
                                </button>
                                <motion.button
                                    whileTap={{ scale: 0.98 }}
                                    onClick={handleSubmit}
                                    disabled={!location || !image || selectedTypes.length === 0 || !municipality || isCreatingPin}
                                    className={`flex items-center gap-3 px-12 py-5 rounded-2xl font-black text-lg uppercase tracking-widest transition-all shadow-xl
                                    ${(!location || !image || selectedTypes.length === 0 || !municipality || isCreatingPin)
                                            ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                                            : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-600/20'}`}
                                >
                                    {isCreatingPin ? 'TRANSMITTING...' : 'INITIATE 72-HR GOVERNMENT WINDOW'}
                                    {!isCreatingPin && <ChevronRight size={24} />}
                                </motion.button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column - Sidebar (30%) */}
                <div className="lg:col-span-4 space-y-6">
                    {/* Escalation Engine Card */}
                    <div className="glass-panel rounded-[2.5rem] p-8 border border-slate-200 bg-white relative overflow-hidden shadow-xl">
                        <div className="absolute top-0 right-0 p-4 opacity-5 text-emerald-500">
                            <Zap size={120} />
                        </div>

                        <div className="relative z-10">
                            <div className="flex items-center gap-2 mb-8">
                                <div className="w-6 h-0.5 bg-emerald-500" />
                                <h3 className="text-[10px] font-black uppercase tracking-widest text-emerald-500">THE ESCALATION ENGINE</h3>
                            </div>

                            <div className="space-y-4">
                                <EscalationStep
                                    phase="01"
                                    title="GOVERNMENT WINDOW"
                                    desc="72-hour priority window for area cleanup. Official crews notified immediately."
                                    icon={<Building2 size={16} />}
                                    color="bg-emerald-500"
                                    active={true}
                                />
                                <EscalationStep
                                    phase="02"
                                    title="JANTA OVERRIDE"
                                    desc="If ignored 7+ days, bounty unlocks for community gig-workers."
                                    icon={<Users size={16} />}
                                    color="bg-amber-500"
                                    active={false}
                                />
                                <EscalationStep
                                    phase="03"
                                    title="CIVIC COMMAND"
                                    desc="Persistent failure leads to public leaderboard ranking and budget audits."
                                    icon={<Shield size={16} />}
                                    color="bg-rose-500"
                                    active={false}
                                    isLast
                                />
                            </div>

                            <div className="mt-10 p-5 bg-emerald-50 rounded-2xl border border-emerald-100 group hover:border-emerald-500/30 transition-all">
                                <div className="flex items-center gap-2 mb-3 text-emerald-600">
                                    <Zap size={14} className="animate-pulse" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">COMMAND INTEL</span>
                                </div>
                                <p className="text-xs text-slate-700 leading-relaxed italic group-hover:text-slate-900 transition-colors">
                                    "Accurate reporting increases your Civic Score and helps prioritize civic cleanup resources. False reports may lead to account lockout."
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Pro Tips / Status */}
                    <div className="glass-panel rounded-[2.5rem] p-8 border border-slate-100 bg-white/50">
                        <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-6 flex items-center gap-2">
                             <Info size={14} className="text-emerald-500" /> REPORTING GUIDELINES
                        </h3>
                        <ul className="space-y-4">
                            <li className="flex gap-4">
                                <div className="w-6 h-6 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-600 flex-shrink-0">
                                    <CheckCircle size={14} />
                                </div>
                                <p className="text-xs text-slate-600 font-medium leading-normal">Ensure the photo clearly shows the scale of the dump.</p>
                            </li>
                            <li className="flex gap-4">
                                <div className="w-6 h-6 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-600 flex-shrink-0">
                                    <CheckCircle size={14} />
                                </div>
                                <p className="text-xs text-slate-600 font-medium leading-normal">Drop the pin exactly where the waste is located.</p>
                            </li>
                            <li className="flex gap-4">
                                <div className="w-6 h-6 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-600 flex-shrink-0">
                                    <CheckCircle size={14} />
                                </div>
                                <p className="text-xs text-slate-600 font-medium leading-normal">Categorize waste types accurately for specialized disposal.</p>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </>
    );
}

function EscalationStep({ phase, title, desc, icon, color, active, isLast }: any) {
    return (
        <div className={`relative flex gap-5 transition-all duration-500 ${active ? 'scale-[1.02]' : 'opacity-60'}`}>
            <div className="flex flex-col items-center">
                <div className={`z-10 w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-lg
                    ${active ? `${color} text-white ring-4 ring-emerald-500/10` : 'bg-slate-100 text-slate-400 border border-slate-200'}`}>
                    {icon}
                </div>
                {!isLast && (
                    <div className={`w-0.5 mt-1 flex-1 transition-all duration-500
                        ${active ? 'bg-gradient-to-b from-emerald-500 to-slate-200' : 'bg-slate-200'}`} 
                        style={{ minHeight: '40px' }}
                    />
                )}
            </div>
            <div className="py-1">
                <div className="flex items-center gap-2 mb-1.5">
                    <span className={`text-[9px] font-black px-1.5 py-0.5 rounded border 
                        ${active ? 'border-emerald-500/50 text-emerald-600 bg-emerald-50' : 'border-slate-200 text-slate-400 bg-slate-50'}`}>
                        PHASE {phase}
                    </span>
                    <h4 className={`text-xs font-black uppercase tracking-widest ${active ? 'text-slate-900' : 'text-slate-600'}`}>
                        {title}
                    </h4>
                </div>
                <p className={`text-xs leading-relaxed font-black transition-colors duration-500
                    ${active ? 'text-slate-900' : 'text-slate-600'}`}>
                    {desc}
                </p>
            </div>
        </div>
    );
}

export default ReportForm;