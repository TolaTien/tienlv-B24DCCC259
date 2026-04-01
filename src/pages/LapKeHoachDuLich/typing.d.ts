export declare namespace TravelPlan {
  export interface Destination {
    id: string;
    name: string;
    image: string;
    location: string;
    rating: number;
    type: 'beach' | 'mountain' | 'city';
    description: string;
    visitTime: number; // in hours
    costFood: number;
    costStay: number;
    costTravel: number;
    price: number; // average total price per person
  }

  export interface ItineraryItem {
    id: string;
    destinationId: string;
    day: number;
    order: number;
  }

  export interface Itinerary {
    id: string;
    name: string;
    items: ItineraryItem[];
    totalBudget: number;
    startDate: string;
    createdAt: string;
  }

  export interface BudgetCategory {
    name: string;
    value: number;
  }
}
