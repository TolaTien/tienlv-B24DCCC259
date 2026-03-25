import type { IMember } from '@/types';
import { saveToStorage, loadFromStorage, STORAGE_KEYS } from '@/utils/storage';

interface MembersState {
  list: IMember[];
  total: number;
  loading: boolean;
  current?: IMember;
}

interface MembersAction {
  type: string;
  payload?: any;
}

const defaultData: IMember[] = [
  {
    id: '1',
    fullName: 'Nguyễn Văn A',
    email: 'nguyenvana@example.com',
    phone: '0911111111',
    gender: 'Male',
    address: '789 Đường Kim Mã',
    skills: 'Chơi guitar chuyên nghiệp',
    clubId: '1',
    joinedDate: '2023-01-15',
    role: 'Leader',
    status: 'Active',
    createdAt: '2023-01-15',
  },
];

// Load initial data from localStorage or use default
const loadInitialData = (): IMember[] => {
  const savedData = loadFromStorage<IMember>(STORAGE_KEYS.MEMBERS);
  return savedData || defaultData;
};

const initialState: MembersState = {
  list: loadInitialData(),
  total: 1,
  loading: false,
};

export default {
  namespace: 'members',
  state: initialState,
  reducers: {
    setMemberList(state: MembersState, action: MembersAction) {
      const newList = action.payload;
      saveToStorage(STORAGE_KEYS.MEMBERS, newList);
      return {
        ...state,
        list: newList,
        total: newList.length,
      };
    },
    addMember(state: MembersState, action: MembersAction) {
      const newMember = { ...action.payload, id: Date.now().toString() };
      const newList = [...state.list, newMember];
      saveToStorage(STORAGE_KEYS.MEMBERS, newList);
      return {
        ...state,
        list: newList,
        total: state.total + 1,
      };
    },
    updateMember(state: MembersState, action: MembersAction) {
      const newList = state.list.map((member) =>
        member.id === action.payload.id ? { ...member, ...action.payload } : member
      );
      saveToStorage(STORAGE_KEYS.MEMBERS, newList);
      return {
        ...state,
        list: newList,
      };
    },
    deleteMember(state: MembersState, action: MembersAction) {
      const newList = state.list.filter((member) => member.id !== action.payload);
      saveToStorage(STORAGE_KEYS.MEMBERS, newList);
      return {
        ...state,
        list: newList,
        total: state.total - 1,
      };
    },
    bulkUpdateMember(state: MembersState, action: MembersAction) {
      const { ids, updates } = action.payload;
      const newList = state.list.map((member) =>
        ids.includes(member.id) ? { ...member, ...updates } : member
      );
      saveToStorage(STORAGE_KEYS.MEMBERS, newList);
      return {
        ...state,
        list: newList,
      };
    },
    setCurrentMember(state: MembersState, action: MembersAction) {
      return {
        ...state,
        current: action.payload,
      };
    },
  },
  effects: {},
  subscriptions: {},
};
