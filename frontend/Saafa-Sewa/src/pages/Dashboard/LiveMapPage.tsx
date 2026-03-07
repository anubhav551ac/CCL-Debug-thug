
import { useState, useEffect, useMemo } from 'react';
import { motion } from 'motion/react';
import {
    Info,
    Search,
    Layers,
    Crosshair,
    AlertTriangle,
    CheckCircle2
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Circle, GeoJSON } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useFetchPins, useAgePinDev } from '../../features/pins/usePins';
import { setPins } from '../../features/pins/pinsSlice';
import { useAppDispatch, useAppSelector } from '../../store';
import kathmanduPalikas from './helpers/data/kathmandu-palikas.json';
import ReportDetailsPanel from '../Reports/ReportDetailsPage';
import { useNavigate } from 'react-router-dom';
// import { toast } from 'sonner';

// Fix for default Leaflet icons in environments where they don't load correctly
// This is a common "subtle" issue with Leaflet in modern bundlers.
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// TYPES
type ReportStatus = 'green' | 'yellow' | 'red';



interface WardData {
    lat: number;
    lng: number;
    redPins: number;
}

// CONSTANTS
const KATHMANDU_CENTER: [number, number] = [27.7172, 85.3240];

const MUNICIPALITY_CENTERS: Record<string, WardData> = {
    'Baneshwor, Kathmandu': { lat: 27.7172, lng: 85.3240, redPins: 2 },
    'Nakshal, Kathmandu': { lat: 27.7000, lng: 85.3000, redPins: 5 },
    'Maharajgunj, Kathmandu': { lat: 27.7200, lng: 85.3100, redPins: 15 },
};

// ─── GeoJSON Style Helper ───────────────────────────────────────────────────────
const geoJsonStyle: L.PathOptions = {
    fillColor: '#64748b',
    fillOpacity: 0.05,
    color: '#94a3b8',
    weight: 1,
};

// STATIC UTILS
// Defining icons outside to prevent recreation on every render
const COLORS = {
    green: '#12BF58',
    yellow: '#f59e0b',
    red: '#f43f5e'
};

const getIconHtml = (status: ReportStatus) => `
    <div class="relative flex items-center justify-center">
      ${status === 'red' ? '<div class="absolute w-8 h-8 bg-rose-500/30 rounded-full animate-pulse-red"></div>' : ''}
      <div class="w-4 h-4 rounded-full border-2 border-white shadow-lg" style="background-color: ${COLORS[status]}"></div>
    </div>
`;

// Memoized Icon generator function would be better, but we can pre-create them
const ICONS = {
    green: L.divIcon({ html: getIconHtml('green'), className: 'custom-marker-icon', iconSize: [32, 32], iconAnchor: [16, 16] }),
    yellow: L.divIcon({ html: getIconHtml('yellow'), className: 'custom-marker-icon', iconSize: [32, 32], iconAnchor: [16, 16] }),
    red: L.divIcon({ html: getIconHtml('red'), className: 'custom-marker-icon', iconSize: [32, 32], iconAnchor: [16, 16] }),
};

// MAP SUB-COMPONENTS
/**
 * Internal map controller to handle programmatic navigation
 * Must be a child of MapContainer to access useMap hook
 */
function MapController({ center }: { center: [number, number] | null }) {
    const map = useMap();

    useEffect(() => {
        if (center) {
            map.flyTo(center, 14, {
                duration: 1.5,
                easeLinearity: 0.25
            });
        }
    }, [center, map]);

    return null;
}

