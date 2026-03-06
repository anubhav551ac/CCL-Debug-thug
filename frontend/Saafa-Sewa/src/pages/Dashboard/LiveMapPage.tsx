
import { useState, useEffect, useMemo } from 'react';
import { motion } from 'motion/react';
import {
    Info,
    Zap,
    Search,
    Layers,
    Crosshair,
    AlertTriangle,
    CheckCircle2
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Circle } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

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

interface Report {
    id: number;
    lat: number;
    lng: number;
    status: ReportStatus;
    days: number;
    ward: string;
    type: string;
}

interface WardData {
    lat: number;
    lng: number;
    redPins: number;
}

// CONSTANTS
const KATHMANDU_CENTER: [number, number] = [27.7172, 85.3240];

const MOCK_REPORTS: Report[] = [
    { id: 1, lat: 27.7172, lng: 85.3240, status: 'green', days: 1, ward: 'Ward 10', type: 'Trash Accumulation' },
    { id: 2, lat: 27.7000, lng: 85.3000, status: 'yellow', days: 5, ward: 'Ward 08', type: 'Clogged Drain' },
    { id: 3, lat: 27.7200, lng: 85.3100, status: 'red', days: 12, ward: 'Ward 03', type: 'Illegal Dumping' },
    { id: 4, lat: 27.7100, lng: 85.3300, status: 'green', days: 2, ward: 'Ward 10', type: 'Trash Accumulation' },
    { id: 5, lat: 27.6900, lng: 85.3200, status: 'red', days: 8, ward: 'Ward 03', type: 'Clogged Drain' },
    { id: 6, lat: 27.7050, lng: 85.3150, status: 'yellow', days: 4, ward: 'Ward 08', type: 'Trash Accumulation' },
];

const WARD_CENTERS: Record<string, WardData> = {
    'Ward 10': { lat: 27.7172, lng: 85.3240, redPins: 2 },
    'Ward 08': { lat: 27.7000, lng: 85.3000, redPins: 5 },
    'Ward 03': { lat: 27.7200, lng: 85.3100, redPins: 15 },
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
    const [selectedWard, setSelectedWard] = useState<string | null>(null);
    const [mapCenter, setMapCenter] = useState<[number, number] | null>(null);
    const [showHeatmap, setShowHeatmap] = useState(false);

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
        return Object.entries(WARD_CENTERS).map(([name, data]) => (
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
                            {MOCK_REPORTS.map((report) => (
                                <Marker
                                    key={report.id}
                                    position={[report.lat, report.lng]}
                                    icon={ICONS[report.status]}
                                >
                                    <Popup className="custom-popup">
                                        <div className="p-3 min-w-[220px]">
                                            <div className="flex justify-between items-start mb-2 gap-2">
                                                <h4 className="font-black text-primary uppercase text-[10px] tracking-widest">{report.type}</h4>
                                                <span className={`text-[8px] font-black px-2 py-0.5 rounded-full whitespace-nowrap ${report.status === 'red' ? 'bg-rose-500/20 text-rose-500' :
                                                        report.status === 'yellow' ? 'bg-amber-500/20 text-amber-500' :
                                                            'bg-primary/20 text-primary'
                                                    }`}>
                                                    {report.days}D AGING
                                                </span>
                                            </div>
                                            <p className="text-xs text-slate-600 mb-4 leading-relaxed font-medium">
                                                Location: <span className="text-slate-900 font-bold">{report.ward}</span>.
                                                High priority escalation protocol active.
                                            </p>
                                            <motion.button
                                                whileTap={{ scale: 0.95 }}
                                                className="w-full bg-primary text-white py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20"
                                            >
                                                View Tactical Details
                                            </motion.button>
                                        </div>
                                    </Popup>
                                </Marker>
                            ))}
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
                            <h3 className="text-xl font-black text-slate-900">Ward Escalation Ranking</h3>
                        </div>
                        <Info size={18} className="text-slate-400" />
                    </div>

                    <div className="space-y-4">
                        <RankItem
                            rank={1}
                            ward="Ward 08"
                            stat="Avg Resolve: 4.2h"
                            color="bg-primary/5"
                            isActive={selectedWard === 'Ward 08'}
                            onClick={() => handleWardSelect('Ward 08', 27.7000, 85.3000)}
                        />
                        <RankItem
                            rank={2}
                            ward="Ward 10"
                            stat="Avg Resolve: 6.1h"
                            color="bg-slate-50"
                            isActive={selectedWard === 'Ward 10'}
                            onClick={() => handleWardSelect('Ward 10', 27.7172, 85.3240)}
                        />
                        <RankItem
                            rank={32}
                            ward="Ward 03"
                            stat="24 Active Red Pins"
                            color="bg-rose-500/5"
                            textColor="text-rose-500"
                            isBad
                            isActive={selectedWard === 'Ward 03'}
                            onClick={() => handleWardSelect('Ward 03', 27.7200, 85.3100)}
                        />
                    </div>

                    <motion.button
                        whileTap={{ scale: 0.98 }}
                        className="w-full mt-8 py-4 glass-card text-[10px] font-black text-slate-900 uppercase tracking-widest hover:bg-slate-50 transition-colors shadow-sm"
                    >
                        View Full Metropols Ranking
                    </motion.button>
                </div>

                {/* Escalation Engine Widget */}
                <div className="glass-panel rounded-[2.5rem] p-8 shadow-xl border border-white bg-slate-900 text-white">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-0.5 bg-primary" />
                        <h3 className="text-[10px] font-black uppercase tracking-widest text-primary">THE ESCALATION ENGINE</h3>
                    </div>

                    <div className="space-y-8">
                        <CycleStep
                            phase="01"
                            title="GOVERNMENT WINDOW"
                            desc="72-hour priority window for Ward cleanup crews."
                            color="bg-primary"
                            active
                        />
                        <CycleStep
                            phase="02"
                            title="JANTA OVERRIDE"
                            desc="Bounty unlocks for community gig-workers after 7 days."
                            color="bg-amber-500"
                            active
                        />
                        <CycleStep
                            phase="03"
                            title="CIVIC COMMAND"
                            desc="Budget audits and public ranking for persistent failure."
                            color="bg-rose-500"
                            active
                        />
                    </div>

                    <div className="mt-10 bg-white/5 rounded-3xl p-6 border border-white/10 backdrop-blur-sm">
                        <div className="flex items-center gap-2 mb-3 text-rose-400">
                            <Zap size={14} className="fill-rose-400" />
                            <span className="text-[10px] font-black uppercase tracking-widest">CRITICAL ALERT</span>
                        </div>
                        <p className="text-xs text-slate-300 italic leading-relaxed font-medium">
                            "Ward 03 has passed Threshold Sigma. Bounty pool incentivization increased by 25% for rapid clearance."
                        </p>
                    </div>
                </div>
            </div>
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

function CycleStep({ phase, title, desc, color, active }: any) {
    return (
        <div className={`flex gap-5 ${!active ? 'opacity-30' : ''}`}>
            <div className="flex flex-col items-center">
                <div className={`w-3 h-3 rounded-full ${color} ${active ? 'ring-4 ring-white/10' : ''}`} />
                <div className="w-0.5 flex-1 bg-white/10 my-2" />
            </div>
            <div>
                <h4 className="text-[10px] font-black text-white uppercase tracking-widest mb-1">PHASE {phase}: {title}</h4>
                <p className="text-xs text-slate-400 leading-relaxed font-medium">{desc}</p>
            </div>
        </div>
    );
}

export default LiveMapPage;
