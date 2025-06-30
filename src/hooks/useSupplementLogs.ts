import { useState, useEffect, useRef } from 'react';
import { supplementLogsAPI } from '../config/api';
import { useAuth } from '../context/AuthContext';

export interface SupplementLog {
  id: string;
  supplement_id: number;
  scheduled_time: string;
  taken_at?: string;
  status: 'pending' | 'taken' | 'missed' | 'skipped';
  notes?: string;
  created_at: string;
}

export function useSupplementLogs(date?: Date) {
  const { user } = useAuth();
  const [logs, setLogs] = useState<SupplementLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  // Track if we're already loading data to prevent duplicate requests
  const isLoadingRef = useRef(false);
  // Track last load time to prevent too frequent refreshes
  const lastLoadTimeRef = useRef(0);
  // Track if component is mounted
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (user && !isLoadingRef.current) {
      loadLogs();
    } else if (!user) {
      setLogs([]);
      setIsLoading(false);
    }
  }, [user, refreshTrigger, date]);

  const loadLogs = async () => {
    // Prevent duplicate requests
    if (isLoadingRef.current) return;
    
    // Prevent too frequent refreshes (minimum 2 seconds between loads)
    const now = Date.now();
    if (now - lastLoadTimeRef.current < 2000) return;
    
    isLoadingRef.current = true;
    lastLoadTimeRef.current = now;
    
    try {
      setIsLoading(true);
      setError(null);
      
      const token = localStorage.getItem('access_token');
      if (!token) {
        throw new Error("No authentication token");
      }

      // For now, we only have an API to get today's logs
      // In a real implementation, you would have an API to get logs for a specific date
      const { data } = await supplementLogsAPI.getTodayLogs(token);
      
      if (isMountedRef.current) {
        setLogs(data || []);
        setIsLoading(false);
      }
    } catch (err: any) {
      if (isMountedRef.current) {
        setError(err.message || "Failed to load supplement logs");
        setLogs([]);
        setIsLoading(false);
      }
    } finally {
      isLoadingRef.current = false;
    }
  };

  const refetch = () => {
    // Only trigger a refresh if we're not already loading and it's been at least 2 seconds
    const now = Date.now();
    if (!isLoadingRef.current && now - lastLoadTimeRef.current >= 2000) {
      setRefreshTrigger(prev => prev + 1);
    }
  };

  return {
    logs,
    isLoading,
    error,
    refetch
  };
}