// MAIN COMPONENT
function LiveMapPage() {
    const dispatch = useAppDispatch();
    const pins = useAppSelector((state) => state.pins.pins);
    const { data: fetchedPins } = useFetchPins();
    const agePinDev = useAgePinDev();

    useEffect(() => {
        if (fetchedPins) {
            dispatch(setPins(fetchedPins));
        }
    }, [fetchedPins, dispatch]);


    const navigate = useNavigate();


    const [selectedWard, setSelectedWard] = useState<string | null>(null);
    const [mapCenter, setMapCenter] = useState<[number, number] | null>(null);
    const [showHeatmap, setShowHeatmap] = useState(false);
    const [selectedPin, setSelectedPin] = useState<any>(null);

    // Sync selectedPin with pins when they update via polling
    useEffect(() => {
        if (!selectedPin?.id || pins.length === 0) return;
        
        const updatedPinStr = pins.find(p => p.id === selectedPin.id);
        if (updatedPinStr) {
            const createdAtDate = new Date(updatedPinStr.createdAt);
            const now = new Date();
            const daysDiff = Math.floor((now.getTime() - createdAtDate.getTime()) / (1000 * 3600 * 24));
            
            let pinColor: 'green' | 'yellow' | 'red' = 'green';
            if (daysDiff >= 7) pinColor = 'red';
            else if (daysDiff >= 3) pinColor = 'yellow';
            else pinColor = 'green';
            
            const newObj = {
                id: updatedPinStr.id as any,
                title: (updatedPinStr.wasteType || []).join(', ') || 'Waste Report',
                lat: updatedPinStr.latitude,
                lng: updatedPinStr.longitude,
                status: pinColor,
                pinStatus: updatedPinStr.status,
                days: daysDiff,
                ward: updatedPinStr.municipality,
                type: updatedPinStr.wasteSize,
                description: updatedPinStr.description,
                imageUrl: updatedPinStr.imageUrl,
                reportedBy: {
                    name: updatedPinStr.reporter?.name || "Anonymous Citizen",
                    avatar: updatedPinStr.reporter?.profilePic || ""
                },
                bountyPool: `रू ${updatedPinStr.bountyPool}`,
                timestamp: new Date(updatedPinStr.createdAt).toLocaleString(),
                votes: updatedPinStr.upvotes,
                cleanupProof: updatedPinStr.cleanupProof || null,
            };
            
            setSelectedPin((prev: any) => {
                if (!prev) return newObj;
                // Avoid unnecessary re-renders if nothing important changed
                if (prev.votes !== newObj.votes || 
                    prev.bountyPool !== newObj.bountyPool || 
                    prev.pinStatus !== newObj.pinStatus || 
                    prev.days !== newObj.days ||
                    JSON.stringify(prev.cleanupProof) !== JSON.stringify(newObj.cleanupProof)) {
                    return newObj;
                }
                return prev;
            });
        }
    }, [pins, selectedPin?.id]);

    // Business Logic
    const handleWardSelect = (ward: string, lat: number, lng: number) => {
        setSelectedWard(ward);
        setMapCenter([lat, lng]);
    };

    const resetMap = () => {
        setMapCenter(KATHMANDU_CENTER);
        setSelectedWard(null);
    };

    // Memoize heatmap layers to prevent jumpy rendering
    const HeatmapLayers = useMemo(() => {
        if (!showHeatmap) return null;
        return Object.entries(MUNICIPALITY_CENTERS).map(([name, data]) => (
            <Circle
                key={name}
                center={[data.lat, data.lng]}
                radius={800}
                pathOptions={{
                    fillColor: '#f43f5e',
                    color: '#f43f5e',
                    weight: 1,
                    opacity: 0.3,
                    fillOpacity: Math.min(data.redPins / 20, 0.8), // Clamp opacity
                }}
            />
        ));
    }, [showHeatmap]);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full pb-8">
            {/* Map Column */}
            <div className="lg:col-span-8 relative">
                <div className="glass-panel rounded-[2.5rem] h-full overflow-hidden relative border-4 border-white shadow-2xl">
                    <MapContainer
                        center={KATHMANDU_CENTER}
                        zoom={13}
                        className="w-full h-full z-0"
                        zoomControl={false}
                    >
                        <TileLayer
                            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                        />

                        {/* ── Municipality Boundaries Layer ── */}
                        <GeoJSON
                            data={kathmanduPalikas as any}
                            style={geoJsonStyle}
                        />

                        {/* Programmatic Controls */}
                        <MapController center={mapCenter} />

                        {/* Conditional Layers */}
                        {HeatmapLayers}

                        {/* Clustered Markers */}
                        <MarkerClusterGroup
                            chunkedLoading
                            polygonOptions={{
                                fillColor: '#12BF58',
                                color: '#12BF58',
                                weight: 1,
                                opacity: 0.5,
                                fillOpacity: 0.2,
                            }}
                        >
                            {pins.map((pin) => {
                                const createdAtDate = new Date(pin.createdAt);
                                const now = new Date();
                                const daysDiff = Math.floor((now.getTime() - createdAtDate.getTime()) / (1000 * 3600 * 24));
                                const ageDisplay = daysDiff === 0 ? '< 1D' : `${daysDiff}D`;

                                // Map backend status to our frontend colors based on age
                                let pinColor: 'green' | 'yellow' | 'red' = 'green';
                                if (daysDiff >= 7) pinColor = 'red';
                                else if (daysDiff >= 3) pinColor = 'yellow';
                                else pinColor = 'green';

                                return (
                                    <Marker
                                        key={pin.id}
                                        position={[pin.latitude, pin.longitude]}
                                        icon={ICONS[pinColor]}
                                    >
                                        <Popup className="custom-popup">
                                            <div className="p-3 min-w-[240px] max-w-[280px]">
                                                {/* Header: Municipality in BOLD CAPS */}
                                                <div className="flex justify-between items-start mb-2 gap-2 border-b border-slate-100 pb-2">
                                                    <h4 className="font-black text-slate-900 uppercase text-xs tracking-widest">{pin.municipality}</h4>
                                                    <span className={`text-[8px] font-black px-2 py-0.5 rounded-full whitespace-nowrap ${pinColor === 'red' ? 'bg-rose-500/20 text-rose-500' :
                                                        pinColor === 'yellow' ? 'bg-amber-500/20 text-amber-500' :
                                                            'bg-emerald-500/20 text-emerald-600'
                                                        }`}>
                                                        {pin.status.replace('_', ' ')}
                                                    </span>
                                                </div>

                                                {/* Image Thumbnail */}
                                                {pin.imageUrl && (
                                                    <div className="w-full h-24 mb-3 rounded-lg overflow-hidden border border-slate-200">
                                                        <img src={pin.imageUrl} alt="Waste" className="w-full h-full object-cover" />
                                                    </div>
                                                )}

                                                {/* Tags: Waste Types & Size */}
                                                <div className="flex flex-wrap gap-1 mb-3">
                                                    {pin.wasteType.map((type, idx) => (
                                                        <span key={idx} className="bg-slate-100 text-slate-600 text-[9px] font-bold px-1.5 py-0.5 rounded">
                                                            {type}
                                                        </span>
                                                    ))}
                                                    <span className="bg-primary/10 text-primary text-[9px] font-bold px-1.5 py-0.5 rounded">
                                                        {pin.wasteSize}
                                                    </span>
                                                    <span className="bg-slate-100 text-slate-500 text-[9px] font-bold px-1.5 py-0.5 rounded">
                                                        {ageDisplay} RECORDED
                                                    </span>
                                                </div>

                                                {/* Description Text */}
                                                <p className="text-xs text-slate-600 mb-4 leading-relaxed font-medium line-clamp-3">
                                                    {pin.description || "No description provided by the reporter."}
                                                </p>

                                                <motion.button
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={() => {
                                                        setSelectedPin({
                                                            id: pin.id as any,
                                                            title: (pin.wasteType || []).join(', ') || 'Waste Report',
                                                            lat: pin.latitude,
                                                            lng: pin.longitude,
                                                            status: pinColor,
                                                            pinStatus: pin.status,
                                                            days: daysDiff,
                                                            ward: pin.municipality,
                                                            type: pin.wasteSize,
                                                            description: pin.description,
                                                            imageUrl: pin.imageUrl,
                                                            reportedBy: {
                                                                name: pin.reporter?.name || "Anonymous Citizen",
                                                                avatar: pin.reporter?.profilePic || ""
                                                            },
                                                            bountyPool: `रू ${pin.bountyPool}`,
                                                            timestamp: new Date(pin.createdAt).toLocaleString(),
                                                            votes: pin.upvotes,
                                                            cleanupProof: pin.cleanupProof || null,
                                                        });
                                                    }}
                                                    className="w-full bg-primary text-white py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20 mb-2"
                                                >
                                                    View Tactical Details
                                                </motion.button>

                                                <motion.button
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        agePinDev.mutate(pin.id, {
                                                            onSuccess: () => {
                                                                console.log("Success in LiveMapPage");
                                                            }
                                                        });
                                                    }}
                                                    className="w-full bg-slate-200 text-slate-700 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm hover:bg-slate-300 transition-colors"
                                                    disabled={agePinDev.isPending}
                                                >
                                                    {agePinDev.isPending ? 'Aging...' : 'Dev Toggle (Age 8 Days)'}
                                                </motion.button>
                                            </div>
                                        </Popup>
                                    </Marker>
                                )
                            })}
                        </MarkerClusterGroup>
                    </MapContainer>

                    {/* Overlay Logic UI */}
                    <div className="absolute top-8 right-8 z-[1000] flex flex-col gap-4">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.9 }}
                            className="w-12 h-12 glass-card flex items-center justify-center text-slate-400 hover:text-primary transition-all shadow-xl bg-white/90"
                        >
                            <Search size={20} />
                        </motion.button>

                        <div className="flex flex-col glass-card shadow-xl bg-white/90 overflow-hidden">
                            <motion.button
                                whileTap={{ scale: 0.9 }}
                                onClick={() => setShowHeatmap(!showHeatmap)}
                                className={`w-12 h-12 flex items-center justify-center border-b border-slate-100 transition-all ${showHeatmap ? 'text-primary bg-primary/5' : 'text-slate-400 hover:text-primary'}`}
                                title="Toggle Heatmap"
                            >
                                <Layers size={20} />
                            </motion.button>
                            <motion.button
                                whileTap={{ scale: 0.9 }}
                                onClick={resetMap}
                                className="w-12 h-12 flex items-center justify-center text-slate-400 hover:text-primary transition-all"
                                title="Reset View"
                            >
                                <Crosshair size={20} />
                            </motion.button>
                        </div>
                    </div>

                    {/* Bottom Legend */}
                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[1000] w-max">
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className="glass-card px-10 py-4 flex gap-10 shadow-2xl bg-white/95 backdrop-blur-md rounded-3xl"
                        >
                            <LegendItem color="bg-primary" label="DAY 1-3" />
                            <LegendItem color="bg-amber-500" label="DAY 4-7" />
                            <LegendItem color="bg-rose-500" label="7+ DAYS" isPulse />
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Sidebar Column */}
            <div className="lg:col-span-4 space-y-6 overflow-y-auto custom-scrollbar pr-2">
                {/* Ranking Widget */}
                <div className="glass-panel rounded-[2.5rem] p-8 relative overflow-hidden shadow-xl border border-white">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">TACTICAL STATUS</p>
                            <h3 className="text-xl font-black text-slate-900">Area Escalation Ranking</h3>
                        </div>
                        <Info size={18} className="text-slate-400" />
                    </div>

                    <div className="space-y-4">
                        <RankItem
                            rank={1}
                            ward="Nakshal, Kathmandu"
                            stat="Avg Resolve: 4.2h"
                            color="bg-primary/5"
                            isActive={selectedWard === 'Nakshal, Kathmandu'}
                            onClick={() => handleWardSelect('Nakshal, Kathmandu', 27.7000, 85.3000)}
                        />
                        <RankItem
                            rank={2}
                            ward="Baneshwor, Kathmandu"
                            stat="Avg Resolve: 6.1h"
                            color="bg-slate-50"
                            isActive={selectedWard === 'Baneshwor, Kathmandu'}
                            onClick={() => handleWardSelect('Baneshwor, Kathmandu', 27.7172, 85.3240)}
                        />
                        <RankItem
                            rank={32}
                            ward="Maharajgunj, Kathmandu"
                            stat="24 Active Red Pins"
                            color="bg-rose-500/5"
                            textColor="text-rose-500"
                            isBad
                            isActive={selectedWard === 'Maharajgunj, Kathmandu'}
                            onClick={() => handleWardSelect('Maharajgunj, Kathmandu', 27.7200, 85.3100)}
                        />
                    </div>

                    <motion.button
                        whileTap={{ scale: 0.98 }}
                        className="w-full mt-8 py-4 glass-card text-[10px] font-black text-slate-900 uppercase tracking-widest hover:bg-slate-50 transition-colors shadow-sm"
                        onClick={() => navigate("/app/impact-stats")}
                    >
                        View Full Metropols Ranking
                    </motion.button>
                </div>


            </div>

            <ReportDetailsPanel
                report={selectedPin}
                onClose={() => setSelectedPin(null)}
                onVoteChange={(votes) => setSelectedPin((prev: any) => (prev ? { ...prev, votes } : null))}
            />
        </div>
    );
}

