import { useState, useCallback, useEffect } from 'react';
import type { Club, Application, RegistrationStatus } from '@/pages/QuanLyCauLacBo/type';
import { message } from 'antd';

const STORAGE_KEY_CLUBS = 'CLB_DATA_CLUBS';
const STORAGE_KEY_APPS = 'CLB_DATA_APPS';

export default () => {
    const [clubs, setClubs] = useState<Club[]>(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY_CLUBS);
            return saved ? JSON.parse(saved) : [];
        } catch (e) {
            console.error('Failed to parse clubs from localStorage', e);
            return [];
        }
    });

    const [apps, setApps] = useState<Application[]>(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY_APPS);
            return saved ? JSON.parse(saved) : [];
        } catch (e) {
            console.error('Failed to parse apps from localStorage', e);
            return [];
        }
    });

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY_CLUBS, JSON.stringify(clubs));
        localStorage.setItem(STORAGE_KEY_APPS, JSON.stringify(apps));
    }, [clubs, apps]);

    const addClub = useCallback((club: Omit<Club, 'id'>) => {
        const newClub = { ...club, id: Date.now().toString() };
        setClubs(prev => [...prev, newClub]);
        message.success('Thêm CLB thành công');
    }, []);

    const updateClub = useCallback((id: string, club: Partial<Club>) => {
        setClubs(prev => prev.map(c => c.id === id ? { ...c, ...club } : c));
        message.success('Cập nhật CLB thành công');
    }, []);

    const deleteClub = useCallback((id: string) => {
        setClubs(prev => prev.filter(c => c.id !== id));
        message.success('Xóa CLB thành công');
    }, []);

    const updateStatusBulk = useCallback((ids: string[], status: RegistrationStatus, reason?: string) => {
        setApps((prev) =>
            prev.map((item) => {
                if (ids.includes(item.id)) {
                    const log = { 
                        id: Date.now().toString() + Math.random(), 
                        admin: 'Admin', 
                        action: status, 
                        time: new Date().toLocaleString(), 
                        reason 
                    };
                    return { 
                        ...item, 
                        status, 
                        note: reason, 
                        history: [log, ...(item.history || [])] 
                    };
                }
                return item;
            })
        );
    }, []);

    return { 
        clubs, setClubs, 
        apps, setApps, 
        addClub, updateClub, deleteClub,
        updateStatusBulk 
    };
};