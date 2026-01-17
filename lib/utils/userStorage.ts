/**
 * Utility functions for managing user data in localStorage
 * Used for donation flow to persist Google Sign-In information
 */

export interface UserData {
  email: string;
  firstName: string;
  lastName: string;
  name?: string;
  picture?: string;
}

const USER_DATA_KEY = 'donation_user_data';

/**
 * Save user data to localStorage
 */
export function saveUserData(userData: UserData): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
  } catch (error) {
    console.error('Error saving user data to localStorage:', error);
  }
}

/**
 * Get user data from localStorage
 */
export function getUserData(): UserData | null {
  if (typeof window === 'undefined') return null;

  try {
    const data = localStorage.getItem(USER_DATA_KEY);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error reading user data from localStorage:', error);
    return null;
  }
}

/**
 * Clear user data from localStorage
 */
export function clearUserData(): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.removeItem(USER_DATA_KEY);
  } catch (error) {
    console.error('Error clearing user data from localStorage:', error);
  }
}

/**
 * Check if user data exists
 */
export function hasUserData(): boolean {
  return getUserData() !== null;
}
