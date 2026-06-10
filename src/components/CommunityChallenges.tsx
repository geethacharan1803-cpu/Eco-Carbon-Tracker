import { useState } from 'react';
import { Challenge } from '../types';
import { Users, Trophy, Share2, Shield, Calendar, Sparkles, Check, Twitter, Facebook, Linkedin, Copy } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CommunityChallengesProps {
  challenges: Challenge[];
  onJoinChallenge: (id: string) => void;
  points: number;
}

export default function CommunityChallenges({ challenges, onJoinChallenge, points }: CommunityChallengesProps) {
  const [selectedShareNetwork, setSelectedShareNetwork] = useState<string | null>(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  // Mock leaderboard users
  const leaderboard = [
    { rank: 1, name: 'Clara Greenwood', points: 1420, reduction: '124 kg', badge: 'Forest Sovereign' },
    { rank: 2, name: 'Liam Sterling', points: 1150, reduction: '98 kg', badge: 'Energy Saver Pro' },
    { rank: 3, name: 'Sofia Alvarez', points: 980, reduction: '82 kg', badge: 'Waste Warrior' },
    { rank: 4, name: 'You (Eco Cadet)', points: points, reduction: `${(points / 12).toFixed(0)} kg`, badge: 'Cadet' },
    { rank: 5, name: 'Oliver Bennett', points: 420, reduction: '31 kg', badge: 'Leaf Guardian' },
  ].sort((a, b) => b.points - a.points); // Sort dynamically so they look real!

  // Update ranks
  const sortedLeaderboard = leaderboard.map((user, idx) => ({
    ...user,
    rank: idx + 1
  }));

  const handleShareClick = () => {
    setIsShareModalOpen(true);
  };

  const copyShareText = () => {
    const text = `I'm tracking my carbon footprint and just reached ${points} XP and unlocked sustainability medals on the Eco Carbon Tracker! Join the offset movement! 🌍🌿`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div id="community-challenges-view" className="space-y-6">
      
      {/* Social Sharing Modal Panel */}
      <AnimatePresence>
        {isShareModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-forest-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-forest-950 p-6 rounded-2xl border border-forest-200 dark:border-forest-800 max-w-sm w-full shadow-xl space-y-4 text-center"
            >
              <div className="w-12 h-12 bg-sage-50 dark:bg-forest-900 rounded-full flex items-center justify-center text-sage-600 dark:text-sage-200 mx-auto border border-sage-300">
                <Share2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-forest-800 dark:text-cream-100">
                  Share Your Progress
                </h3>
                <p className="text-xs text-forest-550 mt-1">
                  Inspire friends to reduce carbon by showcasing your milestones!
                </p>
              </div>

              {/* Share box text preview */}
              <div className="bg-cream-50 dark:bg-forest-900 p-3 rounded-xl border border-forest-150 dark:border-forest-850 text-left text-xs font-mono text-forest-700 dark:text-cream-250 select-all leading-normal">
                "I'm tracking my carbon footprint and just reached <strong className="text-forest-800 dark:text-cream-100">{points} XP</strong> and unlocked sustainability medals on the Eco Carbon Tracker! Join the offset movement! 🌍🌿"
              </div>

              {/* Action buttons list */}
              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  onClick={copyShareText}
                  className="p-2.5 bg-cream-100 hover:bg-cream-202 text-forest-750 dark:bg-forest-800 hover:dark:bg-forest-750 dark:text-cream-100 font-semibold rounded-xl text-xs flex items-center justify-center gap-1.5 border border-forest-200 dark:border-forest-700 cursor-pointer"
                >
                  {copied ? <Check className="w-4 h-4 text-green-600 animate-pulse" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Copied' : 'Copy Text'}
                </button>
                <button
                  onClick={() => { setSelectedShareNetwork('Twitter'); setTimeout(() => setSelectedShareNetwork(null), 1500); }}
                  className="p-2.5 bg-sky-500 hover:bg-sky-600 text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Twitter className="w-4 h-4 fill-white text-transparent" />
                  {selectedShareNetwork === 'Twitter' ? 'Shared!' : 'Post'}
                </button>
              </div>

              <button
                onClick={() => setIsShareModalOpen(false)}
                className="text-[11px] text-forest-400 hover:underline pt-1 block mx-auto cursor-pointer"
              >
                Close dialog
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-white dark:bg-forest-900/40 p-5 rounded-2xl border border-forest-100 dark:border-forest-800/60 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-forest-700 dark:text-cream-100 flex items-center gap-2">
            <Users className="w-5 h-5 text-sage-600" />
            Community Challenges & Standings
          </h2>
          <p className="text-xs text-forest-650 dark:text-sage-350">
            Compete, collaborate, and share with a network of local environmental stewards
          </p>
        </div>
        <button
          id="social-share-global-btn"
          onClick={handleShareClick}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-forest-600 to-sage-605 text-white font-bold rounded-xl text-xs hover:shadow transition-all hover:scale-103 cursor-pointer"
        >
          <Share2 className="w-4 h-4" />
          Share Global standing
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Active community-wide sustainability challenges */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white dark:bg-forest-900/40 p-5 rounded-2xl border border-forest-100 dark:border-forest-800/60 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-forest-750 dark:text-cream-105 border-b border-forest-100 dark:border-forest-800 pb-2 flex items-center gap-1.5">
              <Calendar className="w-4.5 h-4.5 text-sage-605" />
              Active Joint Challenges
            </h3>

            <div className="space-y-4">
              {challenges.map((challenge) => {
                const percent = Math.min(100, Math.round((challenge.currentValue / challenge.targetValue) * 100));
                return (
                  <div
                    key={challenge.id}
                    id={`challenge-${challenge.id}`}
                    className={`p-4 rounded-xl border flex flex-col justify-between ${
                      challenge.completed
                        ? 'bg-forest-50/20 dark:bg-forest-950/20 border-sage-300 dark:border-sage-850'
                        : challenge.joined
                        ? 'bg-white dark:bg-forest-900 border-sage-400 dark:border-sage-700 ring-1 ring-sage-300/30'
                        : 'bg-cream-50/10 dark:bg-forest-900/5 border-forest-100 dark:border-forest-800'
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex justify-between items-start gap-2">
                        <div>
                          <span className="text-[9px] uppercase font-bold tracking-wider text-forest-450 bg-cream-200 dark:bg-forest-800 px-2 py-0.5 rounded-md">
                            {challenge.category.toUpperCase()} GROUP
                          </span>
                          <h4 className="text-xs font-extrabold text-forest-800 dark:text-cream-100 mt-1.5">
                            {challenge.title}
                          </h4>
                        </div>
                        <span className="text-xs font-black text-sage-606">
                          +{challenge.pointsReward} XP
                        </span>
                      </div>

                      <p className="text-xs text-forest-600 dark:text-sage-300 leading-normal">
                        {challenge.description}
                      </p>

                      {/* Targeted Goals Progress Bar */}
                      <div className="space-y-1.5 pt-1">
                        <div className="flex justify-between text-[10px] text-forest-500 font-medium">
                          <span>Collective: {challenge.currentValue.toLocaleString()} / {challenge.targetValue.toLocaleString()} {challenge.targetUnit}</span>
                          <span>{percent}% Combined Goal</span>
                        </div>
                        <div className="h-2 bg-cream-250 dark:bg-forest-805 rounded-full overflow-hidden">
                          <motion.div
                            id={`challenge-progress-${challenge.id}`}
                            className="h-full bg-sage-500 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${percent}%` }}
                            transition={{ duration: 1.1 }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-forest-100 dark:border-forest-800/60 flex items-center justify-between text-xs font-bold text-forest-650">
                      <span className="flex items-center gap-1 text-[10.5px]">
                        <Users className="w-3.5 h-3.5 text-forest-400" />
                        {challenge.participants.toLocaleString()} stewards active
                      </span>

                      {challenge.completed ? (
                        <span className="text-green-600 flex items-center gap-1 text-[11px] font-black">
                          <Check className="w-4 h-4" /> Goal Met!
                        </span>
                      ) : (
                        <button
                          id={`join-challenge-btn-${challenge.id}`}
                          onClick={() => onJoinChallenge(challenge.id)}
                          className={`px-3 py-1 rounded-lg text-[10px] uppercase font-extrabold cursor-pointer border ${
                            challenge.joined
                              ? 'bg-sage-100 text-sage-700 border-sage-300 dark:bg-forest-800 dark:text-sage-200 dark:border-sage-700'
                              : 'bg-forest-600 hover:bg-forest-700 text-white border-forest-600 hover:scale-102 transition-transform'
                          }`}
                        >
                          {challenge.joined ? 'Active' : 'Join Challenge'}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Global Standings Leaderboard */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white dark:bg-forest-900/40 p-5 rounded-2xl border border-forest-100 dark:border-forest-800/60 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-forest-750 dark:text-cream-105 border-b border-forest-100 dark:border-forest-800 pb-2 flex items-center gap-1.5">
              <Trophy className="w-4.5 h-4.5 text-amber-500 fill-amber-100" />
              Sustainer Standings Leaderboard
            </h3>

            <div className="space-y-2">
              {sortedLeaderboard.map((user, idx) => {
                const isUser = user.name.includes('You');
                return (
                  <div
                    key={idx}
                    id={`leaderboard-user-${idx}`}
                    className={`p-3 rounded-xl border flex items-center justify-between gap-3 ${
                      isUser
                        ? 'bg-sage-53/40 dark:bg-forest-800/30 border-sage-405 ring-1 ring-sage-350/20'
                        : 'bg-cream-50/10 dark:bg-forest-900/10 border-forest-100 dark:border-forest-800'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {/* Rank Icon Badge */}
                      <span className={`w-6 h-6 rounded-lg text-xs font-black flex items-center justify-center font-mono ${
                        user.rank === 1
                          ? 'bg-amber-100 text-amber-700 fill-amber-200 dark:bg-amber-900/40 dark:text-amber-300'
                          : user.rank === 2
                          ? 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200'
                          : user.rank === 3
                          ? 'bg-orange-100 text-orange-700 dark:bg-amber-950/40 dark:text-orange-355'
                          : 'bg-cream-200 text-forest-500 dark:bg-forest-900 dark:text-forest-400'
                      }`}>
                        {user.rank}
                      </span>

                      <div className="text-xs">
                        <span className={`font-black block ${isUser ? 'text-forest-850 dark:text-cream-100 font-extrabold' : 'text-forest-750'}`}>
                          {user.name}
                        </span>
                        <span className="text-[9px] text-forest-450 uppercase font-bold">
                          {user.badge}
                        </span>
                      </div>
                    </div>

                    <div className="text-right text-xs">
                      <span className="font-bold text-forest-800 dark:text-cream-200 block font-mono">
                        {user.points} XP
                      </span>
                      <span className="text-[10px] text-green-600 font-medium">
                        ↓ {user.reduction} offset
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
