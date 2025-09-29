import React, { createContext, useState, useEffect, type ReactNode } from 'react';
import axios from 'axios';
import type { Athlete } from '../types';

interface AthleteContextType {
    athletes: Athlete[];
    loading: boolean;
    error: string | null;
    addAthlete: (athlete: Omit<Athlete, '_id'>) => Promise<void>;
    getAthlete: (id: string) => Promise<Athlete | null>;
    editAthlete: (id: string, athlete: Partial<Athlete>) => Promise<void>;
    deleteAthlete: (id: string) => Promise<void>;
    getAllAthletes: () => Promise<void>;
}

export const AthleteContext = createContext<AthleteContextType | undefined>(undefined);

interface AthleteProviderProps {
    children: ReactNode;
}

export const AthleteProvider: React.FC<AthleteProviderProps> = ({ children }) => {
    const [athletes, setAthletes] = useState<Athlete[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    
    const apiUrl = import.meta.env.VITE_API_URL;

    const getAllAthletes = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`${apiUrl}/athlete/get`);
            setAthletes(response.data);
        } catch (error) {
            console.error('Errore nel recupero degli atleti:', error);
            setError('Errore nel recupero degli atleti');
        } finally {
            setLoading(false);
        }
    };

    const addAthlete = async (athlete: Omit<Athlete, '_id'>) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.post(`${apiUrl}/athlete/post`, athlete);
            const newAthlete: Athlete = response.data;
            setAthletes((prev) => [...prev, newAthlete]);
        } catch (error) {
            console.error('Errore nella creazione dell\'atleta:', error);
            setError('Errore nella creazione dell\'atleta');
            throw error; 
        } finally {
            setLoading(false);
        }
    };

    const getAthlete = async (id: string): Promise<Athlete | null> => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`${apiUrl}/athlete/get/${id}`);
            return response.data;
        } catch (error) {
            console.error('Errore nel recupero dell\'atleta:', error);
            setError('Errore nel recupero dell\'atleta');
            return null;
        } finally {
            setLoading(false);
        }
    };

    const editAthlete = async (id: string, athlete: Partial<Athlete>) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.put(`${apiUrl}/athlete/update/${id}`, athlete);
            const updatedAthlete: Athlete = response.data;
            setAthletes((prev) => 
                prev.map((a) => (a._id === id ? { ...a, ...updatedAthlete } : a))
            );
        } catch (error) {
            console.error('Errore nell\'aggiornamento dell\'atleta:', error);
            setError('Errore nell\'aggiornamento dell\'atleta');
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const deleteAthlete = async (id: string) => {
        setLoading(true);
        setError(null);
        try {
            await axios.delete(`${apiUrl}/athlete/delete/${id}`);
            setAthletes((prev) => prev.filter((athlete) => athlete._id !== id));
        } catch (error) {
            console.error('Errore nell\'eliminazione dell\'atleta:', error);
            setError('Errore nell\'eliminazione dell\'atleta');
            throw error;
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getAllAthletes();
    }, []);

    return (
        <AthleteContext.Provider 
            value={{
                athletes, 
                loading,
                error,
                getAllAthletes, 
                addAthlete, 
                getAthlete, 
                editAthlete, 
                deleteAthlete
            }}
        >
            {children}
        </AthleteContext.Provider>
    );
};

export const useAthleteContext = (): AthleteContextType => {
    const context = React.useContext(AthleteContext);
    if (!context) {
        throw new Error('useAthleteContext deve essere utilizzato all\'interno di un AthleteProvider');
    }
    return context;
};