
import { SessionRecord } from '../types';

const STORAGE_KEY = 'dr_live_coach_history_v2';

export const saveSession = (session: SessionRecord): void => {
  try {
    const existingData = localStorage.getItem(STORAGE_KEY);
    const sessions: SessionRecord[] = existingData ? JSON.parse(existingData) : [];
    // Add new session to the beginning
    const updatedSessions = [session, ...sessions];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedSessions));
  } catch (error) {
    console.error("Failed to save session:", error);
  }
};

export const getSessions = (userId: string): SessionRecord[] => {
  try {
    const existingData = localStorage.getItem(STORAGE_KEY);
    if (!existingData) return [];
    
    const allSessions: SessionRecord[] = JSON.parse(existingData);
    // Filter sessions belonging to this user
    return allSessions.filter(s => s.userId === userId);
  } catch (error) {
    console.error("Failed to retrieve sessions:", error);
    return [];
  }
};

export const deleteSession = (sessionId: string, userId: string): SessionRecord[] => {
  try {
    const existingData = localStorage.getItem(STORAGE_KEY);
    if (!existingData) return [];
    
    const sessions: SessionRecord[] = JSON.parse(existingData);
    const updatedSessions = sessions.filter(s => s.id !== sessionId);
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedSessions));
    
    // Return filtered list for the current user
    return updatedSessions.filter(s => s.userId === userId);
  } catch (error) {
    console.error("Failed to delete session:", error);
    return [];
  }
};
