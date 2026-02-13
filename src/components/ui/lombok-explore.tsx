"use client";

import { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import { motion } from "framer-motion";
import { Mountain, Waves, Sun, Camera, ArrowUpRight, Compass, MapPin, Tent, CloudRain, Landmark } from "lucide-react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const createCustomIcon = (color: string, isActive: boolean) => {
  return L.divIcon({
    className: "custom-marker",
    html: `
      <div class="relative flex items-center justify-center w-8 h-8">
        ${isActive ? '<span class="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75" style="background-color: ' + color + '"></span>' : ''}
        <div class="relative inline-flex items-center justify-center w-8 h-8 rounded-full border-2 border-white shadow-lg bg-zinc-900 transition-transform duration-300 ${isActive ? 'scale-150 z-50' : 'scale-100'}">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
        </div>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
};

const CATEGORIES: any = {
  beach: { icon: <Waves className="w-4 h-4 text-blue-400" />, color: "#60a5fa", gradient: "from-blue-500/20 to-cyan-500/20" },
  mountain: { icon: <Mountain className="w-4 h-4 text-orange-400" />, color: "#fb923c", gradient: "from-orange-500/20 to-red-500/20" },
  culture: { icon: <Landmark className="w-4 h-4 text-emerald-400" />, color: "#34d399", gradient: "from-emerald-500/20 to-green-500/20" },
  gili: { icon: <Sun className="w-4 h-4 text-yellow-400" />, color: "#facc15", gradient: "from-yellow-500/20 to-amber-500/20" },
  waterfall: { icon: <CloudRain className="w-4 h-4 text-cyan-400" />, color: "#22d3ee", gradient: "from-cyan-500/20 to-blue-500/20" },
  spot: { icon: <Camera className="w-4 h-4 text-purple-400" />, color: "#c084fc", gradient: "from-purple-500/20 to-pink-500/20" },
  stay: { icon: <Tent className="w-4 h-4 text-rose-400" />, color: "#fb7185", gradient: "from-rose-500/20 to-red-500/20" }
};

const RAW_LOCATIONS = [
  { id: 1, type: 'mountain', title: "Mount Rinjani", desc: "Gunung berapi tertinggi kedua di Indonesia (3.726 mdpl).", lat: -8.4113, lng: 116.4573 },
  { id: 2, type: 'spot', title: "Mandalika Circuit", desc: "Sirkuit Internasional MotoGP kebanggaan Indonesia.", lat: -8.8911, lng: 116.2954 },
  { id: 3, type: 'beach', title: "Kuta Mandalika", desc: "Pusat pariwisata Lombok Tengah dengan pasir merica.", lat: -8.8955, lng: 116.2770 },
  { id: 4, type: 'beach', title: "Tanjung Aan", desc: "Pantai pasir putih halus dan bukit merese yang ikonik.", lat: -8.9090, lng: 116.3216 },
  { id: 5, type: 'spot', title: "Bukit Merese", desc: "Spot sunset terbaik dengan pemandangan tanjung aan.", lat: -8.9135, lng: 116.3255 },
  { id: 6, type: 'beach', title: "Selong Belanak", desc: "Pantai landai favorit peselancar pemula.", lat: -8.8687, lng: 116.1578 },
  { id: 7, type: 'beach', title: "Mawun Beach", desc: "Teluk tersembunyi berbentuk tapal kuda yang tenang.", lat: -8.8833, lng: 116.2238 },
  { id: 8, type: 'culture', title: "Sade Village", desc: "Desa adat Suku Sasak dengan rumah lantai kotoran kerbau.", lat: -8.8398, lng: 116.2925 },
  { id: 9, type: 'culture', title: "Ende Village", desc: "Alternatif desa adat Sasak yang lebih autentik.", lat: -8.8150, lng: 116.2850 },
  { id: 10, type: 'beach', title: "Pink Beach", desc: "Pantai Tangsi dengan pasir berwarna merah muda.", lat: -8.8475, lng: 116.5050 },
  { id: 11, type: 'gili', title: "Gili Trawangan", desc: "Party island terbesar dan terpopuler.", lat: -8.3518, lng: 116.0396 },
  { id: 12, type: 'gili', title: "Gili Meno", desc: "Pulau tenang, cocok untuk honeymoon dan penyu.", lat: -8.3511, lng: 116.0578 },
  { id: 13, type: 'gili', title: "Gili Air", desc: "Perpaduan keramaian Trawangan dan ketenangan Meno.", lat: -8.3583, lng: 116.0833 },
  { id: 14, type: 'gili', title: "Gili Nanggu", desc: "Surga snorkeling di Lombok Barat (Sekotong).", lat: -8.7236, lng: 115.9922 },
  { id: 15, type: 'gili', title: "Gili Sudak", desc: "Pulau kecil dengan air tenang dan ikan bintang laut.", lat: -8.7250, lng: 116.0020 },
  { id: 16, type: 'gili', title: "Gili Kedis", desc: "Pulau super mungil, bisa dikelilingi dalam 5 menit.", lat: -8.7289, lng: 116.0025 },
  { id: 17, type: 'gili', title: "Gili Asahan", desc: "Hidden gem di Sekotong ujung.", lat: -8.7450, lng: 115.9550 },
  { id: 18, type: 'gili', title: "Gili Kondo", desc: "Pulau tak berpenghuni di Lombok Timur.", lat: -8.4950, lng: 116.7350 },
  { id: 19, type: 'beach', title: "Senggigi Beach", desc: "Kawasan wisata legendaris dengan sunset menawan.", lat: -8.4936, lng: 116.0520 },
  { id: 20, type: 'culture', title: "Islamic Center", desc: "Masjid Hubbul Wathan, ikon Kota Mataram.", lat: -8.5830, lng: 116.1150 },
  { id: 21, type: 'culture', title: "Taman Narmada", desc: "Taman air bersejarah replika Gunung Rinjani.", lat: -8.6010, lng: 116.1950 },
  { id: 22, type: 'culture', title: "Pura Lingsar", desc: "Simbol kerukunan umat Hindu dan Muslim (Wektu Telu).", lat: -8.5770, lng: 116.1900 },
  { id: 23, type: 'spot', title: "Bukit Malimbu", desc: "Viewpoint sunset dengan latar Gunung Agung Bali.", lat: -8.4550, lng: 116.0350 },
  { id: 24, type: 'spot', title: "Villa Hantu", desc: "Bangunan villa terbengkalai yang jadi spot foto hits.", lat: -8.4650, lng: 116.0400 },
  { id: 25, type: 'waterfall', title: "Sendang Gile", desc: "Air terjun dua tingkat di Senaru.", lat: -8.3033, lng: 116.4072 },
  { id: 26, type: 'waterfall', title: "Tiu Kelep", desc: "Air terjun spektakuler di tengah hutan Senaru.", lat: -8.3100, lng: 116.4050 },
  { id: 27, type: 'waterfall', title: "Benang Kelambu", desc: "Air terjun unik yang keluar dari sela tanaman.", lat: -8.5530, lng: 116.3450 },
  { id: 28, type: 'waterfall', title: "Benang Stokel", desc: "Air terjun kembar di Lombok Tengah.", lat: -8.5480, lng: 116.3420 },
  { id: 29, type: 'mountain', title: "Sembalun Village", desc: "Desa di lembah Rinjani, udaranya dingin.", lat: -8.3610, lng: 116.5250 },
  { id: 30, type: 'mountain', title: "Bukit Pergasingan", desc: "Spot camping dengan view kotak-kotak sawah Sembalun.", lat: -8.3580, lng: 116.5350 },
  { id: 31, type: 'spot', title: "Pusuk Sembalun", desc: "Taman wisata di ketinggian dengan monyet liar.", lat: -8.3950, lng: 116.5100 },
  { id: 32, type: 'mountain', title: "Savana Dandaun", desc: "Padang rumput luas di atas awan.", lat: -8.3800, lng: 116.5400 },
  { id: 33, type: 'waterfall', title: "Mangku Sakti", desc: "Air terjun dengan batuan putih sulfur.", lat: -8.3350, lng: 116.4850 },
  { id: 34, type: 'beach', title: "Pantai Semeti", desc: "Pantai dengan batuan karang unik seperti di planet lain.", lat: -8.9050, lng: 116.1350 },
  { id: 35, type: 'beach', title: "Pantai Telawas", desc: "Batuan karang tajam yang fotogenik.", lat: -8.9030, lng: 116.1400 },
  { id: 36, type: 'beach', title: "Pantai Mawi", desc: "Surga para peselancar pro.", lat: -8.8980, lng: 116.1450 },
  { id: 37, type: 'culture', title: "Masjid Kuno Bayan", desc: "Masjid tertua di Lombok (Abad 16).", lat: -8.2750, lng: 116.4250 },
  { id: 38, type: 'spot', title: "Tete Batu", desc: "Ubud-nya Lombok, sawah terasering dan air terjun.", lat: -8.5350, lng: 116.4150 },
  { id: 39, type: 'waterfall', title: "Sarang Walet Waterfall", desc: "Air terjun di dalam gua di Tete Batu.", lat: -8.5250, lng: 116.4200 },
  { id: 40, type: 'beach', title: "Pantai Kerandangan", desc: "Pantai tenang dekat Senggigi.", lat: -8.4800, lng: 116.0500 },
  { id: 41, type: 'beach', title: "Pantai Nipah", desc: "Terkenal dengan ikan bakarnya.", lat: -8.4200, lng: 116.0250 },
  { id: 42, type: 'beach', title: "Pantai Pandanan", desc: "Spot snorkeling murah meriah.", lat: -8.4100, lng: 116.0200 },
  { id: 43, type: 'beach', title: "Pantai Sire", desc: "Pantai landai dekat lapangan golf Kosaido.", lat: -8.3650, lng: 116.1200 },
  { id: 44, type: 'culture', title: "Pura Batu Bolong", desc: "Pura di atas batu karang bolong (Senggigi).", lat: -8.5050, lng: 116.0450 },
  { id: 45, type: 'spot', title: "Bukit Selong", desc: "Viewpoint desa adat dan sawah Sembalun.", lat: -8.3550, lng: 116.5300 },
  { id: 46, type: 'spot', title: "Tanjung Ringgit", desc: "Ujung timur Lombok, tebing curam dan meriam Jepang.", lat: -8.8600, lng: 116.5950 },
  { id: 47, type: 'beach', title: "Pantai Penyisok", desc: "Padang savana dan tebing karang emas.", lat: -8.8750, lng: 116.5550 },
  { id: 48, type: 'beach', title: "Pantai Kaliantan", desc: "Lokasi tradisi Bau Nyale.", lat: -8.8850, lng: 116.5750 },
  { id: 49, type: 'mountain', title: "Danau Segara Anak", desc: "Danau vulkanik di kawah Rinjani.", lat: -8.4150, lng: 116.4450 },
  { id: 50, type: 'mountain', title: "Gunung Baru Jari", desc: "Anak gunung Rinjani di tengah danau.", lat: -8.4200, lng: 116.4350 }
];

const LOCATIONS = RAW_LOCATIONS.map(loc => ({
  ...loc,
  ...CATEGORIES[loc.type]
}));

function MapController({ activeLoc }: { activeLoc: typeof LOCATIONS[0] }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo([activeLoc.lat, activeLoc.lng], 12, {
      animate: true,
      duration: 1.5
    });
  }, [activeLoc, map]);
  return null;
}

export function LombokExplore() {
  const [activeLocation, setActiveLocation] = useState(LOCATIONS[0]);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});

  useEffect(() => {
    const activeCard = cardRefs.current[activeLocation.id];
    const container = scrollContainerRef.current;

    if (activeCard && container) {
      const containerWidth = container.offsetWidth;
      const cardOffsetLeft = activeCard.offsetLeft;
      const cardWidth = activeCard.offsetWidth;

      const scrollTo = cardOffsetLeft - (containerWidth / 2) + (cardWidth / 2);

      container.scrollTo({
        left: scrollTo,
        behavior: "smooth",
      });
    }
  }, [activeLocation]);

  const openGoogleMaps = (loc: typeof LOCATIONS[0]) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${loc.lat},${loc.lng}`;
    window.open(url, '_blank');
  };

  return (
    <section className="relative w-full min-h-screen bg-black flex flex-col items-center justify-end pb-10 border-t border-white/10 overflow-hidden">
      
      {/* HEADER TEXT */}
      <div className="absolute top-10 left-0 right-0 z-[1000] text-center pointer-events-none px-4 pt-10 md:pt-0">
         <motion.div
            initial={{ y: -20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
         >
            <h2 className="text-4xl md:text-6xl font-black text-white mt-4 drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)]">
                DISCOVER <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">LOMBOK</span>
            </h2>
         </motion.div>
      </div>

      {/* MAP CONTAINER */}
      <div className="absolute inset-0 z-0">
        <MapContainer 
            center={[activeLocation.lat, activeLocation.lng]} 
            zoom={10} 
            scrollWheelZoom={false}
            className="w-full h-full grayscale-[20%] hover:grayscale-0 transition-all duration-1000"
            zoomControl={false}
        >
            <TileLayer
                attribution='© CARTO'
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            />
            <MapController activeLoc={activeLocation} />

            {LOCATIONS.map((loc) => (
                <Marker 
                    key={loc.id} 
                    position={[loc.lat, loc.lng]}
                    icon={createCustomIcon(loc.color, loc.id === activeLocation.id)}
                    eventHandlers={{
                        click: () => setActiveLocation(loc),
                    }}
                />
            ))}
        </MapContainer>
        
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(transparent_0%,#000000_100%)] opacity-60"></div>
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-black/80 via-transparent to-black"></div>
      </div>

      {/* CARDS CONTAINER */}
      <div className="relative z-[1000] w-full max-w-6xl px-4 md:px-6">
         {/* Tampilan 3 Card di Desktop (Max-width control) */}
         <div 
            ref={scrollContainerRef}
            className="flex gap-4 overflow-x-auto pb-8 pt-4 px-4 snap-x scrollbar-hide no-scrollbar"
            style={{ scrollBehavior: 'smooth' }}
         >
            {LOCATIONS.map((loc) => (
               <motion.div
                  key={loc.id}
                  ref={(el) => (cardRefs.current[loc.id] = el)}
                  onClick={() => setActiveLocation(loc)}
                  className={`relative flex-shrink-0 w-[85vw] md:w-[calc(33.333%-11px)] text-left p-6 rounded-3xl border backdrop-blur-md transition-all duration-500 snap-center group cursor-pointer overflow-hidden ${
                     activeLocation.id === loc.id 
                     ? `bg-zinc-900/90 border-white/20 shadow-[0_0_40px_-10px_rgba(255,255,255,0.1)] scale-100` 
                     : 'bg-zinc-900/40 border-white/5 hover:bg-zinc-900/60 scale-95 opacity-60 hover:opacity-100'
                  }`}
               >
                  {activeLocation.id === loc.id && (
                     <div className={`absolute inset-0 bg-gradient-to-br ${loc.gradient} opacity-10 pointer-events-none`} />
                  )}

                  <div className="relative z-10 flex flex-col h-full">
                     <div className="flex justify-between items-start mb-3">
                        <div className={`p-2.5 rounded-xl bg-white/5 border border-white/10 ${activeLocation.id === loc.id ? 'text-white' : 'text-zinc-500'}`}>
                           {loc.icon}
                        </div>
                        {activeLocation.id === loc.id && (
                            <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-green-500/10 border border-green-500/20">
                              <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                              </span>
                            </div>
                        )}
                     </div>
                     
                     <h3 className={`text-xl font-bold mb-1 transition-colors ${activeLocation.id === loc.id ? 'text-white' : 'text-zinc-300'}`}>
                        {loc.title}
                     </h3>
                     <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed mb-4 min-h-[40px]">
                        {loc.desc}
                     </p>
                     
                     <button
                        onClick={(e) => {
                            e.stopPropagation();
                            openGoogleMaps(loc);
                        }}
                        className={`mt-auto w-full py-3 rounded-xl flex items-center justify-center gap-2 text-xs font-bold transition-all duration-300 cursor-pointer ${
                            activeLocation.id === loc.id 
                            ? 'bg-white text-black hover:bg-zinc-200' 
                            : 'bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white'
                        }`}
                     >
                        <MapPin className="w-3.5 h-3.5" />
                        <span>OPEN GMAPS</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                     </button>
                  </div>
               </motion.div>
            ))}
         </div>
      </div>
    </section>
  );
}