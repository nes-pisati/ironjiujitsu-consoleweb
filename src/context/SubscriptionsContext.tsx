import { createContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Subscription } from "../types";
import axios from "axios";
import React from "react";
import { useAthleteContext } from "./AthleteContext";

export interface ExpiredSubscriptionDetail {
  subscriptionId: string;
  athleteName: string;
  daysExpired: number;
}

interface SubscriptionsContextType {
  subscriptions: Subscription[];
  loading: boolean;
  error: string | null;
  getAllSubscriptions: () => Promise<void>;
  getSubscriptionByAthlete: (athleteId: string) => Promise<Subscription | null>;
  getLastSubscriptionByAthlete: (athleteId: string) => Promise<Subscription | null>;
  addSubscription: (athleteId: string, subscription: Omit<Subscription, '_id'>) => Promise<Subscription | null>;
  updateSubscription: (id: string, subscription: Partial<Subscription>) => Promise<void>;
  monthlySubscriptionsCount: number;
  quarterlySubscriptionsCount: number;
  semesterlySubscriptionsCount: number;
  packsCount: number;
  activeSubscriptionsCount: number;
  monthEarning: number;
  expiredSubscriptionsCount: number;
  getSubscriptionById: (id: string) => Promise<Subscription | null>;
  expiredSubscriptionsList: ExpiredSubscriptionDetail[];
}

export const SubscriptionContext = createContext<SubscriptionsContextType | undefined>(undefined);

interface SubscriptionProviderProps {
  children: ReactNode;
}

