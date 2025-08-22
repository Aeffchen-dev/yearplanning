// Utility for localStorage with expiration
export interface StorageItem {
  value: any;
  timestamp: number;
}

const STORAGE_EXPIRY_DAYS = 7;
const EXPIRY_MS = STORAGE_EXPIRY_DAYS * 24 * 60 * 60 * 1000; // 7 days in milliseconds

export const setItemWithExpiry = (key: string, value: any): void => {
  if (typeof window === 'undefined') return;
  
  const item: StorageItem = {
    value,
    timestamp: Date.now()
  };
  
  try {
    localStorage.setItem(key, JSON.stringify(item));
  } catch (error) {
    console.warn('Failed to save to localStorage:', error);
  }
};

export const getItemWithExpiry = (key: string): any => {
  if (typeof window === 'undefined') return null;
  
  try {
    const itemStr = localStorage.getItem(key);
    if (!itemStr) return null;
    
    const item: StorageItem = JSON.parse(itemStr);
    const now = Date.now();
    
    // Check if item has expired
    if (now - item.timestamp > EXPIRY_MS) {
      localStorage.removeItem(key);
      return null;
    }
    
    return item.value;
  } catch (error) {
    console.warn('Failed to retrieve from localStorage:', error);
    return null;
  }
};

export const clearExpiredItems = (): void => {
  if (typeof window === 'undefined') return;
  
  const now = Date.now();
  const keysToRemove: string[] = [];
  
  // Check all localStorage items for year planner data
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith('yearPlanner-')) {
      try {
        const itemStr = localStorage.getItem(key);
        if (itemStr) {
          const item: StorageItem = JSON.parse(itemStr);
          if (now - item.timestamp > EXPIRY_MS) {
            keysToRemove.push(key);
          }
        }
      } catch (error) {
        // If parsing fails, it's probably old format data, remove it
        keysToRemove.push(key);
      }
    }
  }
  
  // Remove expired items
  keysToRemove.forEach(key => localStorage.removeItem(key));
};