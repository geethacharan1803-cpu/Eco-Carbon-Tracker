import React, { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Tip } from '../types';
import { Sparkles, ArrowRight, ArrowLeft, Volume2, VolumeX, MessageSquare, Send, Check } from 'lucide-react';

interface AssistantSageProps {
  tips: Tip[];
}

export default function AssistantSage({ tips }: AssistantSageProps) {
  const [currentTipIndex, setCurrentTipIndex] = useState<number>(0);
  const [inputText, setInputText] = useState<string>('');
  const [conversations, setConversations] = useState<Array<{ sender: 'user' | 'sage'; text: string }>>([
    {
      sender: 'sage',
      text: "Hello! I am Sage, your eco-conscious assistant companion. Ask me anything about how to streamline your energy use, transition to public transit, source sustainable produce, or understand your weekly carbon footprints!"
    }
  ]);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  // Carousel controls
  const handleNextTip = () => {
    setCurrentTipIndex((prev) => (prev + 1) % tips.length);
  };

  const handlePrevTip = () => {
    setCurrentTipIndex((prev) => (prev - 1 + tips.length) % tips.length);
  };

  // Text To Speech implementation
  const handleSpeak = (text: string) => {
    if ('speechSynthesis' in window) {
      if (isSpeaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
        return;
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      
      setIsSpeaking(true);
      window.speechSynthesis.speak(utterance);
    } else {
      alert("Text-to-speech is not supported in this browser.");
    }
  };

  // Q&A Answers list
  const getSageResponse = (question: string): string => {
    const qLower = question.toLowerCase();
    if (qLower.includes('meat') || qLower.includes('diet') || qLower.includes('food')) {
      return "Transitioning to plant-based options is a critical action. Food consumption represents ~25% of global emissions. Replacing one beef burger with a black bean alternative prevents approx 3.2 kg of CO₂, which matches fully recharging a mobile device 400 times!";
    }
    if (qLower.includes('car') || qLower.includes('drive') || qLower.includes('fly') || qLower.includes('transport')) {
      return "Commutes are major sources of emissions. Averaging 22 mpg, normal passenger vehicles emit 0.404 kg CO₂ per mile driven. Utilizing rails, trains, electrical buses, or light bikes reduces commuter impact on standard corridors by over 85% per mile!";
    }
    if (qLower.includes('energy') || qLower.includes('light') || qLower.includes('power') || qLower.includes('heating')) {
      return "Over 35% of household energy is phantom drain or vampire pull. Unplugging inactive game consoles, sound bars, and chargers saves up to 45 kg of CO₂ per year. Lowering your room thermostat comfort setpoint by 1°C prevents over 120 kg CO₂ annually.";
    }
    if (qLower.includes('recycle') || qLower.includes('waste') || qLower.includes('plastic')) {
      return "Recycling is excellent, but minimizing packaging extraction works better. Every kg of virgin single-use plastic produces 5 kg CO₂ during fabrication. Opting for bulk containers, composting food residues, and reusing water bottles prevents heavy landfill loads.";
    }
    if (qLower.includes('points') || qLower.includes('badges')) {
      return "Tracking is gamified here to establish green habits! You receive +15 to +30 points for logging eco actions or completing monthly pledges. You score custom medals like 'Energy Saver Pro' as you cross milestone points thresholds!";
    }
    return "That's an interesting question! Understanding carbon offset potentials is the first step. Generally, focus on simple high-impact pivots first: eating meat-free lunches, walking journeys under 2 miles, utilizing cold laundry, and composting vegetable clippings.";
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userText = inputText;
    const newConvs = [...conversations, { sender: 'user', text: userText } as const];
    setConversations(newConvs);
    setInputText('');

    // Simulate Sage thinking and replying
    setTimeout(() => {
      const sageReply = getSageResponse(userText);
      setConversations([...newConvs, { sender: 'sage', text: sageReply } as const]);
    }, 600);
  };

  const activeTip = tips[currentTipIndex];

  return (
    <div id="sage-assistant-view" className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      
      {/* Left Column: Carousel of Actionable Sustainability Tips based on activities */}
      <div className="lg:col-span-5 space-y-4 flex flex-col justify-between h-full">
        <div className="bg-white dark:bg-forest-900/40 p-5 rounded-2xl border border-forest-100 dark:border-forest-800/60 shadow-sm flex-1 flex flex-col justify-between min-h-[340px]">
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-forest-100 dark:border-forest-800 pb-2">
              <span className="text-[10px] uppercase tracking-wider font-extrabold text-sage-650 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-spin" />
                Active Sustainability Tips
              </span>
              <span className="text-[10px] font-bold text-forest-405 font-mono">
                {currentTipIndex + 1} / {tips.length}
              </span>
            </div>

            {/* Simulated Carousel display */}
            <div className="min-h-[140px] flex flex-col justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTip.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-3"
                >
                  <span className="text-[9px] uppercase tracking-widest font-extrabold bg-sage-100 dark:bg-forest-805 text-sage-700 dark:text-sage-250 px-2 py-0.5 rounded-md">
                    Category: {activeTip.category.toUpperCase()}
                  </span>
                  
                  <p className="text-sm font-semibold text-forest-800 dark:text-cream-100 leading-relaxed">
                    {activeTip.text}
                  </p>

                  <div className="bg-cream-50 dark:bg-forest-950/20 px-3 py-2.5 rounded-xl border border-forest-150 dark:border-forest-800 flex items-center gap-2">
                    <span className="text-[10px] font-extrabold text-forest-550 uppercase">Savings index:</span>
                    <span className="text-xs font-black text-green-650 dark:text-green-450">{activeTip.savingEstimate}</span>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Carousel controls */}
          <div className="flex justify-between items-center pt-4 border-t border-forest-100 dark:border-forest-800 mt-4">
            <div className="flex gap-1">
              <button
                id="tip-prev-btn"
                onClick={handlePrevTip}
                className="p-1.5 rounded-lg bg-cream-50 hover:bg-cream-205 dark:bg-forest-800 dark:hover:bg-forest-750 text-forest-500 transition-colors border border-forest-100 dark:border-forest-750 cursor-pointer"
                title="Previous Tip"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <button
                id="tip-next-btn"
                onClick={handleNextTip}
                className="p-1.5 rounded-lg bg-cream-50 hover:bg-cream-205 dark:bg-forest-800 dark:hover:bg-forest-750 text-forest-500 transition-colors border border-forest-100 dark:border-forest-750 cursor-pointer"
                title="Next Tip"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Read aloud option for active tip */}
            <button
              id="speak-tip-btn"
              onClick={() => handleSpeak(`${activeTip.text}. Saving estimate, ${activeTip.savingEstimate}`)}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-[11px] font-bold bg-forest-100 dark:bg-forest-800 text-forest-750 dark:text-cream-100 hover:bg-forest-200 transition-colors cursor-pointer"
            >
              {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
              {isSpeaking ? 'Mute' : 'Speak Tip'}
            </button>
          </div>
        </div>
      </div>

      {/* Right Column: Q&A Dialog Box with Speech Synthesis Option */}
      <div className="lg:col-span-7 space-y-4">
        <div className="bg-white dark:bg-forest-900/40 p-5 rounded-2xl border border-forest-100 dark:border-forest-800/60 shadow-sm h-[340px] flex flex-col justify-between">
          <div className="flex justify-between items-center border-b border-forest-100 dark:border-forest-800 pb-2.5">
            <h4 className="text-sm font-bold text-forest-750 dark:text-cream-150 flex items-center gap-2">
              <MessageSquare className="w-4.5 h-4.5 text-sage-600" />
              Ask Sage
            </h4>
            <span className="text-[10px] text-forest-450 uppercase tracking-widest font-bold">
              AI Guide Companion
            </span>
          </div>

          {/* Dialog bubble logs list */}
          <div className="flex-1 overflow-y-auto space-y-3 py-3 pr-1">
            {conversations.map((msg, index) => {
              const isSage = msg.sender === 'sage';
              return (
                <div
                  key={index}
                  className={`flex ${isSage ? 'justify-start' : 'justify-end'}`}
                >
                  <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                    isSage 
                      ? 'bg-cream-50 dark:bg-forest-950 text-forest-800 dark:text-cream-200 rounded-bl-none border border-forest-100 dark:border-forest-900/60' 
                      : 'bg-forest-600 text-white rounded-br-none shadow-sm'
                  }`}>
                    <p>{msg.text}</p>
                    {isSage && (
                      <button
                        onClick={() => handleSpeak(msg.text)}
                        className="mt-2 text-[10px] font-bold text-sage-650 dark:text-sage-350 hover:underline flex items-center gap-1 focus:outline-none"
                      >
                        <Volume2 className="w-3 h-3" /> Speak reply
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Prompt Entry Form */}
          <form onSubmit={handleSendMessage} className="flex gap-2 pt-2 border-t border-forest-100 dark:border-forest-800">
            <input
              id="sage-user-input"
              type="text"
              placeholder="Ask: 'diet impact', 'commute advice', 'unplug tips'..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 bg-cream-50 dark:bg-forest-900/40 border border-forest-200 dark:border-forest-850 text-forest-800 dark:text-cream-100 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-sage-500 focus:outline-none"
            />
            <button
              id="sage-send-btn"
              type="submit"
              className="bg-forest-600 hover:bg-forest-700 text-white px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors shrink-0 flex items-center gap-1 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              Ask
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
