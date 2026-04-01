export type DestinationType = 'biển' | 'núi' | 'thành phố';

export interface Destination {
  id: string;
  name: string;
  location: string;
  type: DestinationType;
  image: string;
  description: string;
  visitTime: number; // in hours
  costFood: number;
  costTransport: number;
  costAccommodation: number;
  rating: number;
}

export interface DaySchedule {
  day: number;
  destinations: string[]; // array of destination ids
}

export interface Schedule {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  days: DaySchedule[];
  totalBudget: number;
  createdAt: string;
}

export interface BudgetAllocation {
  category: string;
  amount: number;
}
