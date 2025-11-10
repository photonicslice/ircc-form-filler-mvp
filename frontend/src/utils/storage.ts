/**
 * LocalStorage Utilities
 * Handles persistent storage of form data and session management
 */

import { FormData, INITIAL_FORM_DATA } from '../types/form.types';

// Storage keys
const STORAGE_KEY = 'ircc_form_data';
const AUTO_SAVE_KEY = 'ircc_form_autosave';
const SESSION_KEY = 'ircc_session_id';
const LAST_SAVED_KEY = 'ircc_last_saved';

// ============================================================================
// FORM DATA STORAGE
// ============================================================================

/**
 * Save form data to localStorage
 */
export function saveFormData(formData: FormData): void {
  try {
    const dataString = JSON.stringify(formData);
    localStorage.setItem(STORAGE_KEY, dataString);
    localStorage.setItem(LAST_SAVED_KEY, new Date().toISOString());
  } catch (error) {
    console.error('Error saving form data:', error);
  }
}

/**
 * Load form data from localStorage
 */
export function loadFormData(): FormData | null {
  try {
    const dataString = localStorage.getItem(STORAGE_KEY);
    if (dataString) {
      const data = JSON.parse(dataString);
      return { ...INITIAL_FORM_DATA, ...data }; // Merge with initial to ensure all fields exist
    }
  } catch (error) {
    console.error('Error loading form data:', error);
  }
  return null;
}

/**
 * Clear form data from localStorage
 */
export function clearFormData(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(LAST_SAVED_KEY);
    localStorage.removeItem(AUTO_SAVE_KEY);
  } catch (error) {
    console.error('Error clearing form data:', error);
  }
}

/**
 * Check if form data exists in localStorage
 */
export function hasFormData(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) !== null;
  } catch (error) {
    return false;
  }
}

/**
 * Get last saved timestamp
 */
export function getLastSavedTime(): Date | null {
  try {
    const timestamp = localStorage.getItem(LAST_SAVED_KEY);
    return timestamp ? new Date(timestamp) : null;
  } catch (error) {
    return null;
  }
}

// ============================================================================
// AUTO-SAVE FUNCTIONALITY
// ============================================================================

let autoSaveTimeout: NodeJS.Timeout | null = null;

/**
 * Auto-save form data with debouncing
 * Prevents excessive writes by waiting for user to stop typing
 */
export function autoSaveFormData(formData: FormData, debounceMs: number = 2000): void {
  // Clear existing timeout
  if (autoSaveTimeout) {
    clearTimeout(autoSaveTimeout);
  }

  // Set new timeout
  autoSaveTimeout = setTimeout(() => {
    saveFormData(formData);
    localStorage.setItem(AUTO_SAVE_KEY, new Date().toISOString());
  }, debounceMs);
}

/**
 * Get last auto-save timestamp
 */
export function getLastAutoSaveTime(): Date | null {
  try {
    const timestamp = localStorage.getItem(AUTO_SAVE_KEY);
    return timestamp ? new Date(timestamp) : null;
  } catch (error) {
    return null;
  }
}

// ============================================================================
// SESSION MANAGEMENT
// ============================================================================

/**
 * Generate a unique session ID
 */
function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Get or create session ID
 */
export function getSessionId(): string {
  try {
    let sessionId = sessionStorage.getItem(SESSION_KEY);
    if (!sessionId) {
      sessionId = generateSessionId();
      sessionStorage.setItem(SESSION_KEY, sessionId);
    }
    return sessionId;
  } catch (error) {
    console.error('Error managing session:', error);
    return generateSessionId();
  }
}

/**
 * Clear session
 */
export function clearSession(): void {
  try {
    sessionStorage.removeItem(SESSION_KEY);
  } catch (error) {
    console.error('Error clearing session:', error);
  }
}

// ============================================================================
// DRAFT MANAGEMENT
// ============================================================================

/**
 * Save form as draft with timestamp
 */
