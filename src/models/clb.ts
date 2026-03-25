import type { IClub } from '@/types';
import { saveToStorage, loadFromStorage, STORAGE_KEYS } from '@/utils/storage';

interface ClbState {
  list: IClub[];
  total: number;
  loading: boolean;
  current?: IClub;
}

interface ClbAction {
  type: string;
  payload?: any;
}

const defaultData: IClub[] = [
  {
    id: '1',
    name: 'CLB Guitar',
    description: '<p>Yêu âm nhạc, chia sẻ đam mê</p>',
    leader: 'Nguyễn Văn A',
    foundedDate: '2023-01-01',
    active: true,
    createdAt: '2023-01-01',
    avatar: '',
    memberCount: 5,
  },
  {
    id: '2',
    name: 'CLB Lập trình',
    description: '<p>Code is life, coder forever</p>',
    leader: 'Trần Văn B',
    foundedDate: '2023-02-15',
    active: true,
    createdAt: '2023-02-15',
    avatar: '',
    memberCount: 12,
  },
];

// Load initial data from localStorage or use default
const loadInitialData = (): IClub[] => {
  const savedData = loadFromStorage<IClub>(STORAGE_KEYS.CLUBS);
  return savedData || defaultData;
};

const initialState: ClbState = {
  list: loadInitialData(),
  total: 2,
  loading: false,
};

export default {
  namespace: 'clb',
  state: initialState,
  reducers: {
    setClubList(state: ClbState, action: ClbAction) {
      const newList = action.payload;
      saveToStorage(STORAGE_KEYS.CLUBS, newList);
      return {
        ...state,
        list: newList,
        total: newList.length,
      };
    },
    addClub(state: ClbState, action: ClbAction) {
      const newClub = { ...action.payload, id: Date.now().toString() };
      const newList = [...state.list, newClub];
      saveToStorage(STORAGE_KEYS.CLUBS, newList);
      return {
        ...state,
        list: newList,
        total: state.total + 1,
      };
    },
    updateClub(state: ClbState, action: ClbAction) {
      const newList = state.list.map((club) =>
        club.id === action.payload.id ? { ...club, ...action.payload } : club
      );
      saveToStorage(STORAGE_KEYS.CLUBS, newList);
      return {
        ...state,
        list: newList,
      };
    },
    deleteClub(state: ClbState, action: ClbAction) {
      const newList = state.list.filter((club) => club.id !== action.payload);
      saveToStorage(STORAGE_KEYS.CLUBS, newList);
      return {
        ...state,
        list: newList,
        total: state.total - 1,
      };
    },
    setCurrentClub(state: ClbState, action: ClbAction) {
      return {
        ...state,
        current: action.payload,
      };
    },
  },
  effects: {},
  subscriptions: {},
};

