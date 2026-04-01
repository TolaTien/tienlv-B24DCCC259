import { Destination, Schedule } from '@/types/travel';

const DESTINATIONS_KEY = 'travel_destinations';
const SCHEDULES_KEY = 'travel_schedules';

// Initial data if localStorage is empty
const INITIAL_DESTINATIONS: Destination[] = [
  {
    id: '1',
    name: 'Vịnh Hạ Long',
    location: 'Quảng Ninh',
    type: 'biển',
    image: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&q=80&w=800',
    description: 'Kỳ quan thiên nhiên thế giới với hàng ngàn đảo đá vôi kỳ vĩ.',
    visitTime: 8,
    costFood: 500000,
    costTransport: 300000,
    costAccommodation: 1000000,
    rating: 4.8,
  },
  {
    id: '2',
    name: 'Fansipan',
    location: 'Lào Cai',
    type: 'núi',
    image: 'https://images.unsplash.com/photo-1589148443310-449e6f31f938?auto=format&fit=crop&q=80&w=800',
    description: 'Nóc nhà Đông Dương, điểm đến lý tưởng cho những người yêu thích leo núi.',
    visitTime: 12,
    costFood: 300000,
    costTransport: 500000,
    costAccommodation: 800000,
    rating: 4.9,
  },
  {
    id: '3',
    name: 'Phố cổ Hội An',
    location: 'Quảng Nam',
    type: 'thành phố',
    image: 'https://images.unsplash.com/photo-1555932331-bf918641ab11?auto=format&fit=crop&q=80&w=800',
    description: 'Đô thị cổ được bảo tồn nguyên vẹn với vẻ đẹp rực rỡ của lồng đèn.',
    visitTime: 6,
    costFood: 400000,
    costTransport: 200000,
    costAccommodation: 600000,
    rating: 4.7,
  },
];

export const TravelService = {
  // Destinations
  getDestinations: (): Destination[] => {
    const data = localStorage.getItem(DESTINATIONS_KEY);
    if (!data) {
      localStorage.setItem(DESTINATIONS_KEY, JSON.stringify(INITIAL_DESTINATIONS));
      return INITIAL_DESTINATIONS;
    }
    return JSON.parse(data);
  },

  saveDestination: (destination: Destination) => {
    const destinations = TravelService.getDestinations();
    const index = destinations.findIndex((d) => d.id === destination.id);
    if (index >= 0) {
      destinations[index] = destination;
    } else {
      destinations.push(destination);
    }
    localStorage.setItem(DESTINATIONS_KEY, JSON.stringify(destinations));
  },

  deleteDestination: (id: string) => {
    const destinations = TravelService.getDestinations();
    const filtered = destinations.filter((d) => d.id !== id);
    localStorage.setItem(DESTINATIONS_KEY, JSON.stringify(filtered));
  },

  // Schedules
  getSchedules: (): Schedule[] => {
    const data = localStorage.getItem(SCHEDULES_KEY);
    return data ? JSON.parse(data) : [];
  },

  saveSchedule: (schedule: Schedule) => {
    const schedules = TravelService.getSchedules();
    const index = schedules.findIndex((s) => s.id === schedule.id);
    if (index >= 0) {
      schedules[index] = schedule;
    } else {
      schedules.push(schedule);
    }
    localStorage.setItem(SCHEDULES_KEY, JSON.stringify(schedules));
  },

  deleteSchedule: (id: string) => {
    const schedules = TravelService.getSchedules();
    const filtered = schedules.filter((s) => s.id !== id);
    localStorage.setItem(SCHEDULES_KEY, JSON.stringify(filtered));
  },
};
