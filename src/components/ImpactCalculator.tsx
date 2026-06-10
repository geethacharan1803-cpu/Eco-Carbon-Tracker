import { useState } from 'react';
import { motion } from 'motion/react';
import { 
  TreeDeciduous, 
  Car, 
  Smartphone, 
  Flame, 
  Sliders, 
  UtensilsCrossed, 
  Thermometer, 
  Tv, 
  Wind,
  Check
} from 'lucide-react';

export default function ImpactCalculator() {
  // Slider states
  const [veganMeals, setVeganMeals] = useState<number>(3); // meals/week
  const [commuteMiles, setCommuteMiles] = useState<number>(30); // miles/week
  const [thermostatDegrees, setThermostatDegrees] = useState<number>(1); // degrees reduced
  const [unpluggedDevices, setUnpluggedDevices] = useState<number>(5); // count
  const [coldWashes, setColdWashes] = useState<number>(2); // laundry cycles/week

  // Calculate CO2 savings (kg per week)
  const veganSaving = veganMeals * 2.6; // 2.6kg saved per meat replacement
  const commuteSaving = commuteMiles * 0.4; // 0.4kg saved per driving mile
  const thermostatSaving = thermostatDegrees * 2.8; // 2.8kg saved per degree
  const unpluggedSaving = unpluggedDevices * 0.2; // 0.2kg saved per phantom unplug
  const coldWashSaving = coldWashes * 0.55; // 0.55kg saved per warm cycle skipped

  const weeklySaving = veganSaving + commuteSaving + thermostatSaving + unpluggedSaving + coldWashSaving;
  const annualSaving = weeklySaving * 52;

  // Equivalencies (annual)
  const treesPlantedEquivalent = Math.round(annualSaving / 22);
  const flightCancelledEquivalent = (annualSaving / 800).toFixed(2); // Avg short flight: 800kg
  const carMilesEquivalent = Math.round(annualSaving / 0.4);

  return (
    <div id="impact-calculator-view" className="bg-white dark:bg-forest-900/40 p-6 rounded-2xl border border-forest-100 dark:border-forest-800/60 shadow-sm space-y-6">
      <div className="flex items-center gap-2 border-b border-forest-100 dark:border-forest-800 pb-3">
        <Sliders className="w-5 h-5 text-earth-500" />
        <div>
          <h3 className="text-base font-bold text-forest-750 dark:text-cream-100">
            Eco Impact Simulator
          </h3>
          <p className="text-xs text-forest-550">
            Slide and adjust hypothetical changes to calculate potential CO₂ savings instantly
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Sliders Input Area */}
        <div className="lg:col-span-7 space-y-5">
          {/* Slider 1: Vegan meals */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <span className="flex items-center gap-1.5 text-forest-750 dark:text-cream-150">
                <UtensilsCrossed className="w-4 h-4 text-green-500" />
                Meat-free Meals
              </span>
              <span className="text-sage-700 dark:text-sage-350">{veganMeals} meals/week</span>
            </div>
            <input
              id="slider-vegan-meals"
              type="range"
              min="0"
              max="21"
              value={veganMeals}
              onChange={(e) => setVeganMeals(parseInt(e.target.value))}
              className="w-full accent-sage-500 bg-cream-100 dark:bg-forest-800 h-2 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-forest-400">
              <span>0 meals</span>
              <span>Replaces beef/pork with vegetarian meals</span>
              <span>21 meals</span>
            </div>
          </div>

          {/* Slider 2: Commuting replaced */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <span className="flex items-center gap-1.5 text-forest-750 dark:text-cream-150">
                <Car className="w-4 h-4 text-earth-500" />
                Commuter Transit Replaced
              </span>
              <span className="text-sage-700 dark:text-sage-350">{commuteMiles} miles/week</span>
            </div>
            <input
              id="slider-commute-miles"
              type="range"
              min="0"
              max="150"
              value={commuteMiles}
              onChange={(e) => setCommuteMiles(parseInt(e.target.value))}
              className="w-full accent-sage-500 bg-cream-100 dark:bg-forest-800 h-2 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-forest-400">
              <span>0 miles</span>
              <span>Switch car drive to walk, bike, or train</span>
              <span>150 miles</span>
            </div>
          </div>

          {/* Slider 3: Thermostat */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <span className="flex items-center gap-1.5 text-forest-750 dark:text-cream-150">
                <Thermometer className="w-4 h-4 text-amber-500" />
                Thermostat Setback
              </span>
              <span className="text-sage-700 dark:text-sage-350">↓ {thermostatDegrees}°C offset</span>
            </div>
            <input
              id="slider-thermostat-degrees"
              type="range"
              min="0"
              max="5"
              value={thermostatDegrees}
              onChange={(e) => setThermostatDegrees(parseInt(e.target.value))}
              className="w-full accent-sage-500 bg-cream-100 dark:bg-forest-800 h-2 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-forest-400">
              <span>No change</span>
              <span>Lower winter heating or raise summer air conditioning</span>
              <span>5°C setback</span>
            </div>
          </div>

          {/* Slider 4: Unplugged Devices */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <span className="flex items-center gap-1.5 text-forest-750 dark:text-cream-150">
                <Tv className="w-4 h-4 text-blue-500" />
                Power Strip Vamps Unplugged
              </span>
              <span className="text-sage-700 dark:text-sage-350">{unpluggedDevices} appliances</span>
            </div>
            <input
              id="slider-unplugged-devices"
              type="range"
              min="0"
              max="15"
              value={unpluggedDevices}
              onChange={(e) => setUnpluggedDevices(parseInt(e.target.value))}
              className="w-full accent-sage-500 bg-cream-100 dark:bg-forest-800 h-2 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-forest-400">
              <span>0 devices</span>
              <span>Unplug TVs, chargers, routers when away</span>
              <span>15 devices</span>
            </div>
          </div>

          {/* Slider 5: Cold Wash Skipped */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <span className="flex items-center gap-1.5 text-forest-750 dark:text-cream-150">
                <Wind className="w-4 h-4 text-teal-500" />
                Cold Water Laundry Loads
              </span>
              <span className="text-sage-700 dark:text-sage-350">{coldWashes} loads/week</span>
            </div>
            <input
              id="slider-cold-washes"
              type="range"
              min="0"
              max="10"
              value={coldWashes}
              onChange={(e) => setColdWashes(parseInt(e.target.value))}
              className="w-full accent-sage-500 bg-cream-100 dark:bg-forest-800 h-2 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-forest-400">
              <span>Hot only</span>
              <span>Wash on cold/eco settings & line-dry clothes</span>
              <span>10 loads</span>
            </div>
          </div>
        </div>

        {/* Dynamic Calculation Output & Equivalents Display */}
        <div className="lg:col-span-5 bg-cream-50/50 dark:bg-forest-950/20 p-5 rounded-2xl border border-forest-100 dark:border-forest-800/80 flex flex-col justify-between">
          <div className="space-y-4">
            <h4 className="text-xs font-black uppercase tracking-widest text-forest-550">
              Simulated CO₂ Reductions
            </h4>
            
            <div className="bg-white dark:bg-forest-900 border border-forest-100 dark:border-forest-800 p-4 rounded-xl shadow-sm space-y-1">
              <span className="text-[10px] text-forest-500 font-bold block uppercase tracking-wider">
                Weekly Savings
              </span>
              <span className="text-3xl font-black text-slate-800 dark:text-cream-100 block">
                {weeklySaving.toFixed(1)} <span className="text-lg font-normal">kg CO₂</span>
              </span>
            </div>

            <div className="bg-forest-50 dark:bg-forest-850 border border-sage-200 dark:border-forest-700 p-4 rounded-xl shadow-sm space-y-1">
              <span className="text-[10px] text-forest-600 dark:text-sage-200 font-bold block uppercase tracking-wider">
                Projected Annual Savings
              </span>
              <span className="text-3xl font-black text-forest-700 dark:text-cream-100 block">
                {annualSaving.toFixed(0)} <span className="text-lg font-normal">kg CO₂ / yr</span>
              </span>
            </div>

            {/* Visual Equivalent widgets */}
            <div className="space-y-2.5 pt-2">
              <span className="text-[10px] text-forest-400 font-bold block uppercase">
                Tangible Equivalents (Each Year)
              </span>

              {/* Equiv 1: Trees */}
              <div className="flex items-center gap-3 bg-white dark:bg-forest-900 p-3 rounded-lg border border-forest-100 dark:border-forest-800">
                <div className="p-2 bg-green-50 dark:bg-forest-800 rounded-lg text-green-600 dark:text-sage-200">
                  <TreeDeciduous className="w-4 h-4" />
                </div>
                <div className="text-xs">
                  <span className="font-bold text-forest-700 dark:text-cream-100 block">
                    {treesPlantedEquivalent} Mature Trees
                  </span>
                  <span className="text-[10px] text-forest-400">
                    Required planting to absorb this carbon amount.
                  </span>
                </div>
              </div>

              {/* Equiv 2: Miles driven */}
              <div className="flex items-center gap-3 bg-white dark:bg-forest-900 p-3 rounded-lg border border-forest-100 dark:border-forest-800">
                <div className="p-2 bg-earth-100 dark:bg-forest-800 rounded-lg text-earth-700 dark:text-cream-200">
                  <Car className="w-4 h-4" />
                </div>
                <div className="text-xs">
                  <span className="font-bold text-forest-700 dark:text-cream-100 block">
                    {carMilesEquivalent.toLocaleString()} Driving Miles Avoided
                  </span>
                  <span className="text-[10px] text-forest-400">
                    Equivalent tailpipe emissions from normal sedans.
                  </span>
                </div>
              </div>

              {/* Equiv 3: Flights */}
              <div className="flex items-center gap-3 bg-white dark:bg-forest-900 p-3 rounded-lg border border-forest-100 dark:border-forest-800">
                <div className="p-2 bg-blue-50 dark:bg-forest-800 rounded-lg text-blue-500 dark:text-cream-100">
                  <Wind className="w-4 h-4" />
                </div>
                <div className="text-xs">
                  <span className="font-bold text-forest-700 dark:text-cream-100 block">
                    {flightCancelledEquivalent} Short Flights Cancelled
                  </span>
                  <span className="text-[10px] text-forest-400">
                    Transatlantic flight emissions avoided.
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-forest-100 dark:border-forest-800 text-[10px] text-forest-500 flex items-center gap-1.5 mt-4">
            <Check className="w-3.5 h-3.5 text-green-500" />
            <span>These calculations use EPA carbon index database references.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
