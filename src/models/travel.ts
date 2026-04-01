import { Destination, Schedule } from '@/types/travel';
import { saveToStorage, loadFromStorage, STORAGE_KEYS } from '@/utils/storage';

const DEFAULT_DESTINATIONS: Destination[] = [
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
    name: 'Sa Pa - Fansipan',
    location: 'Lào Cai',
    type: 'núi',
    image: 'https://images.unsplash.com/photo-1505993597083-3bd19f7c1f27?auto=format&fit=crop&q=80&w=800',
    description: 'Nóc nhà Đông Dương, cảnh sắc mây ngàn và ruộng bậc thang hùng vĩ.',
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
    description: 'Đô thị cổ mang vẻ đẹp hoài niệm, lồng đèn rực rỡ và ẩm thực đặc sắc.',
    visitTime: 6,
    costFood: 400000,
    costTransport: 200000,
    costAccommodation: 600000,
    rating: 4.7,
  },
  {
    id: '4',
    name: 'Đà Lạt',
    location: 'Lâm Đồng',
    type: 'thành phố',
    image: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&q=80&w=800',
    description: 'Thành phố ngàn hoa với khí hậu ôn đới quanh năm và nhiều điểm check-in.',
    visitTime: 10,
    costFood: 350000,
    costTransport: 250000,
    costAccommodation: 700000,
    rating: 4.6,
  },
  {
    id: '5',
    name: 'Phú Quốc',
    location: 'Kiên Giang',
    type: 'biển',
    image: 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&q=80&w=800',
    description: 'Đảo ngọc với những bãi biển xanh ngắt và dịch vụ nghỉ dưỡng cao cấp.',
    visitTime: 15,
    costFood: 600000,
    costTransport: 400000,
    costAccommodation: 1500000,
    rating: 4.8,
  },
];

const DEFAULT_SCHEDULES: Schedule[] = [
  {
    id: 's1',
    name: 'Chuyến đi miền Bắc',
    startDate: '2024-05-01',
    endDate: '2024-05-03',
    totalBudget: 5000000,
    createdAt: '2024-04-10T10:00:00Z',
    days: [
      { day: 1, destinations: ['1'] },
      { day: 2, destinations: ['2'] },
      { day: 3, destinations: [] },
    ],
  },
];

interface TravelState {
  destinations: Destination[];
  schedules: Schedule[];
}

interface TravelAction {
  type: string;
  payload?: any;
}

const loadDestinations = (): Destination[] => {
  return loadFromStorage<Destination>(STORAGE_KEYS.TRAVEL_DESTINATIONS) || DEFAULT_DESTINATIONS;
};

const loadSchedules = (): Schedule[] => {
  return loadFromStorage<Schedule>(STORAGE_KEYS.TRAVEL_SCHEDULES) || DEFAULT_SCHEDULES;
};

const initialState: TravelState = {
  destinations: loadDestinations(),
  schedules: loadSchedules(),
};

export default {
  namespace: 'travel',
  state: initialState,
  reducers: {
    setDestinations(state: TravelState, action: TravelAction) {
      const newList = action.payload;
      saveToStorage(STORAGE_KEYS.TRAVEL_DESTINATIONS, newList);
      return { ...state, destinations: newList };
    },
    addDestination(state: TravelState, action: TravelAction) {
      const newList = [...state.destinations, action.payload];
      saveToStorage(STORAGE_KEYS.TRAVEL_DESTINATIONS, newList);
      return { ...state, destinations: newList };
    },
    updateDestination(state: TravelState, action: TravelAction) {
      const newList = state.destinations.map(d => d.id === action.payload.id ? action.payload : d);
      saveToStorage(STORAGE_KEYS.TRAVEL_DESTINATIONS, newList);
      return { ...state, destinations: newList };
    },
    deleteDestination(state: TravelState, action: TravelAction) {
      const newList = state.destinations.filter(d => d.id !== action.payload);
      saveToStorage(STORAGE_KEYS.TRAVEL_DESTINATIONS, newList);
      return { ...state, destinations: newList };
    },
    setSchedules(state: TravelState, action: TravelAction) {
      const newList = action.payload;
      saveToStorage(STORAGE_KEYS.TRAVEL_SCHEDULES, newList);
      return { ...state, schedules: newList };
    },
    saveSchedule(state: TravelState, action: TravelAction) {
      const schedule = action.payload;
      const index = state.schedules.findIndex(s => s.id === schedule.id);
      let newList;
      if (index >= 0) {
        newList = state.schedules.map(s => s.id === schedule.id ? schedule : s);
      } else {
        newList = [...state.schedules, schedule];
      }
      saveToStorage(STORAGE_KEYS.TRAVEL_SCHEDULES, newList);
      return { ...state, schedules: newList };
    },
    deleteSchedule(state: TravelState, action: TravelAction) {
      const newList = state.schedules.filter(s => s.id !== action.payload);
      saveToStorage(STORAGE_KEYS.TRAVEL_SCHEDULES, newList);
      return { ...state, schedules: newList };
    },
  },
};