// UI HELPER COMPONENTS
function RankItem({ rank, ward, stat, color, textColor, isBad, isActive, onClick }: any) {
    return (
        <motion.div
            whileHover={{ x: 5 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
            className={`flex items-center justify-between p-5 rounded-3xl ${color} border ${isActive ? 'border-primary ring-2 ring-primary/10' : 'border-slate-100'} cursor-pointer transition-all shadow-sm`}
        >
            <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-sm shadow-md ${isBad ? 'bg-rose-500 text-white' : 'bg-primary text-white'}`}>
                    {rank}
                </div>
                <div>
                    <h4 className="text-sm font-black text-slate-900">{ward}</h4>
                    <p className={`text-[10px] font-bold ${textColor || 'text-slate-400'} uppercase tracking-widest`}>{stat}</p>
                </div>
            </div>
            {!isBad ? <CheckCircle2 size={18} className="text-primary" /> : <AlertTriangle size={18} className="text-rose-500" />}
        </motion.div>
    );
}

function LegendItem({ color, label, isPulse }: any) {
    return (
        <div className="flex items-center gap-3">
            <div className={`w-3.5 h-3.5 rounded-full ${color} ${isPulse ? 'animate-pulse-red' : ''} shadow-lg`} />
            <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{label}</span>
        </div>
    );
}



export default LiveMapPage;
