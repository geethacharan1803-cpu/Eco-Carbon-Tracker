import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Pledge } from '../types';
import { 
  Leaf, 
  Users, 
  Calendar, 
  CheckCircle2, 
  Award, 
  HeartHandshake, 
  Sparkles,
  Zap,
  Utensils,
  Trash2,
  Bike,
  Layers,
  Activity,
  ArrowUpDown,
  TrendingUp
} from 'lucide-react';

interface PledgeDashboardProps {
  pledges: Pledge[];
  onToggleEnroll: (id: string) => void;
  onCompletePledge: (id: string) => void;
  points: number;
}

const categoryConfig: Record<string, {
  label: string;
  badgeClass: string;
  icon: any;
}> = {
  'Energy': {
    label: 'Energy Savings',
    badgeClass: 'bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-900',
    icon: Zap
  },
  'Diet': {
    label: 'Dietary Co-op',
    badgeClass: 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900',
    icon: Utensils
  },
  'Waste': {
    label: 'Waste Loop',
    badgeClass: 'bg-indigo-50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-900',
    icon: Trash2
  },
  'Transport': {
    label: 'Green Mobility',
    badgeClass: 'bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-900',
    icon: Bike
  },
  'Other': {
    label: 'Sustain Goal',
    badgeClass: 'bg-sage-50 dark:bg-forest-900/30 text-sage-700 dark:text-sage-300 border-sage-200 dark:border-forest-800',
    icon: Leaf
  }
};

