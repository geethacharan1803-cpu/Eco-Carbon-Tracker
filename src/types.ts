export type ActivityType = 'meal' | 'transport' | 'energy' | 'waste';

export interface ActivityLog {
  id: string;
  type: ActivityType;
  title: string;
  co2Value: number; // in kg CO2
  timestamp: string; // ISO String
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  iconName: string;
  unlockedAt: string | null;
  category: string;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  targetUnit: string;
  targetValue: number;
  currentValue: number;
  pointsReward: number;
  joined: boolean;
  completed: boolean;
  category: string;
  participants: number;
}

export interface Pledge {
  id: string;
  title: string;
  description: string;
  co2Reduction: number; // kg per month
  enrolled: boolean;
  completed: boolean;
  durationDays: number;
  daysPassed: number;
  category?: string; // e.g. 'Energy', 'Diet', 'Waste', 'Transport'
}

export interface HubLocation {
  id: string;
  name: string;
  type: 'recycling' | 'transport' | 'eco_shop' | 'garden';
  address: string;
  coordinates: { x: number; y: number }; // Percentage coords on interactive SVG map (0-100)
  details: string;
  hours: string;
  savingsPotential: number; // in kg CO2 offset potential
}

export interface Tip {
  id: string;
  category: string;
  text: string;
  savingEstimate: string;
}
