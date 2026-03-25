/**
 * LocalStorage utility functions
 */

const STORAGE_KEYS = {
  CLUBS: 'clb:list',
  REGISTRATIONS: 'registration:list',
  MEMBERS: 'members:list',
};

export interface StorageData<T> {
  data: T[];
  timestamp: number;
}

/**
 * Save data to localStorage
 */
export const saveToStorage = <T>(key: string, data: T[]): void => {
  try {
    const storageData: StorageData<T> = {
      data,
      timestamp: Date.now(),
    };
    localStorage.setItem(key, JSON.stringify(storageData));
  } catch (error) {
    console.error(`Error saving to localStorage with key ${key}:`, error);
  }
};

/**
 * Load data from localStorage
 */
export const loadFromStorage = <T>(key: string): T[] | null => {
  try {
    const item = localStorage.getItem(key);
    if (!item) return null;
    const storageData: StorageData<T> = JSON.parse(item);
    return storageData.data;
  } catch (error) {
    console.error(`Error loading from localStorage with key ${key}:`, error);
    return null;
  }
};

/**
 * Clear specific key from localStorage
 */
export const clearStorageKey = (key: string): void => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error clearing localStorage key ${key}:`, error);
  }
};

/**
 * Clear all app data from localStorage
 */
export const clearAllStorage = (): void => {
  try {
    Object.values(STORAGE_KEYS).forEach((key) => {
      localStorage.removeItem(key);
    });
  } catch (error) {
    console.error('Error clearing all localStorage:', error);
  }
};

export { STORAGE_KEYS };