export const SubscriptionProvider: React.FC<SubscriptionProviderProps> = ({ children }) => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [monthEarning, setMonthEarning] = useState<number>(0);
  const [expiredSubscriptionsCount, setExpiredSubscriptionsCount] = useState<number>(0);
  const [monthlySubscriptionsCount, setMonthlySubscriptionsCount] = useState<number>(0);
  const [quarterlySubscriptionsCount, setQuarterlySubscriptionsCount] = useState<number>(0);
  const [semesterlySubscriptionsCount, setSemesterlySubscriptionsCount] = useState<number>(0);
  const [packsCount, setPacksCount] = useState<number>(0);
  const [activeSubscriptionsCount, setActiveSubscriptionsCount] = useState<number>(0);

  const { athletes, archivedAthletes } = useAthleteContext();

  const archivedAthleteIds = new Set(archivedAthletes.map(a => a._id));

  const apiUrl = import.meta.env.VITE_API_URL;
  const today = new Date();
  const currentMonth = today.getMonth() + 1;
  const now = new Date();

  const getAllSubscriptions = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${apiUrl}/subscription/getall`);
      setSubscriptions(response.data);
    } catch (error) {
      console.error('Errore nel recupero degli abbonamenti:', error);
      setError('Errore nel recupero degli abbonamenti');
    } finally {
      setLoading(false);
    }
  };

  const getSubscriptionByAthlete = async (athleteId: string): Promise<Subscription | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${apiUrl}/subscription/getbyathlete/${athleteId}`);
      return response.data; // singolo abbonamento o null
    } catch (error) {
      console.error('Errore nel recupero dell\'abbonamento per atleta:', error);
      setError('Errore nel recupero dell\'abbonamento per atleta');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getLastSubscriptionByAthlete = getSubscriptionByAthlete; // alias, coerente con nuovo backend

  const addSubscription = async (
    athleteId: string,
    subscription: Omit<Subscription, '_id'>
  ): Promise<Subscription | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(`${apiUrl}/subscription/post/${athleteId}`, subscription);
      const newSub: Subscription = response.data;
      setSubscriptions((prev) => [...prev.filter(s => s.athleteId !== athleteId), newSub]);
      return newSub;
    } catch (error: any) {
      console.error('Errore nella creazione della subscription:', error);
      setError(error.response?.data?.error || 'Errore nella creazione della subscription');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateSubscription = async (id: string, subscription: Partial<Subscription>) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.put(`${apiUrl}/subscription/edit/${id}`, subscription);
      const updatedSubscription: Subscription = response.data;
      setSubscriptions((prev) =>
        prev.map((s) => (s._id === id ? updatedSubscription : s))
      );
    } catch (error) {
      console.error('Errore nell\'aggiornamento dell\'abbonamento', error);
      setError('Errore nell\'aggiornamento dell\'abbonamento');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Statistiche
  useEffect(() => {
    if (!subscriptions || subscriptions.length === 0) return;

    const activeSubscriptions = subscriptions.filter(s => new Date(s.subscriptionExp) > now && !archivedAthleteIds.has(s.athleteId));
    const monthlyCount = activeSubscriptions.filter(s => s.type === 'month').length;
    const quarterlyCount = activeSubscriptions.filter(s => s.type === 'quarterly').length;
    const semesterlyCount = activeSubscriptions.filter(s => s.type === 'sixmonth').length;
    const packsCount = activeSubscriptions.filter(s => s.type === '10entrance').length;
    const expired = subscriptions.filter(s => new Date(s.subscriptionExp) < now && !archivedAthleteIds.has(s.athleteId));
    const monthEarn = subscriptions
      .filter(s => {
        const created = new Date(s.createdAt || '');
        return created.getMonth() === currentMonth - 1 && created.getFullYear() === now.getFullYear();
      })
      .reduce((sum, s) => sum + (s.amount || 0), 0);

    setMonthlySubscriptionsCount(monthlyCount);
    setQuarterlySubscriptionsCount(quarterlyCount);
    setSemesterlySubscriptionsCount(semesterlyCount);
    setPacksCount(packsCount);
    setActiveSubscriptionsCount(monthlyCount + quarterlyCount + semesterlyCount + packsCount);
    setExpiredSubscriptionsCount(expired.length);
    setMonthEarning(monthEarn);
  }, [subscriptions, athletes, archivedAthletes, currentMonth]);

  useEffect(() => {
    getAllSubscriptions();
  }, []);

  const getSubscriptionById = async (id: string): Promise<Subscription | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${apiUrl}/subscription/get/${id}`);
      return response.data;
    } catch (error) {
      console.error('Errore nel recupero dell\'abbonamento per ID:', error);
      setError('Errore nel recupero dell\'abbonamento');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const expiredSubscriptionsList = useMemo<ExpiredSubscriptionDetail[]>(() => {
    const now = new Date();
    const archivedIds = new Set(archivedAthletes.map(a => a._id));
    const athletesById = new Map(athletes.map(a => [a._id, a]));

    return subscriptions
      .filter(s => new Date(s.subscriptionExp) < now && !archivedIds.has(s.athleteId))
      .map(s => {
        const diffTime = now.getTime() - new Date(s.subscriptionExp).getTime();
        const athlete = athletesById.get(s.athleteId);

        return {
          subscriptionId: s._id,
          athleteName: athlete ? `${athlete.name} ${athlete.surname}` : 'Unknown Athlete',
          daysExpired: Math.ceil(diffTime / (1000 * 60 * 60 * 24))
        };
      });
  }, [subscriptions, athletes, archivedAthletes]);

  return (
    <SubscriptionContext.Provider value={{
      subscriptions,
      loading,
      error,
      getAllSubscriptions,
      monthEarning,
      expiredSubscriptionsCount,
      getSubscriptionByAthlete,
      getLastSubscriptionByAthlete,
      addSubscription,
      updateSubscription,
      monthlySubscriptionsCount,
      quarterlySubscriptionsCount,
      semesterlySubscriptionsCount,
      packsCount,
      activeSubscriptionsCount,
      getSubscriptionById,
      expiredSubscriptionsList
    }}>
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscriptionContext = (): SubscriptionsContextType => {
  const context = React.useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscriptionContext deve essere utilizzato all\'interno di un SubscriptionProvider');
  }
  return context;
};
