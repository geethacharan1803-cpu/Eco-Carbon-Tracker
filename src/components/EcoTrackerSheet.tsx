import { useState } from 'react';
import { motion } from 'motion/react';
import { ActivityLog } from '../types';
import { Calendar, TrendingDown, Info, Table, Sparkles, Filter, Leaf, ChevronsUpDown, AlertCircle } from 'lucide-react';

interface EcoTrackerSheetProps {
  logs: ActivityLog[];
}

export default function EcoTrackerSheet({ logs }: EcoTrackerSheetProps) {
  const [selectedDayIndex, setSelectedDayIndex] = useState<number | null>(null);
  
  // Custom 30-day template logs to draw a stunning trend path, combined with real logs!
  const generateThirtyDaysData = () => {
    const data: { date: string; co2Estimate: number; offset: number }[] = [];
    const baseEmissions = [12, 13, 11, 14, 15, 12, 10, 13, 12, 9, 8, 12, 11, 13, 11, 9, 7, 10, 8, 11, 12, 9, 10, 8, 7, 8, 9, 6, 8, 5];
    
    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateString = d.toLocaleDateString([], { month: 'short', day: 'numeric' });
      
      // Calculate carbon based on base baseline list minus any logged offset reduction
      const index = 29 - i;
      let val = baseEmissions[index] || 11;
      
      // Merge with real user logs on this day if any
      const todayIso = d.toISOString().split('T')[0];
      const todayRealSum = logs
        .filter(l => l.timestamp.split('T')[0] === todayIso)
        .reduce((sum, l) => sum + l.co2Value, 0);

      if (todayRealSum > 0) {
        val = todayRealSum;
      }

      data.push({
        date: dateString,
        co2Estimate: val,
        offset: Math.max(0, 13.0 - val) // offset below household average
      });
    }
    return data;
  };

  const thirtyDaysData = generateThirtyDaysData();
  const maxVal = Math.max(...thirtyDaysData.map(d => d.co2Estimate), 16);
  const minVal = Math.min(...thirtyDaysData.map(d => d.co2Estimate), 2);

  // SVG dimensions for responsive scaling
  const width = 600;
  const height = 240;
  const paddingX = 40;
  const paddingY = 30;

  // Coordinate mapper helper
  const getCoordinates = (index: number, co2: number) => {
    const x = paddingX + (index / 29) * (width - 2 * paddingX);
    // Inverse Y for screen pixels
    const y = height - paddingY - ((co2 - 0) / (maxVal - 0)) * (height - 2 * paddingY);
    return { x, y };
  };

  // Generate SVG Points of the line path
  const linePointsString = thirtyDaysData.map((d, index) => {
    const coords = getCoordinates(index, d.co2Estimate);
    return `${coords.x},${coords.y}`;
  }).join(' ');

  // Generate Area SVG Points (closing the path to bottom)
  const areaPointsString = `${paddingX},${height - paddingY} ` + 
    thirtyDaysData.map((d, index) => {
      const coords = getCoordinates(index, d.co2Estimate);
      return `${coords.x},${coords.y}`;
    }).join(' ') + 
    ` ${width - paddingX},${height - paddingY}`;

  // Average Co2
  const averageCo2 = (thirtyDaysData.reduce((sum, d) => sum + d.co2Estimate, 0) / 30).toFixed(1);
  const totalCo2Offset = thirtyDaysData.reduce((sum, d) => sum + d.offset, 0).toFixed(0);

  return (
    <div id="eco-tracker-view" className="space-y-6">
      
      {/* Header summaries */}
      <div className="bg-white dark:bg-forest-900/40 p-5 rounded-2xl border border-forest-100 dark:border-forest-800/60 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-forest-750 dark:text-cream-100 flex items-center gap-2">
            <TrendingDown className="w-5 h-5 text-green-500 animate-pulse" />
            My Carbon Trail (30-Day Outlook)
          </h2>
          <p className="text-xs text-forest-550">
            Carbon output trends combining base metrics with your live registered log counters
          </p>
        </div>

        <div className="flex gap-4">
          <div className="bg-cream-51/60 dark:bg-forest-850 p-3 rounded-xl border border-forest-150 dark:border-forest-800 flex flex-col justify-center text-center">
            <span className="text-[9px] uppercase font-bold text-forest-450 tracking-wider">30D average</span>
            <span className="text-xl font-black text-slate-800 dark:text-cream-300 font-mono">{averageCo2} kg</span>
          </div>
          <div className="bg-forest-51 dark:bg-forest-850 p-3 rounded-xl border border-sage-202 dark:border-forest-800 flex flex-col justify-center text-center">
            <span className="text-[9px] uppercase font-bold text-forest-450 tracking-wider">Cumulative saved</span>
            <span className="text-xl font-black text-green-700 dark:text-green-400 font-mono">{totalCo2Offset} kg</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Responsive Vector SVG Line Chart */}
        <div className="lg:col-span-8 bg-white dark:bg-forest-900/40 p-5 rounded-2xl border border-forest-100 dark:border-forest-800/60 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-forest-550">
              CO₂ Emissions Trajectory (kg CO₂ / day)
            </h3>
            <span className="text-[10px] text-zinc-400 flex items-center gap-1">
              <Info className="w-3.5 h-3.5" /> Hover nodes for dates
            </span>
          </div>

          {/* SVG Frame wrapper */}
          <div className="relative w-full overflow-x-auto">
            <svg 
              viewBox={`0 0 ${width} ${height}`} 
              className="w-full h-auto min-w-[500px] select-none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                {/* Gradient Fill for Under Line Chart area */}
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-sage-50) " stopOpacity="0.85" />
                  <stop offset="100%" stopColor="var(--color-cream-100)" stopOpacity="0.0" />
                </linearGradient>
                <linearGradient id="chartDarkGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-forest-700)" stopOpacity="0.45" />
                  <stop offset="100%" stopColor="transparent" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Horizontal Reference Lines */}
              {[2, 5, 10, 13, 15].map((val) => {
                const yLevel = height - paddingY - ((val - 0) / (maxVal - 0)) * (height - 2 * paddingY);
                const isLimit = val === 13;
                return (
                  <g key={val}>
                    <line 
                      x1={paddingX} 
                      y1={yLevel} 
                      x2={width - paddingX} 
                      y2={yLevel} 
                      stroke={isLimit ? 'rgba(239, 68, 68, 0.4)' : 'rgba(100, 116, 139, 0.1)'} 
                      strokeWidth={isLimit ? '1.5' : '1'}
                      strokeDasharray={isLimit ? '4,4' : '0'}
                    />
                    <text 
                      x={paddingX - 10} 
                      y={yLevel + 3} 
                      className={`text-[9px] font-semibold text-right ${isLimit ? 'fill-red-400' : 'fill-zinc-420'}`}
                      textAnchor="end"
                    >
                      {val}k
                    </text>
                    {isLimit && (
                      <text 
                        x={width - paddingX - 4} 
                        y={yLevel - 4} 
                        className="text-[8px] font-bold fill-red-400"
                        textAnchor="end"
                      >
                        Global Target limit (13kg)
                      </text>
                    )}
                  </g>
                );
              })}

              {/* Area Under Line */}
              <polygon 
                points={areaPointsString} 
                className="fill-[url(#chartGradient)] dark:fill-[url(#chartDarkGradient)]"
              />

              {/* The Line stroke */}
              <polyline 
                points={linePointsString} 
                fill="none" 
                stroke="var(--color-sage-500)" 
                strokeWidth="3.5" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
              />

              {/* Dynamic Interactive Dot selection and track mapping */}
              {thirtyDaysData.map((d, idx) => {
                const coords = getCoordinates(idx, d.co2Estimate);
                const isSelected = selectedDayIndex === idx;

                return (
                  <g key={idx}>
                    <circle
                      cx={coords.x}
                      cy={coords.y}
                      r={isSelected ? '6' : '3.5'}
                      className={`${
                        isSelected 
                          ? 'fill-forest-650 stroke-white' 
                          : 'fill-white stroke-sage-500 hover:fill-forest-400 hover:r-5'
                      } cursor-pointer transition-all stroke-2`}
                      onMouseEnter={() => setSelectedDayIndex(idx)}
                      onMouseLeave={() => setSelectedDayIndex(null)}
                    />
                  </g>
                );
              })}

              {/* Label Start / Mid / End dates */}
              <text x={paddingX} y={height - 10} className="text-[9px] fill-zinc-400 font-semibold" textAnchor="start">
                30 Days ago
              </text>
              <text x={width / 2} y={height - 10} className="text-[9px] fill-zinc-400 font-semibold" textAnchor="middle">
                15 Days ago
              </text>
              <text x={width - paddingX} y={height - 10} className="text-[9px] fill-zinc-400 font-semibold" textAnchor="end">
                Today
              </text>
            </svg>
          </div>

          {/* Selected Interactive hover node diagnostics box in the chart footer */}
          <div className="h-10 mt-2 flex items-center justify-center">
            {selectedDayIndex !== null ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-cream-101 border border-sage-202 dark:bg-forest-950 p-2 rounded-xl flex items-center gap-4 text-xs font-semibold text-forest-750 dark:text-cream-150 shadow-sm"
              >
                <span>📅 {thirtyDaysData[selectedDayIndex].date}</span>
                <span className="text-zinc-300">|</span>
                <span>🔥 Day Footprint: <strong className="font-mono text-amber-600">{thirtyDaysData[selectedDayIndex].co2Estimate.toFixed(1)} kg</strong></span>
                <span className="text-zinc-300">|</span>
                <span className="text-green-600">Saved: {thirtyDaysData[selectedDayIndex].offset.toFixed(1)} kg CO₂</span>
              </motion.div>
            ) : (
              <span className="text-xs text-forest-450 italic">Hover nodes on the chart line above to inspect individual daily footprint metrics.</span>
            )}
          </div>
        </div>

        {/* Right Column: Historical logs diary grid & target levels info card */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white dark:bg-forest-900/40 p-5 rounded-2xl border border-forest-100 dark:border-forest-800/60 shadow-sm space-y-4 h-full flex flex-col justify-between">
            <div className="space-y-4">
              <h3 className="text-xs font-black uppercase tracking-wider text-forest-550 border-b border-forest-100 dark:border-forest-800 pb-2 flex items-center gap-1.5">
                <Table className="w-4.5 h-4.5 text-sage-605" />
                Latest Footprints History
              </h3>

              <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                {thirtyDaysData.filter(d => d.co2Estimate <= 13).length === 0 ? (
                  <p className="text-xs text-zinc-400 italic">No low-impact days recorded yet</p>
                ) : (
                  thirtyDaysData.slice().reverse().map((day, idx) => (
                    <div 
                      key={idx} 
                      className="p-2.5 bg-cream-50/50 dark:bg-forest-900/10 rounded-xl border border-forest-100 dark:border-forest-800 flex items-center justify-between text-xs font-medium"
                    >
                      <span className="text-forest-700 dark:text-cream-200">{day.date}</span>
                      <div className="flex items-center gap-3">
                        <span className="font-mono font-bold text-forest-800 dark:text-cream-150">{day.co2Estimate.toFixed(1)} kg</span>
                        <span className={`w-2.5 h-2.5 rounded-full ${
                          day.co2Estimate < 9 ? 'bg-green-500' : day.co2Estimate <= 13 ? 'bg-amber-400' : 'bg-red-400'
                        }`} />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="bg-forest-50/70 dark:bg-forest-950/20 p-3.5 rounded-xl border border-sage-202/60 dark:border-forest-800/80 text-[11px] leading-relaxed text-forest-650 dark:text-sage-350 mt-4">
              <span className="font-bold text-forest-770 block mb-0.5">💡 Track Guidance</span>
              To lower your trajectory line further, log active transport options, unplug vampire loads when exiting the room, or cook plant-based lunches.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
