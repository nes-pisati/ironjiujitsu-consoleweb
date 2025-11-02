import { createContext, useEffect, useState, type ReactNode } from "react";
import type { Subscription } from "../types";
import axios from "axios";
import React from "react";

interface SubscriptionsContextType {
  subscriptions: Subscription[];
  loading: boolean;
  error: string | null;
  getAllSubscriptions: () => Promise<void>;
  getSubscriptionByAthlete: (athleteId: string) => Promise<Subscription[] | null>;
  getLastSubscriptionByAthlete: (athleteId: string) => Promise<Subscription | null>;
  addSubscription: (athleteId: string, subscription: Omit<Subscription, '_id'>) => Promise<Subscription | null>;
  monthlySubscriptionsCount: number;
  quarterlySubscriptionsCount: number;
  monthEarning: number;
  expiredSubscriptions: number;
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
  const currentMonth = today.getMonth() + 1

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

  const getMonthEarn = () => {
    if (!subscriptions || subscriptions.length === 0) return 0;

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
  
    const subscriptionsOfTheMonth = subscriptions.filter(sub => {
      if (!sub.createdAt) return false;
      const createdDate = new Date(sub.createdAt);
      return (
        createdDate.getMonth() === currentMonth &&
        createdDate.getFullYear() === currentYear
      );
    });
  
    const amount = subscriptionsOfTheMonth.reduce(
      (sum, sub) => sum + (sub.amount || 0),
      0
    );

    setMonthEarning(amount);
    return amount;
  }

  const getExpiredSubscriptions = () => { 
    if (!subscriptions || subscriptions.length === 0) return 0;

    const now = new Date();
  
    const total = subscriptions.reduce((sum, sub) => {
      const subDate = new Date(sub.subscriptionExp);
      if (now > subDate) {
        return sum + 1;
      }
      return sum;
    }, 0);

    setExpiredSubscriptions(total)
  }

  const getSubscriptionByAthlete = async (athleteId: string): Promise<Subscription[] | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${apiUrl}/subscription/getbyathlete/${athleteId}`);
      return response.data;
    } catch (error) {
      console.error('Errore nel recupero dello storico abbonamenti per atleta:', error);
      setError('Errore nel recupero dello storico abbonamenti per atleta');
      return null;
    } finally {
      setLoading(false);
    }
  }

  const getLastSubscriptionByAthlete = async (athleteId: string): Promise<Subscription | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${apiUrl}/subscription/getbyathlete/${athleteId}`);
      return response.data[0];
    } catch (error) {
      console.error('Errore nel recupero dell\'abbonamento per atleta:', error);
      setError('Errore nel recupero dell\'abbonamento per atleta');
      return null;
    } finally {
      setLoading(false);
    }
  }

  const addSubscription = async (
    athleteId: string,
    subscription: Omit<Subscription, '_id'>
  ): Promise<Subscription> => {
    setLoading(true);
    setError(null);
  
    try {
      const response = await axios.post(`${apiUrl}/subscription/post/${athleteId}`, subscription);
      return response.data as Subscription;
    } catch (error: any) {
      console.error('Errore nella creazione della subscription:', error);
      const errorMsg =
        error.response?.data?.error ||
        'Errore nella creazione della subscription';
      setError(errorMsg);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getMonthlySubscriptionCount = () => {
    if (!subscriptions || subscriptions.length === 0) return;

    const count = subscriptions.filter(sub => 
      sub.type === 'month' && new Date(sub.subscriptionExp) > new Date()
    ).length;    
    setMonthlySubscriptionsCount(count)
  }

  const getQuarterlySubscriptionCount = () => {
    if (!subscriptions || subscriptions.length === 0) return;

    const count = subscriptions.filter(sub => 
      sub.type === 'quarterly' && new Date(sub.subscriptionExp) > new Date()
    ).length;    
    setQuarterlySubscriptionsCount(count)
  }
  
  useEffect(() => {
    getAllSubscriptions();
  }, [currentMonth]);

  useEffect(() => {
    if (subscriptions && subscriptions.length > 0) {
      getExpiredSubscriptions();
      getMonthlySubscriptionCount();
      getQuarterlySubscriptionCount();
      getMonthEarn();
    }
  }, [subscriptions, currentMonth]);


  return (
    <SubscriptionContext.Provider value={{ subscriptions, loading, error, getAllSubscriptions, monthEarning, expiredSubscriptions, getSubscriptionByAthlete, getLastSubscriptionByAthlete, addSubscription, monthlySubscriptionsCount, quarterlySubscriptionsCount }}>
      {children}
    </SubscriptionContext.Provider>
  )
}

export const useSubscriptionContext = (): SubscriptionsContextType => {
  const context = React.useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscriptionContext deve essere utilizzato all\'interno di un SubscriptionProvider');
  }
  return context;
};