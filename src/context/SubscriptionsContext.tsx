import { createContext, useEffect, useState, type ReactNode } from "react";
import type { Subscription } from "../types";
import axios from "axios";
import React from "react";

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
  monthEarning: number;
  expiredSubscriptions: number;
  getSubscriptionById: (id: string) => Promise<Subscription | null>;
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
  const [expiredSubscriptions, setExpiredSubscriptions] = useState<number>(0);
  const [monthlySubscriptionsCount, setMonthlySubscriptionsCount] = useState<number>(0);
  const [quarterlySubscriptionsCount, setQuarterlySubscriptionsCount] = useState<number>(0);

  const apiUrl = import.meta.env.VITE_API_URL;
  const today = new Date();
  const currentMonth = today.getMonth() + 1;

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

    const now = new Date();

    const monthlyCount = subscriptions.filter(s => s.type === 'month' && new Date(s.subscriptionExp) > now).length;
    const quarterlyCount = subscriptions.filter(s => s.type === 'quarterly' && new Date(s.subscriptionExp) > now).length;
    const expired = subscriptions.filter(s => new Date(s.subscriptionExp) < now).length;
    const monthEarn = subscriptions
      .filter(s => {
        const created = new Date(s.createdAt || '');
        return created.getMonth() === currentMonth - 1 && created.getFullYear() === now.getFullYear();
      })
      .reduce((sum, s) => sum + (s.amount || 0), 0);

    setMonthlySubscriptionsCount(monthlyCount);
    setQuarterlySubscriptionsCount(quarterlyCount);
    setExpiredSubscriptions(expired);
    setMonthEarning(monthEarn);
  }, [subscriptions, currentMonth]);

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

  return (
    <SubscriptionContext.Provider value={{
      subscriptions,
      loading,
      error,
      getAllSubscriptions,
      monthEarning,
      expiredSubscriptions,
      getSubscriptionByAthlete,
      getLastSubscriptionByAthlete,
      addSubscription,
      updateSubscription,
      monthlySubscriptionsCount,
      quarterlySubscriptionsCount,
      getSubscriptionById
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
