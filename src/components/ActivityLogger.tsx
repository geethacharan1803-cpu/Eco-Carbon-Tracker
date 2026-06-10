import React, { useState, useEffect, FormEvent } from 'react';
import { motion } from 'motion/react';
import { ActivityLog, ActivityType } from '../types';
import { 
  Utensils, 
  Car, 
  Zap, 
  Trash2, 
  Mic, 
  MicOff, 
  Plus, 
  Download, 
  Trash,
  AlertCircle,
  Sparkles
} from 'lucide-react';

interface ActivityLoggerProps {
  logs: ActivityLog[];
  onAddLog: (log: Omit<ActivityLog, 'id' | 'timestamp'>) => void;
  onDeleteLog: (id: string) => void;
  dailyCo2Budget: number; // e.g., 15 kg
}

export default function ActivityLogger({ logs, onAddLog, onDeleteLog, dailyCo2Budget }: ActivityLoggerProps) {
  const [activeCategory, setActiveCategory] = useState<ActivityType>('meal');
  const [selectedPreset, setSelectedPreset] = useState<string>('');
  
  // Custom quick inputs
  const [customTitle, setCustomTitle] = useState('');
  const [customCo2, setCustomCo2] = useState<number>(1.2);

  // Speech Recognition state
  const [isListening, setIsListening] = useState(false);
  const [speechFeedback, setSpeechFeedback] = useState<string>('');

  // Calculate today's footprint total
  const getTodayLogs = () => {
    const todayStr = new Date().toISOString().split('T')[0];
    return logs.filter(log => log.timestamp.startsWith(todayStr));
  };

  const todayLogs = getTodayLogs();
  const todayCo2Sum = todayLogs.reduce((sum, log) => sum + log.co2Value, 0);
  const budgetPercentage = Math.min(100, Math.round((todayCo2Sum / dailyCo2Budget) * 100));

  // Determine colors based on status
  const getBudgetColor = () => {
    if (budgetPercentage < 50) return 'text-green-600 dark:text-green-400 stroke-green-500';
    if (budgetPercentage < 85) return 'text-amber-500 stroke-amber-500';
    return 'text-red-500 stroke-red-500';
  };

  // Presets
  const presets: Record<ActivityType, { title: string; co2: number; points: number }[]> = {
    meal: [
      { title: 'Vegan Lunch or Dinner', co2: 0.6, points: 25 },
      { title: 'Vegetarian Meal', co2: 1.1, points: 15 },
      { title: 'Standard Meat Meal', co2: 3.2, points: 5 },
      { title: 'Local, Organic Meal', co2: 0.8, points: 20 },
    ],
    transport: [
      { title: 'Walked or Cycled (5 km)', co2: 0.0, points: 30 },
      { title: 'Public Transport (10 km)', co2: 0.5, points: 15 },
      { title: 'Electric Vehicle Ride (15 km)', co2: 1.5, points: 10 },
      { title: 'Solitary Car Drive (15 km)', co2: 5.2, points: 2 },
    ],
    energy: [
      { title: '1-Day Unplugged Vampire Power', co2: -0.8, points: 20 }, // savings can represent a logger reduction
      { title: 'Renewable Power Day', co2: 0.4, points: 25 },
      { title: 'Standard Grid Electricity Day', co2: 4.8, points: 5 },
      { title: 'Short 5-Min Shower', co2: 0.3, points: 15 },
    ],
    waste: [
      { title: 'Recycled Paper, Plastic & Tin', co2: -1.2, points: 20 },
      { title: 'Composted Food Waste', co2: -0.6, points: 15 },
      { title: 'Standard Bin (Mixed Landfill)', co2: 2.1, points: 2 },
      { title: 'Reused Transit Coffee Cup', co2: -0.4, points: 15 },
    ],
  };

  // Trigger preset logging
  const handleLogPreset = (preset: { title: string; co2: number }) => {
    onAddLog({
      type: activeCategory,
      title: preset.title,
      co2Value: preset.co2,
    });
  };

  // Trigger custom logging
  const handleLogCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTitle.trim()) return;
    onAddLog({
      type: activeCategory,
      title: customTitle,
      co2Value: customCo2,
    });
    setCustomTitle('');
  };

  // Export logs to CSV
  const handleExportCSV = () => {
    if (logs.length === 0) {
      alert("No logs to export yet!");
      return;
    }
    const headers = ['ID', 'Date', 'Category', 'Activity Title', 'Carbon Footprint (kg CO2)'];
    const rows = logs.map(log => [
      log.id,
      new Date(log.timestamp).toLocaleDateString(),
      log.type.toUpperCase(),
      `"${log.title.replace(/"/g, '""')}"`,
      log.co2Value.toFixed(2)
    ]);
    
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Carbon_Footprint_Logs_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Audio Speech Recognition Setup
  useEffect(() => {
    let recognition: any = null;

    if (isListening) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (!SpeechRecognition) {
        setSpeechFeedback("Voice recognition is not supported in this browser.");
        setIsListening(false);
        return;
      }

      recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.lang = 'en-US';
      recognition.interimResults = false;

      recognition.onstart = () => {
        setSpeechFeedback("Listening for command (e.g. 'vegan meal', 'cycled to work', 'recycled card')...");
      };

      recognition.onerror = (event: any) => {
        console.error("Speech Recognition error: ", event.error);
        setSpeechFeedback(`Speech recognition error: ${event.error}`);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript.toLowerCase();
        setSpeechFeedback(`Heard: "${transcript}"`);
        parseVoiceCommand(transcript);
      };

      recognition.start();
    }

    return () => {
      if (recognition) {
        recognition.abort();
      }
    };
  }, [isListening]);

  // Command parser
  const parseVoiceCommand = (text: string) => {
    // Look for matching keywords to log activities automatically
    if (text.includes('vegan')) {
      onAddLog({ type: 'meal', title: 'Vegan Lunch (Voice)', co2Value: 0.6 });
      setSpeechFeedback("Logged: Vegan Lunch (0.6 kg CO₂ Saved!)");
    } else if (text.includes('veg') || text.includes('vegetarian')) {
      onAddLog({ type: 'meal', title: 'Vegetarian Meal (Voice)', co2Value: 1.1 });
      setSpeechFeedback("Logged: Vegetarian Meal (1.1 kg CO₂)");
    } else if (text.includes('meat') || text.includes('steak') || text.includes('beef') || text.includes('chicken')) {
      onAddLog({ type: 'meal', title: 'Meat Meal (Voice)', co2Value: 3.2 });
      setSpeechFeedback("Logged: Standard Meat Meal (3.2 kg CO₂)");
    } else if (text.includes('cycle') || text.includes('bike') || text.includes('walk') || text.includes('jog')) {
      onAddLog({ type: 'transport', title: 'Active Transit (Voice)', co2Value: 0.0 });
      setSpeechFeedback("Logged: Walked/Cycled Transit (0 kg CO₂ Saved!)");
    } else if (text.includes('bus') || text.includes('train') || text.includes('rail') || text.includes('transit')) {
      onAddLog({ type: 'transport', title: 'Public Transport Route (Voice)', co2Value: 0.5 });
      setSpeechFeedback("Logged: Public Transport (0.5 kg CO₂)");
    } else if (text.includes('drive') || text.includes('car') || text.includes('fuel')) {
      onAddLog({ type: 'transport', title: 'Fuel Car Trip (Voice)', co2Value: 5.2 });
      setSpeechFeedback("Logged: Solitary Car Drive (5.2 kg CO₂)");
    } else if (text.includes('recycle') || text.includes('sorting')) {
      onAddLog({ type: 'waste', title: 'Recycled Waste Paper/Bottle (Voice)', co2Value: -1.2 });
      setSpeechFeedback("Logged: Dynamic Recycling (-1.2 kg CO₂ Saved!)");
    } else if (text.includes('compost') || text.includes('organic waste')) {
      onAddLog({ type: 'waste', title: 'Composted Foods (Voice)', co2Value: -0.6 });
      setSpeechFeedback("Logged: Composted Kitchen Waste (-0.6 kg CO₂ Saved!)");
    } else if (text.includes('unplug') || text.includes('vampire')) {
      onAddLog({ type: 'energy', title: 'Unplugged Vamps (Voice)', co2Value: -0.8 });
      setSpeechFeedback("Logged: Unplugged Appliances (-0.8 kg CO₂ Saved!)");
    } else {
      setSpeechFeedback(`Could not auto-match command "${text}". Try: 'vegan meal', 'cycled to work' or 'recycle'.`);
    }
  };

  return (
    <div id="activity-logger-panel" className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Left Column: Log Controls & Progress Circular Area */}
      <div id="activity-logger-controls" className="lg:col-span-8 space-y-6">
        
        {/* Progress & Quick Header */}
        <div className="bg-white dark:bg-forest-900/40 p-5 rounded-2xl border border-forest-100 dark:border-forest-800/60 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            {/* SVG Cumulative Circular Track */}
            <div className="relative w-24 h-24 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90">
                <circle 
                  cx="48" 
                  cy="48" 
                  r="38" 
                  className="stroke-forest-100 dark:stroke-forest-800" 
                  strokeWidth="8" 
                  fill="transparent"
                />
                <circle 
                  id="budget-circular-progress"
                  cx="48" 
                  cy="48" 
                  r="38" 
                  className={`${getBudgetColor()} transition-all duration-500`}
                  strokeWidth="8" 
                  fill="transparent"
                  strokeDasharray={2 * Math.PI * 38}
                  strokeDashoffset={2 * Math.PI * 38 * (1 - budgetPercentage / 100)}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-xl font-black text-forest-800 dark:text-cream-100">{budgetPercentage}%</span>
                <span className="text-[9px] uppercase tracking-wider text-forest-650 dark:text-sage-300">Of Limit</span>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold text-forest-800 dark:text-cream-100 flex items-center gap-2">
                Daily Carbon Allowance
              </h3>
              <p className="text-xs text-forest-650 dark:text-sage-300 mt-1">
                Your target is to stay below your daily sustainable budget of 
                <strong className="text-forest-700 dark:text-cream-200"> {dailyCo2Budget} kg CO₂</strong>.
              </p>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-sm font-semibold text-forest-700 dark:text-cream-100">
                  Logged: {todayCo2Sum.toFixed(1)} kg CO₂
                </span>
                <span className="text-xs text-forest-400">/</span>
                <span className="text-xs font-medium text-forest-500 dark:text-sage-300">
                  {Math.max(0, parseFloat((dailyCo2Budget - todayCo2Sum).toFixed(1)))} kg left
                </span>
              </div>
            </div>
          </div>

          {/* Voice Input and Exporter Section */}
          <div className="flex flex-col sm:flex-row items-center gap-2 w-full md:w-auto">
            {/* Microphone API Toggle Button */}
            <button
              id="voice-command-logger-btn"
              onClick={() => setIsListening(!isListening)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all w-full sm:w-auto justify-center ${
                isListening 
                  ? 'bg-clay-600 text-white animate-pulse' 
                  : 'bg-forest-100 dark:bg-forest-800 hover:bg-forest-200 text-forest-700 dark:text-cream-100'
              }`}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4 text-forest-500" />}
              {isListening ? 'Stop Listening' : 'Voice Log'}
            </button>

            {/* CSV Export Button */}
            <button
              id="export-csv-btn"
              onClick={handleExportCSV}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-earth-100 dark:bg-forest-800 hover:bg-earth-200 text-forest-700 dark:text-cream-100 transition-colors w-full sm:w-auto justify-center"
              title="Download Logs as CSV"
            >
              <Download className="w-4 h-4 text-earth-600" />
              Export logs
            </button>
          </div>
        </div>

        {/* Voice Recognition Dialog Feedback area */}
        {speechFeedback && (
          <div className="bg-forest-50/70 dark:bg-forest-900/20 p-3 rounded-xl border border-sage-200/50 dark:border-forest-800/40 text-xs flex items-center gap-2 my-2 animate-fade-in text-forest-800 dark:text-cream-200">
            <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
            <span>{speechFeedback}</span>
          </div>
        )}

        {/* Categories Tab Selector */}
        <div className="bg-cream-200 dark:bg-forest-900/60 p-1.5 rounded-xl border border-forest-100 dark:border-forest-800/80 grid grid-cols-4 gap-1">
          {(['meal', 'transport', 'energy', 'waste'] as ActivityType[]).map((cat) => {
            const label = cat.toUpperCase();
            const Icon = cat === 'meal' ? Utensils : cat === 'transport' ? Car : cat === 'energy' ? Zap : Trash2;
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                id={`cat-tab-${cat}`}
                onClick={() => { setActiveCategory(cat); setSelectedPreset(''); }}
                className={`py-2 rounded-lg text-xs font-bold flex flex-col sm:flex-row items-center justify-center gap-1.5 transition-all ${
                  isActive
                    ? 'bg-white dark:bg-forest-800 text-forest-700 dark:text-cream-100 shadow-sm border border-forest-200 dark:border-forest-700'
                    : 'text-forest-650 dark:text-sage-350 hover:bg-white/40 dark:hover:bg-forest-800/30'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-sage-600 dark:text-sage-300' : 'text-forest-400'}`} />
                <span>{label}</span>
              </button>
            );
          })}
        </div>

        {/* Logging selection block */}
        <div className="bg-white dark:bg-forest-900/40 p-5 rounded-2xl border border-forest-100 dark:border-forest-800/60 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-forest-700 dark:text-cream-100">
              Preset Quick Logs ({activeCategory.toUpperCase()})
            </h4>
            <span className="text-[10px] text-forest-500 uppercase tracking-widest">
              Points in green
            </span>
          </div>

          {/* Preset Buttons Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {presets[activeCategory].map((preset, index) => {
              const isSaving = preset.co2 < 0;
              return (
                <button
                  key={index}
                  id={`preset-${activeCategory}-${index}`}
                  onClick={() => handleLogPreset(preset)}
                  className="p-3 bg-cream-50 dark:bg-forest-900/20 text-left rounded-xl border border-forest-100 dark:border-forest-800/50 hover:bg-forest-50 dark:hover:bg-forest-850/40 hover:border-sage-300 dark:hover:border-sage-600 transition-all flex items-center justify-between group focus:outline-none"
                >
                  <div className="space-y-0.5">
                    <span className="text-xs font-semibold text-forest-700 dark:text-cream-100 block group-hover:text-forest-900">
                      {preset.title}
                    </span>
                    <span className="text-[10px] text-forest-500 font-mono">
                      {isSaving ? `${preset.co2} kg CO2` : `+${preset.co2} kg CO2`}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-sage-600 bg-sage-50 dark:bg-forest-800/60 dark:text-sage-200 px-2 py-1 rounded-lg">
                      +{preset.points} XP
                    </span>
                    <div className="p-1 bg-white dark:bg-forest-800 rounded-md border border-forest-100 dark:border-forest-700 group-hover:bg-sage-100 dark:group-hover:bg-forest-700 text-forest-400 group-hover:text-forest-700">
                      <Plus className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <div id="divider" className="border-t border-forest-100 dark:border-forest-800/50 my-6" />

          {/* Form for manual logs */}
          <form onSubmit={handleLogCustom} className="space-y-3">
            <h4 id="custom-log-title" className="text-xs font-extrabold uppercase tracking-widest text-forest-500">
              Manual Custom Log
            </h4>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                id="custom-log-input-title"
                type="text"
                placeholder="E.g., Bought local vegetables from market"
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
                className="flex-1 bg-cream-50 dark:bg-forest-900/30 border border-forest-200 dark:border-forest-850 text-forest-700 dark:text-cream-100 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-sage-500 focus:outline-none"
              />
              <div className="flex items-center gap-2">
                <div className="relative">
                  <input
                    id="custom-log-input-co2"
                    type="number"
                    step="0.1"
                    value={customCo2}
                    onChange={(e) => setCustomCo2(parseFloat(e.target.value) || 0)}
                    className="w-24 bg-cream-50 dark:bg-forest-900/30 border border-forest-200 dark:border-forest-850 text-forest-700 dark:text-cream-100 rounded-xl px-3 py-2 text-xs font-mono text-center focus:ring-1 focus:ring-sage-500 focus:outline-none"
                  />
                  <span className="absolute right-1.5 top-2.5 text-[8px] font-bold text-forest-400">kg CO₂</span>
                </div>
                <button
                  id="custom-log-submit-btn"
                  type="submit"
                  className="bg-forest-600 hover:bg-forest-700 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1 shrink-0 transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  Add log
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Right Column: Mini Today logs list */}
      <div id="today-logs-sidebar" className="lg:col-span-4 space-y-4">
        <div className="bg-white dark:bg-forest-900/40 p-5 rounded-2xl border border-forest-100 dark:border-forest-800/60 shadow-sm h-full flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-forest-100 dark:border-forest-800 pb-2">
              <h4 className="text-sm font-bold text-forest-700 dark:text-cream-100">
                Log History
              </h4>
              <span className="text-[10px] bg-cream-200 dark:bg-forest-800 text-forest-750 px-2 py-0.5 rounded-full font-bold">
                {logs.length} Total
              </span>
            </div>

            {/* List entries with hover animation */}
            <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
              {logs.length === 0 ? (
                <div className="text-center py-10 space-y-2">
                  <AlertCircle className="w-8 h-8 text-forest-400 mx-auto opacity-70" />
                  <p className="text-xs text-forest-650 dark:text-sage-300">
                    Your footprint diary is empty today. Start logging activities using presets above or by voice!
                  </p>
                </div>
              ) : (
                [...logs].reverse().map((log) => {
                  const Icon = log.type === 'meal' ? Utensils : log.type === 'transport' ? Car : log.type === 'energy' ? Zap : Trash2;
                  return (
                    <motion.div
                      id={`log-entry-${log.id}`}
                      key={log.id}
                      whileHover={{ scale: 1.01, x: 2 }} // Hover scale and translation motion requested
                      className="p-3 bg-cream-50/50 dark:bg-forest-900/30 rounded-xl border border-forest-100/80 dark:border-forest-800/40 flex items-center justify-between gap-3 group transition-transform"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="p-1.5 bg-white dark:bg-forest-800 rounded-lg text-forest-600 dark:text-sage-200">
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <span className="text-xs font-semibold text-forest-750 dark:text-cream-200 block truncate max-w-[130px]" title={log.title}>
                            {log.title}
                          </span>
                          <span className="text-[9px] text-forest-400 block font-mono">
                            {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-[10.5px] font-mono font-bold ${log.co2Value <= 0 ? 'text-green-600' : 'text-amber-600'}`}>
                          {log.co2Value <= 0 ? '' : '+'}{log.co2Value.toFixed(1)} kg
                        </span>
                        <button
                          id={`delete-log-${log.id}`}
                          onClick={() => onDeleteLog(log.id)}
                          className="p-1 text-forest-400 hover:text-clay-600 rounded opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity"
                          title="Remove Entry"
                        >
                          <Trash id={`delete-log-icon-${log.id}`} className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-forest-100 dark:border-forest-900 flex justify-between items-center text-[11px] text-forest-550">
            <span>Average Household Daily:</span>
            <span className="font-mono text-red-500 font-bold dark:text-red-400">13.0 kg CO₂</span>
          </div>
        </div>
      </div>
    </div>
  );
}
