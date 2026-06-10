import { useState } from 'react';
import { motion } from 'motion/react';
import { ShieldAlert, Leaf, Trophy, Flame, TreeDeciduous, Smartphone, Car, RefreshCw, BarChart3 } from 'lucide-react';

interface StatsGridProps {
  totalCo2Saved: number; // in kg CO2
  totalCo2Logged: number; // in kg CO2
  points: number;
  streak: number;
}

export default function StatsGrid({ totalCo2Saved, totalCo2Logged, points, streak }: StatsGridProps) {
  const [equivalentImpact, setEquivalentImpact] = useState<boolean>(false);

  // Equivalencies (Ratios per kg of CO2 saved)
  const treesPlanted = (totalCo2Saved / 22).toFixed(1); // 1 tree of 1 year equivalent
  const smartphoneCharges = Math.round(totalCo2Saved / 0.008).toLocaleString();
  const carMilesAvoided = (totalCo2Saved / 0.4).toFixed(1);
  const plasticBottlesSaved = Math.round(totalCo2Saved / 0.1).toLocaleString();

  // Projected Monthly Impact
  // Average standard person produces about 400kg of CO2 per month (13kg/day).
  // If the user logs average daily CO2 which is lower, they saved the difference.
  // We can calculate projected monthly savings:
  const monthlySavingsProjection = (totalCo2Saved > 0)
    ? Math.min(350, Math.round(totalCo2Saved * 12)) // Simulated 30-day projection based on active savings
    : 45; // default prediction

  const projectedTotalEmissions = Math.max(120, Math.round(totalCo2Logged * 8));

  return (
    <div id="stats-grid-container" className="space-y-6">
      {/* Upper header with Toggle */}
      <div id="stats-header" className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-white dark:bg-forest-900/40 p-4 rounded-2xl border border-forest-100 dark:border-forest-800/60 shadow-sm">
        <div>
          <h2 id="stats-overview-title" className="text-xl font-bold text-forest-700 dark:text-cream-100 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-sage-500" />
            Performance Dashboard
          </h2>
          <p id="stats-overview-desc" className="text-xs text-forest-600/70 dark:text-sage-200/60 mt-0.5">
            Real-time calculations of your positive environmental footprint
          </p>
        </div>
        <button
          id="equivalent-impact-toggle"
          onClick={() => setEquivalentImpact(!equivalentImpact)}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${
            equivalentImpact
              ? 'bg-sage-600 border-sage-600 text-white shadow-sm'
              : 'bg-cream-100 dark:bg-forest-800 text-forest-700 dark:text-cream-200 border-forest-200 dark:border-forest-700 hover:bg-cream-200'
          }`}
        >
          <RefreshCw className={`w-4 h-4 ${equivalentImpact ? 'animate-spin' : ''}`} />
          {equivalentImpact ? 'Show Pure Metric (CO₂)' : 'Show Tangible Visuals'}
        </button>
      </div>

      {/* Main Grid */}
      <div id="stats-cards-grid" className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Total CO2 Saved card */}
        <motion.div
          id="stat-card-co2"
          whileHover={{ y: -4 }}
          className="bg-forest-50/50 dark:bg-forest-900/30 p-5 rounded-2xl border border-forest-100 dark:border-forest-800/80 hover:shadow-md"
        >
          <div className="flex justify-between items-start">
            <span className="text-sm font-medium text-forest-700 dark:text-sage-200">
              {equivalentImpact ? 'Natural Mitigation' : 'Net CO₂ Mitigated'}
            </span>
            <div className="p-2 bg-sage-100 dark:bg-forest-800 rounded-xl text-sage-600 dark:text-sage-100">
              <Leaf className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            {equivalentImpact ? (
              <div className="space-y-1">
                <span className="text-2xl font-bold text-forest-700 dark:text-cream-100 flex items-baseline gap-1">
                  {treesPlanted} <span className="text-xs font-normal text-forest-600/70 dark:text-sage-200/50">Trees</span>
                </span>
                <span className="text-xs text-forest-600/70 dark:text-sage-200/60 block leading-tight">
                  Annual filter load equivalent of mature trees.
                </span>
              </div>
            ) : (
              <div className="space-y-1">
                <span className="text-3xl font-bold text-forest-700 dark:text-cream-100">
                  {totalCo2Saved.toFixed(1)} <span id="co2-saved-unit" className="text-lg font-normal">kg</span>
                </span>
                <span className="text-xs text-green-600 dark:text-green-400 font-medium block">
                  ↓ Savings on global target
                </span>
              </div>
            )}
          </div>
        </motion.div>

        {/* Gamification Points card */}
        <motion.div
          id="stat-card-points"
          whileHover={{ y: -4 }}
          className="bg-forest-50/50 dark:bg-forest-900/30 p-5 rounded-2xl border border-forest-100 dark:border-forest-800/80 hover:shadow-md"
        >
          <div className="flex justify-between items-start">
            <span className="text-sm font-medium text-forest-700 dark:text-sage-200">
              {equivalentImpact ? 'Charge Equivalent' : 'Eco Points'}
            </span>
            <div className="p-2 bg-earth-100 dark:bg-forest-800 rounded-xl text-earth-650 dark:text-earth-200">
              {equivalentImpact ? <Smartphone className="w-5 h-5" /> : <Trophy className="w-5 h-5" />}
            </div>
          </div>
          <div className="mt-4">
            {equivalentImpact ? (
              <div className="space-y-1">
                <span className="text-2xl font-bold text-forest-700 dark:text-cream-100 flex items-baseline gap-1">
                  {smartphoneCharges} <span className="text-xs font-normal text-forest-600/70 dark:text-sage-200/50">Charges</span>
                </span>
                <span className="text-xs text-forest-600/70 dark:text-sage-200/60 block leading-tight">
                  Power matches fully charging mobile devices.
                </span>
              </div>
            ) : (
              <div className="space-y-1">
                <span className="text-3xl font-bold text-forest-700 dark:text-cream-100">
                  {points} <span id="points-unit" className="text-lg font-normal">pts</span>
                </span>
                <span className="text-xs text-earth-600 dark:text-earth-400 font-medium block">
                  Lv. {Math.floor(points / 200) + 1} Sustainability Cadet
                </span>
              </div>
            )}
          </div>
        </motion.div>

        {/* Daily Streak card */}
        <motion.div
          id="stat-card-streak"
          whileHover={{ y: -4 }}
          className="bg-forest-50/50 dark:bg-forest-900/30 p-5 rounded-2xl border border-forest-100 dark:border-forest-800/80 hover:shadow-md"
        >
          <div className="flex justify-between items-start">
            <span className="text-sm font-medium text-forest-700 dark:text-sage-200">
              {equivalentImpact ? 'Drive Avoidance' : 'Daily Streak'}
            </span>
            <div className="p-2 bg-orange-100 dark:bg-forest-800 rounded-xl text-orange-600 dark:text-orange-450">
              {equivalentImpact ? <Car className="w-5 h-5" /> : <Flame className="w-5 h-5" />}
            </div>
          </div>
          <div className="mt-4">
            {equivalentImpact ? (
              <div className="space-y-1">
                <span className="text-2xl font-bold text-forest-700 dark:text-cream-100 flex items-baseline gap-1">
                  {carMilesAvoided} <span className="text-xs font-normal text-forest-600/70 dark:text-sage-200/50">Miles</span>
                </span>
                <span className="text-xs text-forest-600/70 dark:text-sage-200/60 block leading-tight">
                  Displacement equivalent to medium petrol hatchback.
                </span>
              </div>
            ) : (
              <div className="space-y-1">
                <span className="text-3xl font-bold text-forest-700 dark:text-cream-100">
                  {streak} <span className="text-lg font-normal">Day{streak !== 1 ? 's' : ''}</span>
                </span>
                <span className="text-xs text-orange-600 dark:text-orange-400 font-medium block">
                  {streak >= 3 ? '🔥 You are on fire!' : 'Keep logging daily!'}
                </span>
              </div>
            )}
          </div>
        </motion.div>

        {/* Projected Monthly Impact card */}
        <motion.div
          id="stat-card-projected"
          whileHover={{ y: -4 }}
          className="bg-forest-50/50 dark:bg-forest-900/30 p-5 rounded-2xl border border-forest-100 dark:border-forest-800/80 hover:shadow-md"
        >
          <div className="flex justify-between items-start">
            <span className="text-sm font-medium text-forest-700 dark:text-sage-200">
              {equivalentImpact ? 'Bottle Equivalent' : 'Projected Savings'}
            </span>
            <div className="p-2 bg-blue-100 dark:bg-forest-800 rounded-xl text-blue-600 dark:text-blue-200">
              {equivalentImpact ? <TreeDeciduous className="w-5 h-5" /> : <ShieldAlert className="w-5 h-5" />}
            </div>
          </div>
          <div className="mt-4">
            {equivalentImpact ? (
              <div className="space-y-1">
                <span className="text-2xl font-bold text-forest-700 dark:text-cream-100 flex items-baseline gap-1">
                  {plasticBottlesSaved} <span className="text-xs font-normal text-forest-600/70 dark:text-sage-200/50">PET</span>
                </span>
                <span className="text-xs text-forest-600/70 dark:text-sage-200/60 block leading-tight">
                  Manufactured plastic extraction weight equivalent.
                </span>
              </div>
            ) : (
              <div className="space-y-1">
                <span className="text-3xl font-bold text-forest-700 dark:text-cream-100">
                  {monthlySavingsProjection} <span className="text-lg font-normal">kg</span>
                </span>
                <span className="text-xs text-blue-600 dark:text-blue-400 font-medium block">
                  ~{(monthlySavingsProjection * 12).toFixed(0)} kg CO₂ per year projected
                </span>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
