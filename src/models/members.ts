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
  {
    id: '2',
    fullName: 'Trần Thị B',
    email: 'tranthib@example.com',
    phone: '0912222222',
    gender: 'Female',
    address: '456 Đường Lê Lợi',
    skills: 'Có kinh nghiệm 3 năm',
    clubId: '2',
    joinedDate: '2023-02-20',
    role: 'Vice Leader',
    status: 'Active',
    createdAt: '2023-02-20',
  },
  {
    id: '3',
    fullName: 'Phạm Văn C',
    email: 'phamvanc@example.com',
    phone: '0913333333',
    gender: 'Male',
    address: '789 Đường Trần Hưng Đạo',
    skills: 'Lập trình backend',
    clubId: '2',
    joinedDate: '2023-03-10',
    role: 'Member',
    status: 'Active',
    createdAt: '2023-03-10',
  },
];


const loadInitialData = (): IMember[] => {
  const savedData = loadFromStorage<IMember>(STORAGE_KEYS.MEMBERS);
  return savedData || defaultData;
};

const initialState: MembersState = {
  list: loadInitialData(),
  total: 3,
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