export default function PledgeDashboard({ pledges, onToggleEnroll, onCompletePledge, points }: PledgeDashboardProps) {
  const [completeCelebration, setCompleteCelebration] = useState<{ active: boolean; pledgeTitle: string } | null>(null);
  const [viewMode, setViewMode] = useState<'grouped' | 'filtered'>('grouped');
  const [selectedFilter, setSelectedFilter] = useState<string>('All');
  const [sortByImpact, setSortByImpact] = useState<boolean>(false);

  const handleComplete = (id: string, title: string) => {
    onCompletePledge(id);
    setCompleteCelebration({ active: true, pledgeTitle: title });
    setTimeout(() => {
      setCompleteCelebration(null);
    }, 4000);
  };

  // Ensure every pledge fits into a valid category
  const normalizedPledges = pledges.map(p => {
    let cat = p.category;
    if (!cat) {
      const lowerTitle = p.title.toLowerCase();
      const lowerDesc = p.description.toLowerCase();
      if (lowerTitle.includes('led') || lowerTitle.includes('energy') || lowerTitle.includes('bulb') || lowerTitle.includes('thermostat') || lowerDesc.includes('hvac')) {
        cat = 'Energy';
      } else if (lowerTitle.includes('meat') || lowerTitle.includes('vegan') || lowerTitle.includes('diet') || lowerTitle.includes('beef') || lowerTitle.includes('meals')) {
        cat = 'Diet';
      } else if (lowerTitle.includes('plastic') || lowerTitle.includes('compost') || lowerTitle.includes('waste') || lowerTitle.includes('recycle') || lowerDesc.includes('bottle')) {
        cat = 'Waste';
      } else if (lowerTitle.includes('commute') || lowerTitle.includes('bike') || lowerTitle.includes('walk') || lowerTitle.includes('transit')) {
        cat = 'Transport';
      } else {
        cat = 'Other';
      }
    }
    return { ...p, category: cat };
  });

  const categories = ['Energy', 'Diet', 'Waste', 'Transport'];

  // Calculate the total potential CO2 impact of all pledges in a category to assist with prioritization
  const getCategoryTotalImpact = (categoryName: string) => {
    return normalizedPledges
      .filter(p => p.category === categoryName)
      .reduce((sum, p) => sum + p.co2Reduction, 0);
  };

  const processedCategories = sortByImpact
    ? [...categories].sort((a, b) => getCategoryTotalImpact(b) - getCategoryTotalImpact(a))
    : categories;

  // Individual Card component renderer helper
  const renderPledgeCard = (pledge: typeof normalizedPledges[number]) => {
    const cardConfig = categoryConfig[pledge.category] || categoryConfig['Other'];
    const CatSmallIcon = cardConfig.icon;
    const daysPercent = Math.min(100, Math.round((pledge.daysPassed / pledge.durationDays) * 100));
    const communityCount = (pledge.co2Reduction * 243).toLocaleString();
    const communityPercent = Math.min(85, Math.max(30, (pledge.co2Reduction * 11) % 100));

    return (
      <motion.div
        key={pledge.id}
        id={`pledge-${pledge.id}`}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -4, transition: { duration: 0.2 } }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className={`p-5 rounded-2xl border flex flex-col justify-between hover:shadow-md transition-shadow duration-300 ${
          pledge.completed
            ? 'bg-forest-50/40 dark:bg-forest-950/20 border-sage-300 dark:border-sage-800'
            : pledge.enrolled
            ? 'bg-white dark:bg-forest-900/40 border-sage-400 dark:border-sage-700 ring-1 ring-sage-300/40'
            : 'bg-white dark:bg-forest-900/40 border-forest-100 dark:border-forest-800/60 shadow-sm'
        }`}
      >
        <div className="space-y-3">
          <div className="flex justify-between items-start gap-2">
            <div className="space-y-1.5 flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[9px] uppercase tracking-wider bg-cream-200 dark:bg-forest-800 text-forest-750 dark:text-cream-200 px-2 py-0.5 rounded-md font-bold border border-forest-200/50 dark:border-forest-700">
                  ~{pledge.co2Reduction} kg CO₂ / mo saved
                </span>
                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-md border flex items-center gap-1 shrink-0 ${cardConfig.badgeClass}`}>
                  <CatSmallIcon className="w-3 h-3" />
                  {pledge.category}
                </span>
              </div>
              <h3 className="text-sm font-bold text-forest-750 dark:text-cream-100 mt-1.5 leading-snug truncate">
                {pledge.title}
              </h3>
            </div>
            <div className={`p-2 rounded-xl border shrink-0 transition-colors ${
              pledge.completed 
                ? 'bg-sage-600 border-sage-650 text-white' 
                : 'bg-cream-100 dark:bg-forest-800 border-forest-200 dark:border-forest-750 text-forest-400'
            }`}>
              <CatSmallIcon className="w-4 h-4" />
            </div>
          </div>

          <p className="text-xs text-forest-650 dark:text-sage-300 line-clamp-2">
            {pledge.description}
          </p>

          {/* Enriched Visual Progress bars */}
          {pledge.enrolled && !pledge.completed && (
            <div className="space-y-3 pt-2">
              {/* Goal Completion Progress Bar */}
              <div className="space-y-1">
                <div className="flex justify-between items-center text-[10px] text-forest-500 font-medium">
                  <span className="flex items-center gap-1 font-semibold text-forest-650 dark:text-sage-300">
                    <Calendar className="w-3 h-3 text-sage-500" /> Habits Build Progression
                  </span>
                  <span className="text-[10px] font-bold text-forest-750 dark:text-cream-200 bg-sage-50 dark:bg-forest-900 px-1.5 py-0.5 rounded border border-sage-200/50 dark:border-forest-800">
                    {daysPercent}% ({pledge.daysPassed}/{pledge.durationDays} d)
                  </span>
                </div>
                <div className="h-2 bg-cream-200 dark:bg-forest-800 rounded-full overflow-hidden relative shadow-inner">
                  <motion.div
                    id={`pledge-${pledge.id}-progress-habit`}
                    className="h-full bg-gradient-to-r from-sage-400 to-sage-600 rounded-full relative animate-pulse-slow"
                    initial={{ width: 0 }}
                    animate={{ width: `${daysPercent}%` }}
                    transition={{ duration: 1.2, ease: 'easeOut' }}
                  >
                    {/* Shimmer sweep */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                      initial={{ x: '-100%' }}
                      animate={{ x: '100%' }}
                      transition={{ repeat: Infinity, duration: 2.2, ease: 'linear' }}
                    />
                  </motion.div>
                </div>
              </div>

              {/* Community Participation Progress Bar */}
              <div className="space-y-1">
                <div className="flex justify-between items-center text-[10px] text-forest-500 font-medium">
                  <span className="flex items-center gap-1 font-semibold text-forest-650 dark:text-sage-300">
                    <Users className="w-3 h-3 text-forest-500" /> Community Co-Pledgers
                  </span>
                  <span className="text-[10px] font-bold text-forest-750 dark:text-cream-200 bg-sage-50 dark:bg-forest-900 px-1.5 py-0.5 rounded border border-sage-200/50 dark:border-forest-800">
                    {communityPercent}% action target
                  </span>
                </div>
                <div className="h-2 bg-cream-200 dark:bg-forest-800 rounded-full overflow-hidden relative shadow-inner">
                  <motion.div
                    id={`pledge-${pledge.id}-progress-community`}
                    className="h-full bg-gradient-to-r from-forest-500 to-forest-700 dark:from-sage-500 dark:to-sage-400 rounded-full relative"
                    initial={{ width: 0 }}
                    animate={{ width: `${communityPercent}%` }}
                    transition={{ duration: 1.5, ease: 'easeOut' }}
                  >
                    {/* Shimmer sweep */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent"
                      initial={{ x: '-100%' }}
                      animate={{ x: '100%' }}
                      transition={{ repeat: Infinity, duration: 2.8, ease: 'linear' }}
                    />
                  </motion.div>
                </div>
                <div className="text-[9px] text-forest-550/80 dark:text-sage-350 font-mono text-right font-medium">
                  {communityCount} dynamic global savers
                </div>
              </div>
            </div>
          )}

          {pledge.completed && (
            <div className="py-2.5 flex items-center gap-2 text-xs font-bold text-green-600 dark:text-green-400 bg-green-50/50 dark:bg-forest-900/40 p-3 rounded-xl border border-green-200/50 dark:border-forest-800 animate-fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Completed and Saved {pledge.co2Reduction} kg CO₂!</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-4 pt-3 border-t border-forest-100 dark:border-forest-800/50 flex gap-2">
          {!pledge.completed ? (
            <>
              {!pledge.enrolled ? (
                <button
                  id={`enroll-btn-${pledge.id}`}
                  onClick={() => onToggleEnroll(pledge.id)}
                  className="flex-1 bg-forest-600 hover:bg-forest-700 text-white font-bold py-2 rounded-xl text-xs transition-colors cursor-pointer"
                >
                  Enroll in Pledge
                </button>
              ) : (
                <>
                  <button
                    id={`withdraw-btn-${pledge.id}`}
                    onClick={() => onToggleEnroll(pledge.id)}
                    className="px-3 bg-cream-100 hover:bg-cream-202 dark:bg-forest-800 dark:hover:bg-forest-750 text-forest-700 dark:text-cream-250 border border-forest-200 dark:border-forest-700 rounded-xl text-xs transition-colors cursor-pointer"
                    title="Leave Pledge"
                  >
                    Cancel
                  </button>
                  <button
                    id={`complete-btn-${pledge.id}`}
                    onClick={() => handleComplete(pledge.id, pledge.title)}
                    className="flex-1 bg-sage-600 hover:bg-sage-700 text-white font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-1 transition-colors cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Verify Completion
                  </button>
                </>
              )}
            </>
          ) : (
            <button
              id={`reinstate-btn-${pledge.id}`}
              onClick={() => onToggleEnroll(pledge.id)}
              className="flex-1 bg-cream-100 dark:bg-forest-800 hover:bg-cream-200 text-forest-700 dark:text-cream-100 font-semibold py-2 rounded-xl text-xs transition-colors cursor-pointer"
            >
              Commit Again
            </button>
          )}
        </div>
      </motion.div>
    );
  };

  return (
    <div id="pledge-dashboard-view" className="space-y-6 relative">
      {/* Celebration Splash Overlay using Framer Motion */}
      <AnimatePresence>
        {completeCelebration?.active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-forest-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.7, y: 50, rotate: -5 }}
              animate={{ 
                scale: [0.7, 1.1, 1], 
                y: [50, -10, 0],
                rotate: [-5, 5, 0],
                transition: { type: 'spring', damping: 15 }
              }}
              exit={{ scale: 0.5, opacity: 0 }}
              className="bg-white dark:bg-forest-950 p-8 rounded-3xl border-2 border-sage-500 max-w-md w-full text-center shadow-2xl relative overflow-hidden"
            >
              {/* Confetti Particles */}
              <div className="absolute inset-0 pointer-events-none opacity-40">
                {[...Array(12)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{ 
                      y: [100, -200], 
                      x: [0, (i % 2 === 0 ? 50 : -50) * Math.random()],
                      rotate: [0, 360 * Math.random()] 
                    }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'easeOut' }}
                    className={`absolute bottom-0 w-2.5 h-2.5 rounded-full ${
                      i % 3 === 0 ? 'bg-green-500' : i % 3 === 1 ? 'bg-amber-500' : 'bg-sage-400'
                    }`}
                    style={{ left: `${Math.random() * 100}%` }}
                  />
                ))}
              </div>

              <div className="mx-auto w-16 h-16 bg-sage-50 dark:bg-forest-900 rounded-full flex items-center justify-center text-sage-600 dark:text-sage-200 border-2 border-sage-400/30 mb-4 animate-bounce">
                <Award className="w-9 h-9" />
              </div>

              <h2 className="text-2xl font-black text-forest-800 dark:text-cream-100 mb-1">
                Pledge Fulfilled!
              </h2>
              <p className="text-xs text-sage-600 dark:text-sage-400 mb-4 uppercase tracking-widest font-extrabold flex items-center justify-center gap-1">
                <Sparkles className="w-4 h-4 text-amber-500 animate-spin" />
                +250 Eco Points Earned
                <Sparkles className="w-4 h-4 text-amber-500" />
              </p>

              <div className="bg-cream-100 dark:bg-forest-900/60 p-4 rounded-xl border border-forest-150 dark:border-forest-800 my-4">
                <p className="text-sm font-semibold text-forest-750 dark:text-cream-200">
                  "{completeCelebration.pledgeTitle}"
                </p>
                <p className="text-[11px] text-forest-600 dark:text-sage-350 mt-1">
                  You successfully verified completion of this environmental habit. This active commitment makes a deep impact.
                </p>
              </div>

              <button
                onClick={() => setCompleteCelebration(null)}
                className="bg-forest-600 hover:bg-forest-700 text-white font-bold text-xs px-6 py-2.5 rounded-xl transition-colors cursor-pointer"
              >
                Keep Making a Difference
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Info */}
      <div className="bg-white dark:bg-forest-900/40 p-5 rounded-2xl border border-forest-100 dark:border-forest-800/60 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-forest-700 dark:text-cream-100 flex items-center gap-2">
            <HeartHandshake className="w-5 h-5 text-orange-500" />
            My Pledges & Habit Builder
          </h2>
          <p className="text-xs text-forest-600/70 dark:text-sage-200/60">
            Form life-long green habits. Join commitments with our international ecosystem.
          </p>
        </div>
        <div className="bg-cream-100 dark:bg-forest-800 text-forest-700 dark:text-cream-100 px-4 py-2 rounded-xl text-xs font-semibold border border-forest-200 dark:border-forest-700">
          Enrolled Pledges: <strong className="text-forest-800 dark:text-cream-200">{pledges.filter(p => p.enrolled && !p.completed).length}</strong>
        </div>
      </div>

      {/* Grouping and Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-white dark:bg-forest-900/40 p-4 rounded-2xl border border-forest-100 dark:border-forest-800/60 shadow-sm">
        {/* Category Pills of Categories */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto no-scrollbar py-0.5">
          {['All', 'Energy', 'Diet', 'Waste', 'Transport'].map(cat => {
            const isSelected = selectedFilter === cat;
            const config = categoryConfig[cat];
            const Icon = config ? config.icon : Layers;
            return (
              <button
                key={cat}
                onClick={() => {
                  setSelectedFilter(cat);
                  if (cat !== 'All') {
                    setViewMode('filtered');
                  }
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-forest-750 border-forest-750 text-white shadow-sm'
                    : 'bg-cream-50 dark:bg-forest-950 border-forest-100 dark:border-forest-900 text-forest-700 dark:text-sage-300 hover:bg-forest-100'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-forest-500'}`} />
                <span>{cat}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-forest-100 dark:bg-forest-800 text-forest-650'
                }`}>
                  {cat === 'All' 
                    ? normalizedPledges.length 
                    : normalizedPledges.filter(p => p.category === cat).length
                  }
                </span>
              </button>
            );
          })}
        </div>

        {/* View mode and Automated Sorting controls */}
        <div className="flex flex-wrap items-center gap-2 shrink-0 self-end sm:self-auto">
          {/* Automated Sorting Toggle */}
          <button
            id="tab-screen-pledges-sort-co2"
            onClick={() => setSortByImpact(!sortByImpact)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
              sortByImpact
                ? 'bg-emerald-600 border-emerald-600 text-white shadow-sm ring-1 ring-emerald-500/30'
                : 'bg-cream-50 dark:bg-forest-950 border-forest-100 dark:border-forest-900 text-forest-750 dark:text-sage-300 hover:bg-forest-100'
            }`}
            title="Sort pledges and categories by highest carbon (CO2) reduction impact"
          >
            <TrendingUp className={`w-3.5 h-3.5 ${sortByImpact ? 'text-white' : 'text-forest-500'}`} />
            <span>Sort by Impact</span>
            {sortByImpact && (
              <span className="text-[9px] bg-white text-emerald-800 px-1 py-0.2 rounded font-black">
                ON
              </span>
            )}
          </button>

          {/* View mode toggle */}
          <div className="flex bg-cream-50 dark:bg-forest-950 p-1 rounded-xl border border-forest-100 dark:border-forest-900">
            {[
              { id: 'grouped', label: 'Grouped View', icon: Layers },
              { id: 'filtered', label: 'Grid Feed', icon: Activity }
            ].map(mode => {
              const isActive = viewMode === mode.id;
              const Icon = mode.icon;
              return (
                <button
                  key={mode.id}
                  onClick={() => {
                    setViewMode(mode.id as any);
                    if (mode.id === 'grouped') {
                      setSelectedFilter('All');
                    }
                  }}
                  disabled={mode.id === 'grouped' && selectedFilter !== 'All'}
                  title={mode.id === 'grouped' && selectedFilter !== 'All' ? 'Switch back to "All" filter to group' : ''}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                    isActive
                      ? 'bg-white dark:bg-forest-900 text-forest-800 dark:text-cream-100 shadow-sm border border-forest-100/50 dark:border-forest-800'
                      : 'text-forest-500/80 hover:text-forest-750 dark:text-sage-400 dark:hover:text-cream-100'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{mode.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {viewMode === 'grouped' ? (
        <div className="space-y-8 animate-fade-in">
          {processedCategories.map(category => {
            const categoryPledges = normalizedPledges.filter(p => p.category === category);
            if (categoryPledges.length === 0) return null;

            const config = categoryConfig[category] || categoryConfig['Other'];
            const CatIcon = config.icon;
            const completedCount = categoryPledges.filter(p => p.completed).length;
            const activeCount = categoryPledges.filter(p => p.enrolled && !p.completed).length;
            
            const sortedCategoryPledges = sortByImpact
              ? [...categoryPledges].sort((a, b) => b.co2Reduction - a.co2Reduction)
              : categoryPledges;

            return (
              <div key={category} className="space-y-4">
                {/* Visual Category Header Group */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-forest-100 dark:border-forest-900 pb-2.5 gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className={`p-2 rounded-xl border ${config.badgeClass} shadow-sm`}>
                      <CatIcon className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-extrabold text-forest-800 dark:text-cream-100 flex items-center gap-2">
                        {category} Commitments
                        {sortByImpact && (
                          <span className="text-[10px] font-bold bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-900 px-2 py-0.5 rounded-md">
                            Total impact: {getCategoryTotalImpact(category)} kg CO₂
                          </span>
                        )}
                      </h3>
                      <p className="text-[10px] text-forest-550 dark:text-sage-350">
                        Target-based environmental steps focusing on regional carbon reduction
                      </p>
                    </div>
                  </div>
                  
                  {/* Performance stats mini pill */}
                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    {activeCount > 0 && (
                      <span className="text-[10px] font-bold bg-orange-50 dark:bg-amber-950/20 text-orange-700 dark:text-orange-400 border border-orange-200 dark:border-orange-900 px-2 py-0.5 rounded-md">
                        {activeCount} Active
                      </span>
                    )}
                    {completedCount > 0 && (
                      <span className="text-[10px] font-bold bg-green-50 dark:bg-emerald-950/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-900 px-2 py-0.5 rounded-md">
                        {completedCount} Completed
                      </span>
                    )}
                    <span className="text-[10px] font-mono text-forest-500 font-medium">
                      {categoryPledges.length} total
                    </span>
                  </div>
                </div>

                {/* Sub-grid of Pledges matching this category */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {sortedCategoryPledges.map(pledge => renderPledgeCard(pledge))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Flat Grid View with Active Filter Pill Applied */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in">
          {normalizedPledges
            .filter(p => selectedFilter === 'All' || p.category === selectedFilter)
            .sort((a, b) => sortByImpact ? b.co2Reduction - a.co2Reduction : 0)
            .map(pledge => renderPledgeCard(pledge))}
        </div>
      )}
    </div>
  );
}
