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
    noMedicalCertificateAthleteList: Athlete[];
    expiredMedicalCertificateAthleteList: Athlete[];
}

export const AthleteContext = createContext<AthleteContextType | undefined>(undefined);

interface AthleteProviderProps {
    children: ReactNode;
}

export const AthleteProvider: React.FC<AthleteProviderProps> = ({ children }) => {
    const [athletes, setAthletes] = useState<Athlete[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [noMedicalCertificateAthleteList, setNoMedicalCertificateAthleteList] = useState<Athlete[]>([]);
    const [expiredMedicalCertificateAthleteList, setExpiredMedicalCertificateAthleteList] = useState<Athlete[]>([]);

    const apiUrl = import.meta.env.VITE_API_URL;

    const getAllAthletes = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`${apiUrl}/athlete/get`);
            setAthletes(response.data);
        } catch (err) {
            setError('Errore nel recupero degli atleti');
        } finally {
            setLoading(false);
        }
    };

    const addAthlete = async (athlete: Omit<Athlete, '_id'>) => {
        const response = await axios.post(`${apiUrl}/athlete/post`, athlete);
        setAthletes(prev => [...prev, response.data]);
    };

    const getAthlete = async (id: string) => {
        const response = await axios.get(`${apiUrl}/athlete/get/${id}`);
        return response.data;
    };

    const editAthlete = async (id: string, athlete: Partial<Athlete>) => {
        const response = await axios.put(`${apiUrl}/athlete/edit/${id}`, athlete);
        setAthletes(prev =>
            prev.map(a => (a._id === id ? response.data : a))
        );
    };

    const deleteAthlete = async (id: string) => {
        await axios.delete(`${apiUrl}/athlete/delete/${id}`);
        setAthletes(prev => prev.filter(a => a._id !== id));
    };

    useEffect(() => {
        getAllAthletes();
    }, []);

    useEffect(() => {
        getNoMedicalCertificateAthleteList();
        getExpiredMedicalCertificateAthleteList();

        console.log("noMedicalCertificateAthleteList", noMedicalCertificateAthleteList);
        console.log("expiredMedicalCertificateAthleteList", expiredMedicalCertificateAthleteList);
    }, [athletes]);

    const getNoMedicalCertificateAthleteList = () => {
        if (!athletes) return;
        const noMedicalCertificateAthleteList = athletes.filter((athlete) => !athlete.medicalCertificate);
        setNoMedicalCertificateAthleteList(noMedicalCertificateAthleteList);
    };

    const getExpiredMedicalCertificateAthleteList = () => {
        if (!athletes) return;

        const now = new Date();

        const expired = athletes.filter((athlete) => {
            if (!athlete.medicalCertificate || !athlete.medicalCertificateExp) return false;

            return new Date(athlete.medicalCertificateExp).getTime() < now.getTime();
        });

        setExpiredMedicalCertificateAthleteList(expired);
    };


    return (
        <AthleteContext.Provider
            value={{
                athletes,
                loading,
                error,
                addAthlete,
                getAthlete,
                editAthlete,
                deleteAthlete,
                getAllAthletes,
                noMedicalCertificateAthleteList,
                expiredMedicalCertificateAthleteList,
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