export function saveDraft(formData: FormData, draftName?: string): void {
  try {
    const draft = {
      name: draftName || `Draft ${new Date().toLocaleDateString()}`,
      data: formData,
      createdAt: new Date().toISOString(),
      sessionId: getSessionId()
    };

    const drafts = getDrafts();
    drafts.push(draft);

    localStorage.setItem('ircc_drafts', JSON.stringify(drafts));
  } catch (error) {
    console.error('Error saving draft:', error);
  }
}

/**
 * Get all saved drafts
 */
export function getDrafts(): any[] {
  try {
    const draftsString = localStorage.getItem('ircc_drafts');
    return draftsString ? JSON.parse(draftsString) : [];
  } catch (error) {
    console.error('Error loading drafts:', error);
    return [];
  }
}

/**
 * Delete a draft by index
 */
export function deleteDraft(index: number): void {
  try {
    const drafts = getDrafts();
    drafts.splice(index, 1);
    localStorage.setItem('ircc_drafts', JSON.stringify(drafts));
  } catch (error) {
    console.error('Error deleting draft:', error);
  }
}

/**
 * Load a specific draft
 */
export function loadDraft(index: number): FormData | null {
  try {
    const drafts = getDrafts();
    if (drafts[index]) {
      return drafts[index].data;
    }
  } catch (error) {
    console.error('Error loading draft:', error);
  }
  return null;
}

// ============================================================================
// STORAGE INFO
// ============================================================================

/**
 * Get storage usage information
 */
export function getStorageInfo(): {
  used: number;
  available: number;
  percentage: number;
} {
  try {
    // Estimate localStorage usage
    let totalSize = 0;
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        totalSize += localStorage[key].length + key.length;
      }
    }

    // Most browsers allow ~5-10MB for localStorage
    const availableSize = 5 * 1024 * 1024; // 5MB estimate
    const percentage = (totalSize / availableSize) * 100;

    return {
      used: totalSize,
      available: availableSize,
      percentage: Math.min(percentage, 100)
    };
  } catch (error) {
    console.error('Error getting storage info:', error);
    return { used: 0, available: 0, percentage: 0 };
  }
}

/**
 * Check if localStorage is available
 */
export function isLocalStorageAvailable(): boolean {
  try {
    const test = '__localStorage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (error) {
    return false;
  }
}

// ============================================================================
// DATA EXPORT/IMPORT
// ============================================================================

/**
 * Export form data as JSON file
 */
export function exportFormData(formData: FormData, filename: string = 'ircc-form-backup.json'): void {
  try {
    const dataString = JSON.stringify(formData, null, 2);
    const blob = new Blob([dataString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error exporting form data:', error);
  }
}

/**
 * Import form data from JSON file
 */
export function importFormData(file: File): Promise<FormData> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        // Validate basic structure
        if (data && typeof data === 'object') {
          const formData = { ...INITIAL_FORM_DATA, ...data };
          resolve(formData);
        } else {
          reject(new Error('Invalid file format'));
        }
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    reader.readAsText(file);
  });
}

// ============================================================================
// PREFERENCES
// ============================================================================

interface UserPreferences {
  autoSave: boolean;
  darkMode: boolean;
  showTips: boolean;
}

const DEFAULT_PREFERENCES: UserPreferences = {
  autoSave: true,
  darkMode: false,
  showTips: true
};

/**
 * Save user preferences
 */
export function savePreferences(preferences: Partial<UserPreferences>): void {
  try {
    const current = getPreferences();
    const updated = { ...current, ...preferences };
    localStorage.setItem('ircc_preferences', JSON.stringify(updated));
  } catch (error) {
    console.error('Error saving preferences:', error);
  }
}

/**
 * Load user preferences
 */
export function getPreferences(): UserPreferences {
  try {
    const prefsString = localStorage.getItem('ircc_preferences');
    if (prefsString) {
      return { ...DEFAULT_PREFERENCES, ...JSON.parse(prefsString) };
    }
  } catch (error) {
    console.error('Error loading preferences:', error);
  }
  return DEFAULT_PREFERENCES;
}
