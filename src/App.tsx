import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ActivityLog, Badge, Challenge, Pledge, HubLocation, Tip } from './types';
import ThemeToggle from './components/ThemeToggle';
import StatsGrid from './components/StatsGrid';
import ActivityLogger from './components/ActivityLogger';
import PledgeDashboard from './components/PledgeDashboard';
import GamificationDisplay from './components/GamificationDisplay';
import EcoTrackerSheet from './components/EcoTrackerSheet';
import LocalHub from './components/LocalHub';
import ImpactCalculator from './components/ImpactCalculator';
import AssistantSage from './components/AssistantSage';
import NotificationScheduler from './components/NotificationScheduler';
import CommunityChallenges from './components/CommunityChallenges';

import { 
  Leaf, 
  BarChart3, 
  HeartHandshake, 
  Trophy, 
  Sliders, 
  Compass, 
  Sparkles, 
  Search,
  Users,
  BellRing
} from 'lucide-react';

export default function App() {
  // --- Dark Mode State ---
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    // Read initial preference
    const saved = localStorage.getItem('tracker_dark_mode');
    return saved ? saved === 'true' : false;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('tracker_dark_mode', String(darkMode));
  }, [darkMode]);

  // --- Active Tab State ---
  const [activeTab, setActiveTab] = useState<'overview' | 'tracker' | 'pledges' | 'simulator' | 'hub' | 'sage'>('overview');

  // --- Core Application States with LocalStorage Persistence ---
  
  // 1. Activity Logs State
  const [logs, setLogs] = useState<ActivityLog[]>(() => {
    const saved = localStorage.getItem('eco_activity_logs');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    // Default initial logs
    const todayYmd = new Date().toISOString().split('T')[0];
    return [
      {
        id: 'init-1',
        type: 'meal',
        title: 'Vegan Lunch',
        co2Value: 0.6,
        timestamp: `${todayYmd}T12:30:00.000Z`
      },
      {
        id: 'init-2',
        type: 'transport',
        title: 'Walked 3 km',
        co2Value: 0.0,
        timestamp: `${todayYmd}T08:45:00.000Z`
      },
      {
        id: 'init-3',
        type: 'energy',
        title: 'Unplugged vampire appliances',
        co2Value: -0.8,
        timestamp: `${todayYmd}T09:15:00.000Z`
      },
      {
        id: 'init-4',
        type: 'waste',
        title: 'Recycled card & paper waste',
        co2Value: -1.2,
        timestamp: `${todayYmd}T15:10:00.000Z`
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('eco_activity_logs', JSON.stringify(logs));
  }, [logs]);

  // 2. Points & Streaks State
  const [points, setPoints] = useState<number>(() => {
    const saved = localStorage.getItem('eco_user_points');
    return saved ? parseInt(saved) : 285;
  });

  const [streak, setStreak] = useState<number>(() => {
    const saved = localStorage.getItem('eco_user_streak');
    return saved ? parseInt(saved) : 4;
  });

  useEffect(() => {
    localStorage.setItem('eco_user_points', String(points));
  }, [points]);

  useEffect(() => {
    localStorage.setItem('eco_user_streak', String(streak));
  }, [streak]);

  // 3. Pledges State
  const [pledges, setPledges] = useState<Pledge[]>(() => {
    const saved = localStorage.getItem('eco_user_pledges');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return [
      {
        id: 'pledge-led',
        title: 'Complete LED Bulbs Switchover',
        description: 'Replace remaining traditional thermal lightbulbs with eco emitting LEDs.',
        co2Reduction: 22,
        enrolled: true,
        completed: false,
        durationDays: 30,
        daysPassed: 18,
        category: 'Energy'
      },
      {
        id: 'pledge-bike',
        title: 'Short Distance Commuting Lock',
        description: 'Promise to bike or walk for active commutes under a 2-mile perimeter.',
        co2Reduction: 55,
        enrolled: true,
        completed: false,
        durationDays: 30,
        daysPassed: 24,
        category: 'Transport'
      },
      {
        id: 'pledge-plastic',
        title: 'Plastic Outlaw Phase',
        description: 'Ban virgin disposable bottles, retail wrap liners, and carryouts entirely.',
        co2Reduction: 15,
        enrolled: false,
        completed: false,
        durationDays: 14,
        daysPassed: 0,
        category: 'Waste'
      },
      {
        id: 'pledge-beef',
        title: 'No Red Meat Challenge',
        description: 'Promise to drop cattle and lamb products from midday lunch schedules.',
        co2Reduction: 42,
        enrolled: true,
        completed: true,
        durationDays: 30,
        daysPassed: 30,
        category: 'Diet'
      },
      {
        id: 'pledge-compost',
        title: 'Kitchen Scrap Composting',
        description: 'Equip a balcony compost grid and feed soil rather than high-methane bio trash.',
        co2Reduction: 20,
        enrolled: false,
        completed: false,
        durationDays: 30,
        daysPassed: 0,
        category: 'Waste'
      },
      {
        id: 'pledge-thermostat',
        title: 'Optimal Thermostat Control',
        description: 'Set HVAC systems to 20°C in winter and block structural thermal draft zones.',
        co2Reduction: 38,
        enrolled: false,
        completed: false,
        durationDays: 21,
        daysPassed: 0,
        category: 'Energy'
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('eco_user_pledges', JSON.stringify(pledges));
  }, [pledges]);

  // 4. Badges State
  const [badges, setBadges] = useState<Badge[]>(() => {
    // Initial static list to reward milestones dynamically
    return [
      {
        id: 'badge-energy',
        name: 'Energy Saver Pro',
        description: 'Unlocked by logging vampire power saving offsets',
        iconName: 'Award',
        unlockedAt: new Date(Date.now() - 345600000).toISOString(),
        category: 'energy'
      },
      {
        id: 'badge-waste',
        name: 'Waste Warrior',
        description: 'Log compost or paper recycling actions',
        iconName: 'Award',
        unlockedAt: new Date(Date.now() - 172800000).toISOString(),
        category: 'waste'
      },
      {
        id: 'badge-meals',
        name: 'Plant-Based Champion',
        description: 'Unlock by accumulating 400 total Eco XP points',
        iconName: 'Award',
        unlockedAt: null, // locked
        category: 'meals'
      },
      {
        id: 'badge-transit',
        name: 'Green Commuter Hero',
        description: 'Commit to carbon-free transit options',
        iconName: 'Award',
        unlockedAt: null, // locked
        category: 'transit'
      }
    ];
  });

  // Dynamic Badge unlocks based on XP points milestone
  useEffect(() => {
    if (points >= 400) {
      setBadges(prev => 
        prev.map(badge => 
          badge.id === 'badge-meals' && badge.unlockedAt === null
            ? { ...badge, unlockedAt: new Date().toISOString() }
            : badge
        )
      );
    }
    if (points >= 500) {
      setBadges(prev => 
        prev.map(badge => 
          badge.id === 'badge-transit' && badge.unlockedAt === null
            ? { ...badge, unlockedAt: new Date().toISOString() }
            : badge
        )
      );
    }
  }, [points]);

  // 5. Challenges State
  const [challenges, setChallenges] = useState<Challenge[]>([
    {
      id: 'challenge-bus',
      title: 'Ride and Glide Commutative',
      description: 'Ride bio-buses, standard rail systems, or walk to work. Offset 50,000 km collectively!',
      targetUnit: 'km',
      targetValue: 50000,
      currentValue: 38420,
      pointsReward: 300,
      joined: true,
      completed: false,
      category: 'transport',
      participants: 1240
    },
    {
      id: 'challenge-vegan',
      title: 'Plant-By-Day Weeks',
      description: 'Replace standard beef/pork products with vegan and organic co-ops. Aim for 10k meals!',
      targetUnit: 'meals',
      targetValue: 10000,
      currentValue: 7420,
      pointsReward: 250,
      joined: false,
      completed: false,
      category: 'meal',
      participants: 890
    },
    {
      id: 'challenge-compost',
      title: 'Zero Waste Community Loop',
      description: 'Recycle glass and organic compost. Target weight of 5,000 kg landfill reduction absolute!',
      targetUnit: 'kg',
      targetValue: 5000,
      currentValue: 5000,
      pointsReward: 200,
      joined: true,
      completed: true,
      category: 'waste',
      participants: 550
    }
  ]);

  // 6. Hub Locations coordinates
  const hubLocations: HubLocation[] = [
    {
      id: 'hub-1',
      name: 'Westside Recycling Center',
      type: 'recycling',
      address: '90 Recycle Road, Greenford District',
      coordinates: { x: 20, y: 35 },
      details: 'Certified green recycling facility. Accepts hazardous lithium batteries, computing hardware, cardboard, glass aggregates, and plastic caps.',
      hours: '08:00 - 18:00 Daily',
      savingsPotential: 45
    },
    {
      id: 'hub-2',
      name: 'Central Solar Rail Hub',
      type: 'transport',
      address: '1 Central Plaza, Rail District',
      coordinates: { x: 55, y: 25 },
      details: 'All regional commuter trains are backed and charged exclusively by the solar co-op panel fields.',
      hours: '24/7 Transit access',
      savingsPotential: 120
    },
    {
      id: 'hub-3',
      name: 'Eco-Ware Bulk Dry Foods',
      type: 'eco_shop',
      address: '12 Pine Meadow Way, Sandstone Hills',
      coordinates: { x: 30, y: 80 },
      details: 'A beautiful package-free grocery co-op. Bring glass jars to scoop organic seeds, grains, oats, liquid soaps, and spices.',
      hours: '09:00 - 20:00 (Mon-Sat)',
      savingsPotential: 35
    },
    {
      id: 'hub-4',
      name: 'Bounty Community Garden Grid',
      type: 'garden',
      address: 'District Park Plot C, Northway Hills',
      coordinates: { x: 74, y: 70 },
      details: 'Maintained by active volunteers. Drop off compostable vegetative raw kitchen waste and help sow regional crops.',
      hours: '07:00 - 21:00 (Daily)',
      savingsPotential: 25
    }
  ];

  // 7. Sage AI Assistant tips
  const sageTips: Tip[] = [
    {
      id: 'tip-1',
      category: 'energy',
      text: "Unplug minor television sets and consoles before sleep. This cuts phantom 'vampire' pull by about 45 kg of CO₂ per year.",
      savingEstimate: "45 kg CO₂ Savings Annually"
    },
    {
      id: 'tip-2',
      category: 'diet',
      text: "Swapping beef for a plant-based soy bean, lentil or bean burger prevents 2.6 kg of CO₂ from intensive farm extractions.",
      savingEstimate: "2.6 kg CO₂ Saved per meal"
    },
    {
      id: 'tip-3',
      category: 'transport',
      text: "Avoid standard private car commutes for standard journeys under 2 miles. Walking or light cycling keeps emissions at zero.",
      savingEstimate: "0.4 kg CO₂ Saved / mile"
    },
    {
      id: 'tip-4',
      category: 'waste',
      text: "Composting kitchen scraps intercepts trash going to standard high-methane landfills, saving about 0.6 kg of CO₂ per container.",
      savingEstimate: "0.6 kg CO₂ Saved / bin load"
    },
    {
      id: 'tip-5',
      category: 'energy',
      text: "Opt for cold laundry cycles (30°C or below). Heating hot water handles over 75% of your washer unit's overall electricity load.",
      savingEstimate: "0.5 kg CO₂ Saved / washing run"
    }
  ];

  // --- Handlers for Data Updates ---
  
  // Adding log
  const handleAddLog = (newLog: Omit<ActivityLog, 'id' | 'timestamp'>) => {
    const updated = [
      ...logs,
      {
        ...newLog,
        id: `log-${Date.now()}`,
        timestamp: new Date().toISOString()
      }
    ];
    setLogs(updated);

    // Reward points based on categories
    let earnedPoints = 15;
    if (newLog.co2Value <= 0) earnedPoints = 25; // reward more points for savings
    if (newLog.title.toLowerCase().includes('voice')) earnedPoints += 5; // bonus command point!
    
    setPoints(prev => prev + earnedPoints);
  };

  // Deleting log
  const handleDeleteLog = (id: string) => {
    setLogs(logs.filter(l => l.id !== id));
  };

  // Toggle Pledges Enroll
  const handleToggleEnroll = (id: string) => {
    setPledges(pledges.map(p => 
      p.id === id 
        ? { ...p, enrolled: !p.enrolled, daysPassed: !p.enrolled ? 1 : 0, completed: false } 
        : p
    ));
  };

  // Completing Pledges
  const handleCompletePledge = (id: string) => {
    setPledges(pledges.map(p => 
      p.id === id 
        ? { ...p, completed: true, enrolled: true, daysPassed: p.durationDays } 
        : p
    ));
    setPoints(prev => prev + 250); // Massive bonus point!
  };

  // Join Challenges
  const handleJoinChallenge = (id: string) => {
    setChallenges(challenges.map(c => 
      c.id === id 
        ? { ...c, joined: true, participants: c.participants + 1 } 
        : c
    ));
    setPoints(prev => prev + 50); // Reward joining point!
  };

  // --- Calculations for Statistics ---
  
  // CO2 Saved standard (Negative co2 values indicate positive carbon offsets)
  const calculateTotalCo2Saved = () => {
    let savings = 0;
    // 1. From negative log offsets (e.g. comp, vampire, recycle)
    savings += logs
      .filter(l => l.co2Value < 0)
      .reduce((sum, l) => sum + Math.abs(l.co2Value), 0);

    // 2. From eating meat-free/walking instead of driving (relative to a average profile)
    // E.g. Vegan meal emits 0.6 instead of 3.2, saving 2.6
    logs.forEach(l => {
      if (l.title.toLowerCase().includes('vegan')) savings += 2.6;
      if (l.title.toLowerCase().includes('vegetarian')) savings += 2.1;
      if (l.title.toLowerCase().includes('walk') || l.title.toLowerCase().includes('cycle')) savings += 4.5;
      if (l.title.toLowerCase().includes('public transport')) savings += 2.8;
    });

    // 3. Add rewards from completed pledges
    pledges.forEach(p => {
      if (p.completed) savings += p.co2Reduction;
    });

    return savings || 48.0; // default seed if empty
  };

  const calculateTotalCo2Logged = () => {
    const positiveLogs = logs.filter(l => l.co2Value > 0).reduce((sum, l) => sum + l.co2Value, 0);
    return positiveLogs || 3.8;
  };

  const totalCo2Saved = calculateTotalCo2Saved();
  const totalCo2Logged = calculateTotalCo2Logged();

  return (
    <div className="min-h-screen bg-cream-50 text-forest-900 transition-colors duration-150 font-sans flex flex-col justify-between dark:bg-forest-950 dark:text-cream-100">
      
      {/* Upper Navigation Header bar */}
      <header id="app-main-header" className="sticky top-0 bg-white/90 dark:bg-forest-950/90 backdrop-blur-md border-b border-forest-100 dark:border-forest-900 z-40 transition-colors">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-sage-500 rounded-xl text-white shadow-sm flex items-center justify-center animate-pulse">
              <Leaf className="w-5 h-5" />
            </div>
            <div>
              <h1 id="brand-header-title" className="text-base font-black tracking-tight text-forest-750 dark:text-cream-100 flex items-center gap-1.5 leading-none">
                Eco Carbon Tracker
                <span className="text-[9px] bg-sage-100 dark:bg-forest-800 text-sage-700 dark:text-sage-200 px-2 py-0.5 rounded-full font-bold">ALPHA</span>
              </h1>
              <span className="text-[10px] text-forest-500/80 dark:text-sage-300 block mt-0.5">Sustain your global footprint footprint</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Quick points highlight badge */}
            <div className="hidden sm:flex items-center gap-2 bg-cream-102 dark:bg-forest-900 px-3.5 py-1.5 rounded-xl border border-forest-150 dark:border-forest-800">
              <Trophy className="w-4 h-4 text-amber-500 fill-amber-100" />
              <span className="text-xs font-bold text-forest-750 dark:text-cream-202 shrink-0 font-mono">
                {points} XP
              </span>
            </div>

            {/* Dark Mode interactive button */}
            <ThemeToggle darkMode={darkMode} onToggle={() => setDarkMode(!darkMode)} />
          </div>
        </div>
      </header>

      {/* Main content body */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Core Stats Overview Banner */}
        <StatsGrid 
          totalCo2Saved={totalCo2Saved} 
          totalCo2Logged={totalCo2Logged} 
          points={points} 
          streak={streak} 
        />

        {/* Tab Controls Navigation Rail */}
        <div id="tabs-navigation-subbar" className="flex border-b border-forest-100 dark:border-forest-900 gap-1 overflow-x-auto no-scrollbar py-1">
          {[
            { id: 'overview', label: 'My Eco Diary', icon: Leaf },
            { id: 'tracker', label: 'Carbon Trail Graph', icon: BarChart3 },
            { id: 'pledges', label: 'Active Pledges', icon: HeartHandshake },
            { id: 'simulator', label: 'Impact Simulator', icon: Sliders },
            { id: 'hub', label: 'Local Pathfinder Hub', icon: Compass },
            { id: 'sage', label: 'Sage Expert AI', icon: Sparkles }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`nav-tab-${tab.id}`}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-2 px-4 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-forest-600 text-white shadow-sm font-black'
                    : 'text-forest-650 dark:text-sage-300 hover:bg-forest-100/50 dark:hover:bg-forest-900/30'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-forest-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Active Tab Screen Area */}
        <div id="active-tab-container" className="py-2">
          {activeTab === 'overview' && (
            <div id="tab-screen-overview" className="space-y-6">
              {/* Logger widget */}
              <ActivityLogger 
                logs={logs} 
                onAddLog={handleAddLog} 
                onDeleteLog={handleDeleteLog} 
                dailyCo2Budget={15.0} 
              />
              {/* Gamification badges & Level standings */}
              <GamificationDisplay 
                points={points} 
                badges={badges} 
                streak={streak} 
                onShareProgress={() => {}} 
              />
              {/* Daily Alert Scheduler */}
              <NotificationScheduler />
            </div>
          )}

          {activeTab === 'tracker' && (
            <div id="tab-screen-tracker" className="space-y-6 animate-fade-in">
              <EcoTrackerSheet logs={logs} />
              <CommunityChallenges 
                challenges={challenges} 
                onJoinChallenge={handleJoinChallenge} 
                points={points} 
              />
            </div>
          )}

          {activeTab === 'pledges' && (
            <div id="tab-screen-pledges" className="animate-fade-in">
              <PledgeDashboard 
                pledges={pledges} 
                onToggleEnroll={handleToggleEnroll} 
                onCompletePledge={handleCompletePledge} 
                points={points} 
              />
            </div>
          )}

          {activeTab === 'simulator' && (
            <div id="tab-screen-simulator" className="animate-fade-in">
              <ImpactCalculator />
            </div>
          )}

          {activeTab === 'hub' && (
            <div id="tab-screen-hub" className="animate-fade-in">
              <LocalHub locations={hubLocations} />
            </div>
          )}

          {activeTab === 'sage' && (
            <div id="tab-screen-sage" className="animate-fade-in">
              <AssistantSage tips={sageTips} />
            </div>
          )}
        </div>
      </main>

      {/* Main Footer credentials line */}
      <footer id="app-main-footer" className="bg-white/60 dark:bg-forest-950/60 border-t border-forest-100 dark:border-forest-900 py-6 transition-colors mt-12 text-center text-xs text-forest-500 font-medium">
        <div className="w-full max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 Eco Carbon Tracker. Supporting net-zero milestones. All calculations adjusted to EPA standard limits.</p>
          <div className="flex gap-4">
            <a href="#overview" onClick={() => setActiveTab('overview')} className="hover:underline">My Diary</a>
            <span>•</span>
            <a href="#tracker" onClick={() => setActiveTab('tracker')} className="hover:underline">Progress Trail</a>
            <span>•</span>
            <a href="#sage" onClick={() => setActiveTab('sage')} className="hover:underline">Sage AI Assistance</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
