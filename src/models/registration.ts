import type { IRegistration } from '@/types';
import { saveToStorage, loadFromStorage, STORAGE_KEYS } from '@/utils/storage';

interface RegistrationState {
  list: IRegistration[];
  total: number;
  loading: boolean;
  current?: IRegistration;
}

interface RegistrationAction {
  type: string;
  payload?: any;
}

const defaultData: IRegistration[] = [
  {
    id: '1',
    fullName: 'Lê Minh Hùng',
    email: 'hung@example.com',
    phone: '0912345678',
    gender: 'Male',
    address: '123 Đường Lê Lợi',
    skills: 'Chơi guitar, có kinh nghiệm 2 năm',
    clubId: '1',
    reason: 'Tôi yêu thích âm nhạc',
    status: 'Pending',
    history: [],
    createdAt: '2025-04-09',
  },
  {
    id: '2',
    fullName: 'Phạm Thị Hoa',
    email: 'hoa@example.com',
    phone: '0987654321',
    gender: 'Female',
    address: '456 Đường Trần Hưng Đạo',
    skills: 'Lập trình JavaScript, React',
    clubId: '2',
    reason: 'Muốn học hỏi thêm và chia sẻ kiến thức',
    status: 'Pending',
    history: [],
    createdAt: '2025-04-08',
  },
];

// Load initial data from localStorage or use default
const loadInitialData = (): IRegistration[] => {
  const savedData = loadFromStorage<IRegistration>(STORAGE_KEYS.REGISTRATIONS);
  return savedData || defaultData;
};

const initialState: RegistrationState = {
  list: loadInitialData(),
  total: 2,
  loading: false,
};

export default {
  namespace: 'registration',
  state: initialState,
  reducers: {
    setRegistrationList(state: RegistrationState, action: RegistrationAction) {
      const newList = action.payload;
      saveToStorage(STORAGE_KEYS.REGISTRATIONS, newList);
      return {
        ...state,
        list: newList,
        total: newList.length,
      };
    },
    addRegistration(state: RegistrationState, action: RegistrationAction) {
      const newReg = { ...action.payload, id: Date.now().toString() };
      const newList = [...state.list, newReg];
      saveToStorage(STORAGE_KEYS.REGISTRATIONS, newList);
      return {
        ...state,
        list: newList,
        total: state.total + 1,
      };
    },
    updateRegistration(state: RegistrationState, action: RegistrationAction) {
      const newList = state.list.map((reg) =>
        reg.id === action.payload.id
          ? { ...reg, ...action.payload, history: [...(reg.history || []), action.payload.newHistory].filter(Boolean) }
          : reg
      );
      saveToStorage(STORAGE_KEYS.REGISTRATIONS, newList);
      return {
        ...state,
        list: newList,
      };
    },
    deleteRegistration(state: RegistrationState, action: RegistrationAction) {
      const newList = state.list.filter((reg) => reg.id !== action.payload);
      saveToStorage(STORAGE_KEYS.REGISTRATIONS, newList);
      return {
        ...state,
        list: newList,
        total: state.total - 1,
      };
    },
    bulkUpdateRegistration(state: RegistrationState, action: RegistrationAction) {
      const { ids, updates } = action.payload;
      const newList = state.list.map((reg) =>
        ids.includes(reg.id)
          ? {
              ...reg,
              ...updates,
              history: [...(reg.history || []), updates.newHistory].filter(Boolean),
            }
          : reg
      );
      saveToStorage(STORAGE_KEYS.REGISTRATIONS, newList);
      return {
        ...state,
        list: newList,
      };
    },
    setCurrentRegistration(state: RegistrationState, action: RegistrationAction) {
      return {
        ...state,
        current: action.payload,
      };
    },
  },
  effects: {},
  subscriptions: {},
};
