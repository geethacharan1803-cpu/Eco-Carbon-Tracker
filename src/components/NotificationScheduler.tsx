import { useState } from 'react';
import { Bell, Clock, ShieldCheck, Sparkles, Sliders, Play } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function NotificationScheduler() {
  const [isEnabled, setIsEnabled] = useState<boolean>(true);
  const [reminderTime, setReminderTime] = useState<string>('20:00');
  const [selectedDays, setSelectedDays] = useState<string[]>(['Mon', 'Tue', 'Wed', 'Thu', 'Fri']);
  const [permissionStatus, setPermissionStatus] = useState<string>('default');
  const [testNotificationActive, setTestNotificationActive] = useState<boolean>(false);

  const toggleDay = (day: string) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter(d => d !== day));
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  const handleRequestPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      setPermissionStatus(permission);
      if (permission === 'granted') {
        new Notification("Eco Carbon Tracker", {
          body: "Daily logging schedules successfully established!",
          icon: "/favicon.ico"
        });
      }
    } else {
      setPermissionStatus('unsupported');
    }
  };

  const triggerTestAlert = () => {
    // Show a beautiful client-side floating overlay mock notification
    setTestNotificationActive(true);
    setTimeout(() => {
      setTestNotificationActive(false);
    }, 4500);

    // Also attempt native notification if allowed
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification("Eco Carbon Tracker Reminder", {
        body: "Have you logged your meals or commute today? Stay inside your carbon budget!",
        badge: "/favicon.ico"
      });
    }
  };

  return (
    <div id="notification-scheduler-panel" className="bg-white dark:bg-forest-900/40 p-6 rounded-2xl border border-forest-100 dark:border-forest-800/60 shadow-sm space-y-6 relative overflow-hidden">
      
      {/* Floating Mock Notification Toast */}
      <AnimatePresence>
        {testNotificationActive && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="absolute top-4 right-4 bg-forest-800 dark:bg-forest-950 text-white p-4 rounded-xl shadow-xl border border-sage-500 z-50 flex items-start gap-3 max-w-sm"
          >
            <div className="p-1.5 bg-sage-500 rounded-lg text-white">
              <Bell className="w-5 h-5 animate-bounce" />
            </div>
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-amber-305">Daily Tracker Agent</span>
                <span className="text-[9px] text-zinc-400 font-mono">Just Now</span>
              </div>
              <p className="text-[11px] text-zinc-100 leading-normal font-semibold">
                🔔 Time to log! Did you walk, recycle, or eat green today? Accumulate your Daily Streak!
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-forest-100 dark:border-forest-800 pb-4">
        <div className="space-y-1">
          <h3 className="text-base font-bold text-forest-750 dark:text-cream-100 flex items-center gap-2">
            <Bell className="w-5 h-5 text-amber-500" />
            Notification Scheduler
          </h3>
          <p className="text-xs text-forest-550">
            Automate tracking prompts to make sustainable accountability a seamless daily habit
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-forest-650">Schedules:</span>
          <button
            id="scheduler-toggle"
            onClick={() => setIsEnabled(!isEnabled)}
            className={`w-11 h-6 rounded-full p-1 transition-colors cursor-pointer ${
              isEnabled ? 'bg-forest-600' : 'bg-forest-200 dark:bg-forest-800'
            }`}
          >
            <div className={`bg-white w-4 h-4 rounded-full shadow-sm transition-transform ${
              isEnabled ? 'translate-x-5' : 'translate-x-0'
            }`} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Time Selector and Frequency Selection */}
        <div className={`space-y-4 ${isEnabled ? '' : 'opacity-50 pointer-events-none'}`}>
          <div className="flex items-center gap-3">
            <Clock className="w-4.5 h-4.5 text-sage-650" />
            <h4 className="text-xs font-black uppercase tracking-wider text-forest-550">
              Reminder Frequency
            </h4>
          </div>

          <div className="flex gap-2">
            {/* Hour Time Input */}
            <input
              id="reminder-time-input"
              type="time"
              value={reminderTime}
              onChange={(e) => setReminderTime(e.target.value)}
              className="bg-cream-50 dark:bg-forest-900/40 border border-forest-200 dark:border-forest-850 text-forest-800 dark:text-cream-100 font-mono font-bold text-lg rounded-xl px-4 py-2.5 focus:ring-1 focus:ring-sage-500 focus:outline-none"
            />
            <span className="text-xs text-forest-450 self-center font-medium leading-tight">
              A gentle prompt is queued for delivery every scheduled day.
            </span>
          </div>

          {/* Days of the week selection matrix */}
          <div className="flex gap-2 max-w-full overflow-x-auto py-1">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => {
              const isActive = selectedDays.includes(day);
              return (
                <button
                  key={day}
                  id={`scheduler-day-${day}`}
                  onClick={() => toggleDay(day)}
                  className={`w-10 h-10 rounded-xl text-xs font-bold border transition-all flex items-center justify-center cursor-pointer shrink-0 ${
                    isActive
                      ? 'bg-forest-50 border-forest-500 text-forest-750 dark:bg-forest-800'
                      : 'bg-cream-10/20 dark:bg-forest-900/10 border-forest-100 dark:border-forest-850 text-forest-400'
                  }`}
                >
                  {day[0]}
                </button>
              );
            })}
          </div>
        </div>

        {/* Browser Alert Permissions System */}
        <div className="bg-cream-50/50 dark:bg-forest-950/20 p-4 rounded-xl border border-forest-100 dark:border-forest-850 flex flex-col justify-between gap-4">
          <div className="space-y-2">
            <h4 className="text-xs font-black uppercase tracking-wider text-forest-520 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-green-600" />
              Sustainer Alert Clearance
            </h4>
            <p className="text-[11px] text-forest-650 dark:text-sage-350 leading-relaxed">
              To send direct notifications to your desktop or device web shell, this tracker requires standard prompt clearances.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 mt-2">
            <button
              id="grant-alert-permit-btn"
              onClick={handleRequestPermission}
              className="px-4 py-2 bg-forest-600 hover:bg-forest-700 text-white font-bold rounded-xl text-xs flex-1 transition-colors cursor-pointer"
            >
              Request Permit
            </button>
            <button
              id="test-scheduler-alert-btn"
              onClick={triggerTestAlert}
              disabled={!isEnabled}
              className="px-4 py-2 bg-cream-100 hover:bg-cream-205 dark:bg-forest-800 border border-forest-200 dark:border-forest-700 text-forest-700 dark:text-cream-200 font-bold rounded-xl text-xs flex items-center justify-center gap-1 transition-colors disabled:opacity-40 cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 text-forest-600" />
              Simulate Alert
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
