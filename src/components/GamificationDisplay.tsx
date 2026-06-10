import { Badge } from '../types';
import { Award, Lock, CheckCircle, Flame, Star, Zap, Shield, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

interface GamificationDisplayProps {
  points: number;
  badges: Badge[];
  streak: number;
  onShareProgress: () => void;
}

export default function GamificationDisplay({ points, badges, streak, onShareProgress }: GamificationDisplayProps) {
  const currentLevel = Math.floor(points / 200) + 1;
  const nextLevelPoints = currentLevel * 200;
  const prevLevelPoints = (currentLevel - 1) * 200;
  const levelProgress = Math.min(100, Math.round(((points - prevLevelPoints) / 200) * 100));

  // Count unlocked
  const unlockedCount = badges.filter(b => b.unlockedAt !== null).length;

  return (
    <div id="gamification-display-panel" className="grid grid-cols-1 md:grid-cols-12 gap-6">
      
      {/* Left side: Points card, Levels, & Streak count */}
      <div id="gamification-summary-card" className="md:col-span-4 space-y-4">
        <div className="bg-gradient-to-br from-forest-600 to-sage-800 dark:from-forest-900 dark:to-sage-950 p-6 rounded-2xl border border-forest-500 text-white shadow-md flex flex-col justify-between h-full min-h-[300px]">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-xs uppercase tracking-wider text-sage-200 font-extrabold flex items-center gap-1.5">
                <Star className="w-4 h-4 fill-amber-300 stroke-amber-400" />
                Sustainer Level
              </span>
              <div className="bg-white/20 px-2.5 py-1 rounded-full text-[10px] font-black uppercase">
                Rank {currentLevel}
              </div>
            </div>

            <div>
              <div className="text-5xl font-black flex items-baseline gap-1 font-mono">
                {points}
                <span className="text-xs font-normal text-sage-200">Total XP</span>
              </div>
              <p className="text-xs text-sage-200/95 mt-1">
                Collect points by committing to pledges and logging carbon-saving habits daily.
              </p>
            </div>

            {/* Level progress bar */}
            <div className="space-y-1.5 pt-4">
              <div className="flex justify-between text-xs text-sage-200 font-medium font-mono">
                <span>LV. {currentLevel}</span>
                <span>{points % 200} / 200 XP for LV. {currentLevel + 1}</span>
              </div>
              <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                <motion.div
                  id="gamification-level-progress-bar"
                  className="h-full bg-amber-300 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${levelProgress}%` }}
                  transition={{ duration: 1 }}
                />
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-white/15 rounded-xl text-amber-300">
                <Flame className="w-6 h-6 fill-amber-300 text-amber-500 animate-pulse" />
              </div>
              <div>
                <span className="text-xs text-sage-200 block">Streak Counter</span>
                <span className="text-sm font-bold font-mono">{streak} Day{streak !== 1 ? 's' : ''} Logging</span>
              </div>
            </div>
            
            <button
              id="gamification-share-progress-btn"
              onClick={onShareProgress}
              className="bg-cream-100 hover:bg-cream-200 text-forest-800 font-bold px-4 py-2 rounded-xl text-xs hover:scale-105 transition-all text-center w-full sm:w-auto cursor-pointer shadow-sm"
            >
              Share Progress
            </button>
          </div>
        </div>
      </div>

      {/* Right side: Badge milestones grid */}
      <div id="gamification-badges-panel" className="md:col-span-8 space-y-4">
        <div className="bg-white dark:bg-forest-900/40 p-6 rounded-2xl border border-forest-100 dark:border-forest-800/60 shadow-sm">
          <div className="flex justify-between items-center border-b border-forest-100 dark:border-forest-800 pb-3 mb-4">
            <div>
              <h3 className="text-base font-bold text-forest-750 dark:text-cream-100">
                Unlocked Environmental Badges
              </h3>
              <p className="text-xs text-forest-550">
                Solve challenges to lock in high-impact lifestyle titles
              </p>
            </div>
            <span className="text-xs font-bold text-sage-700 bg-sage-50 dark:bg-forest-800 px-3 py-1 rounded-full">
              {unlockedCount} / {badges.length} Badges
            </span>
          </div>

          {/* Grid of badges */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {badges.map((badge) => {
              const isUnlocked = badge.unlockedAt !== null;
              return (
                <div
                  key={badge.id}
                  id={`badge-card-${badge.id}`}
                  className={`p-4 rounded-xl border flex gap-3.5 items-start transition-all ${
                    isUnlocked
                      ? 'bg-cream-50/50 dark:bg-forest-900/20 border-sage-300 dark:border-sage-800/80'
                      : 'bg-cream-50/10 dark:bg-forest-900/5 border-forest-100 dark:border-forest-900 opacity-65'
                  }`}
                >
                  <div className={`p-3 rounded-xl border ${
                    isUnlocked
                      ? 'bg-sage-100 dark:bg-forest-800 border-sage-200 dark:border-forest-750 text-sage-600 dark:text-sage-200 shadow-sm'
                      : 'bg-forest-100 dark:bg-forest-900 border-forest-150 dark:border-forest-850 text-forest-400'
                  }`}>
                    {isUnlocked ? (
                      <Award className="w-6 h-6 animate-pulse" />
                    ) : (
                      <Lock className="w-6 h-6" />
                    )}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5">
                      <span className={`text-xs font-bold ${isUnlocked ? 'text-forest-800 dark:text-cream-100 font-black' : 'text-forest-400'}`}>
                        {badge.name}
                      </span>
                      {isUnlocked && (
                        <CheckCircle className="w-3.5 h-3.5 text-green-500 fill-green-100 dark:fill-transparent" />
                      )}
                    </div>
                    <p className={`text-[11px] leading-relaxed ${isUnlocked ? 'text-forest-650 dark:text-sage-300' : 'text-forest-400'}`}>
                      {badge.description}
                    </p>
                    {isUnlocked && badge.unlockedAt && (
                      <span className="text-[9px] font-mono font-medium text-sage-605 bg-sage-50/80 dark:bg-forest-800/50 dark:text-sage-200 px-2 py-0.5 rounded-md mt-1.5 block w-max">
                        Unlocked on {new Date(badge.unlockedAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
