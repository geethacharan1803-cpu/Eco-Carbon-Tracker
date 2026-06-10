import { useState } from 'react';
import { HubLocation } from '../types';
import { MapPin, Bus, Trash2, ShoppingBag, Leaf, Search, Clock, Award, Compass, Info } from 'lucide-react';
import { motion } from 'motion/react';

interface LocalHubProps {
  locations: HubLocation[];
}

export default function LocalHub({ locations: initialLocations }: LocalHubProps) {
  const [selectedId, setSelectedId] = useState<string>(initialLocations[0]?.id || '');
  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const selectedLoc = initialLocations.find(l => l.id === selectedId);

  // Apply filters
  const filteredLocs = initialLocations.filter(loc => {
    const matchesFilter = filterType === 'all' || loc.type === filterType;
    const matchesSearch = loc.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          loc.address.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div id="local-hub-view" className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      
      {/* Search and List Side panel */}
      <div className="lg:col-span-4 space-y-4">
        <div className="bg-white dark:bg-forest-900/40 p-5 rounded-2xl border border-forest-100 dark:border-forest-800/60 shadow-sm flex flex-col justify-between h-full min-h-[440px]">
          <div className="space-y-4">
            <div>
              <h3 className="text-base font-bold text-forest-750 dark:text-cream-100 flex items-center gap-2">
                <Compass className="w-5 h-5 text-sage-600" />
                Active Local Eco-Hub
              </h3>
              <p className="text-xs text-forest-550">
                Find public transport, certified recycling yards, and organic co-ops near you
              </p>
            </div>

            {/* Simple Search bar */}
            <div className="relative">
              <input
                id="hub-search"
                type="text"
                placeholder="Search hub network..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-cream-50 dark:bg-forest-900/40 border border-forest-200 dark:border-forest-850 text-forest-700 dark:text-cream-100 rounded-xl pl-9 pr-3 py-2 text-xs focus:ring-1 focus:ring-sage-500 focus:outline-none"
              />
              <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-forest-400" />
            </div>

            {/* Quick Map filter types tabs */}
            <div className="flex gap-1.5 flex-wrap">
              {[
                { id: 'all', label: 'All' },
                { id: 'recycling', label: 'Recycle' },
                { id: 'transport', label: 'Transit' },
                { id: 'eco_shop', label: 'Shops' },
                { id: 'garden', label: 'Gardens' }
              ].map(tab => (
                <button
                  key={tab.id}
                  id={`hub-filter-${tab.id}`}
                  onClick={() => setFilterType(tab.id)}
                  className={`px-2.5 py-1 rounded-full text-[10px] font-bold border transition-colors cursor-pointer ${
                    filterType === tab.id
                      ? 'bg-sage-600 border-sage-600 text-white'
                      : 'bg-cream-100 dark:bg-forest-800 text-forest-650 dark:text-cream-200 border-forest-150 dark:border-forest-750 hover:bg-cream-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Filtered locations list scroll */}
            <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
              {filteredLocs.length === 0 ? (
                <p className="text-xs text-center text-forest-400 py-6">No matching hubs found.</p>
              ) : (
                filteredLocs.map(loc => {
                  const Icon = loc.type === 'recycling' 
                    ? Trash2 : loc.type === 'transport' 
                    ? Bus : loc.type === 'eco_shop' 
                    ? ShoppingBag : Leaf;
                  return (
                    <button
                      key={loc.id}
                      id={`hub-item-${loc.id}`}
                      onClick={() => setSelectedId(loc.id)}
                      className={`w-full p-3 rounded-xl border text-left flex items-start gap-3 transition-colors ${
                        selectedId === loc.id
                          ? 'bg-sage-50 dark:bg-forest-800/50 border-sage-400 dark:border-sage-700'
                          : 'bg-cream-50/20 dark:bg-forest-900/10 border-forest-100 dark:border-forest-800/80 hover:bg-cream-50'
                      }`}
                    >
                      <div className={`p-1.5 rounded-lg border text-xs shrink-0 ${
                        selectedId === loc.id ? 'bg-sage-600 border-sage-600 text-white' : 'bg-white dark:bg-forest-800 text-forest-550 border-forest-150 dark:border-forest-750'
                      }`}>
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <div className="space-y-0.5 min-w-0">
                        <span className="text-xs font-bold text-forest-750 dark:text-cream-150 block truncate">
                          {loc.name}
                        </span>
                        <span className="text-[10px] text-forest-400 block truncate">
                          {loc.address}
                        </span>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-forest-100 dark:border-forest-800 text-[10px] text-forest-400 flex items-center gap-1.5 mt-4">
            <Info className="w-4 h-4 text-sage-500 shrink-0" />
            <span>Locations are mock plotted for your localized grid.</span>
          </div>
        </div>
      </div>

      {/* Right column: Interactive Map Canvas (natural tones SVG) & Details drawer card */}
      <div className="lg:col-span-8 flex flex-col gap-4">
        {/* The Map */}
        <div className="bg-cream-100 dark:bg-forest-950 p-4 rounded-2xl border border-forest-150 dark:border-forest-900 shadow-inner relative overflow-hidden h-[300px] flex items-center justify-center">
          
          {/* Custom vector SVG represent physical map components */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
                <path d="M 30 0 L 0 0 0 30" fill="none" stroke="currentColor" className="text-forest-200/20 dark:text-forest-800/20" strokeWidth="1" />
              </pattern>
            </defs>
            {/* Grid background */}
            <rect width="100%" height="100%" fill="url(#grid)" />

            {/* Water Canal River styling */}
            <path d="M-10 180 C 100 120, 200 240, 400 160 C 550 100, 700 280, 900 210" fill="none" stroke="currentColor" className="text-[#a8dadc]/60 dark:text-[#1d3557]/40" strokeWidth="24" strokeLinecap="round" />
            <path d="M-10 180 C 100 120, 200 240, 400 160 C 550 100, 700 280, 900 210" fill="none" stroke="currentColor" className="text-[#e2f0f1]/70 dark:text-[#2a5b78]/30" strokeWidth="10" strokeLinecap="round" />

            {/* Public park green area */}
            <rect x="50" y="30" width="130" height="90" rx="20" fill="currentColor" className="text-[#d8f3dc]/70 dark:text-[#2d6a4f]/20" />
            <text x="75" y="80" className="text-[10px] font-bold text-forest-400 dark:text-sage-350 select-none">Eco Sanctuary</text>

            {/* Forest patch */}
            <rect x="580" y="160" width="170" height="90" rx="30" fill="currentColor" className="text-[#d8f3dc]/60 dark:text-[#2d6a4f]/15" />
            <text x="615" y="210" className="text-[10px] font-bold text-forest-400 dark:text-sage-350 select-none">Community Green</text>

            {/* Cartographic Road lines */}
            <line x1="0" y1="110" x2="900" y2="110" stroke="currentColor" className="text-forest-200/50 dark:text-forest-800/40" strokeWidth="14" />
            <line x1="0" y1="110" x2="900" y2="110" stroke="currentColor" className="text-white dark:text-forest-900/50" strokeWidth="4" strokeDasharray="6,4" />

            <line x1="260" y1="0" x2="260" y2="400" stroke="currentColor" className="text-forest-200/50 dark:text-forest-800/40" strokeWidth="12" />
            <line x1="260" y1="0" x2="260" y2="400" stroke="currentColor" className="text-white dark:text-forest-900/50" strokeWidth="3" strokeDasharray="8,6" />

            <line x1="520" y1="0" x2="520" y2="400" stroke="currentColor" className="text-forest-200/50 dark:text-forest-800/40" strokeWidth="10" />
          </svg>

          {/* Compass rose decoration */}
          <div className="absolute right-4 top-4 rounded-full bg-white/85 dark:bg-forest-900/80 p-2 border border-forest-150 dark:border-forest-850 pointer-events-none">
            <Compass className="w-5 h-5 text-forest-550 animate-pulse" />
          </div>

          {/* Plotting points */}
          {filteredLocs.map((loc) => {
            const isSelected = loc.id === selectedId;
            const Icon = loc.type === 'recycling' 
              ? Trash2 : loc.type === 'transport' 
              ? Bus : loc.type === 'eco_shop' 
              ? ShoppingBag : Leaf;
            return (
              <motion.button
                key={loc.id}
                id={`map-pin-${loc.id}`}
                onClick={() => setSelectedId(loc.id)}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 focus:outline-none z-10 cursor-pointer"
                style={{ left: `${loc.coordinates.x}%`, top: `${loc.coordinates.y}%` }}
                whileHover={{ scale: 1.2 }}
                animate={{ scale: isSelected ? 1.25 : 1 }}
              >
                {/* Visual PIN */}
                <div className="flex flex-col items-center">
                  <div className={`p-2 rounded-full border-2 shadow-md relative ${
                    isSelected 
                      ? 'bg-forest-600 text-white border-white scale-110 z-20' 
                      : 'bg-white dark:bg-forest-850 text-sage-600 dark:text-sage-200 border-sage-400 dark:border-forest-750'
                  }`}>
                    <Icon className="w-4 h-4" />
                    {isSelected && (
                      <span className="absolute -top-1 -right-1 flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-200"></span>
                      </span>
                    )}
                  </div>
                  {/* Pin label */}
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md mt-1 border shadow-xs max-w-[100px] truncate ${
                    isSelected 
                      ? 'bg-forest-800 dark:bg-forest-900 text-white border-forest-800' 
                      : 'bg-white/90 dark:bg-forest-900/90 text-forest-650 dark:text-cream-250 border-forest-150 dark:border-forest-850'
                  }`}>
                    {loc.name}
                  </span>
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Selected Hub info display block */}
        {selectedLoc && (
          <div id="hub-details-card" className="bg-white dark:bg-forest-900/40 p-5 rounded-2xl border border-forest-100 dark:border-forest-800/60 shadow-sm flex flex-col sm:flex-row justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <MapPin className="w-4.5 h-4.5 text-sage-650" />
                <h4 className="text-sm font-extrabold text-forest-800 dark:text-cream-100">
                  {selectedLoc.name}
                </h4>
              </div>
              
              <p className="text-xs text-forest-650 dark:text-sage-350 leading-relaxed font-medium">
                {selectedLoc.details}
              </p>

              <div className="flex gap-4 pt-1 flex-wrap text-[10.5px] text-forest-500 font-medium">
                <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {selectedLoc.hours}</span>
                <span className="text-forest-300">|</span>
                <span className="font-mono">Address: {selectedLoc.address}</span>
              </div>
            </div>

            {/* Offset potential widget */}
            <div className="bg-forest-50 dark:bg-forest-900 border border-forest-100 dark:border-forest-800 p-4 rounded-xl flex flex-col justify-center text-center shrink-0 min-w-[140px]">
              <span className="text-[9px] uppercase tracking-wider font-extrabold text-forest-500">
                Eco Potential
              </span>
              <span className="text-xl font-black text-forest-700 dark:text-cream-100 block mt-1">
                ↓ {selectedLoc.savingsPotential} kg CO₂/mo
              </span>
              <span className="text-[9px] text-sage-650 mt-1 flex items-center justify-center gap-1 font-semibold">
                <Award className="w-3.5 h-3.5" /> High Impact
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
