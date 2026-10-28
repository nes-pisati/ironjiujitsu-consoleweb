import { createContext, useContext, useState, type ReactNode } from "react";
import type { User } from "../types";
import axios from "axios";
import { TOKEN_KEY } from "../axiosSetup";

interface UserContextType {
    user: User | null;
    loading: boolean;
    error: string | null;
    userLogin: (user: User) => Promise<any>;
}

export const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
    children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
    const [user] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const apiUrl = import.meta.env.VITE_API_URL;


    const userLogin = async (user: User) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.post(`${apiUrl}/user/login`, user);
            console.log("User login response -> ", response.data);
            localStorage.setItem(TOKEN_KEY, response.data.token);
            // setUser(response.data);
            return response.data;
        } catch (error) {
            console.error('Errore nel login:', error);
            setError(axios.isAxiosError(error) && error.response?.status === 401
                ? 'Username o password non validi'
                : 'Errore nel login, riprova più tardi');
            return null;
        } finally {
            setLoading(false);
        }
    };

    return (
        <UserContext.Provider value={{
            user,
            loading,
            error,
            userLogin,
        }}>
            {children}
        </UserContext.Provider>
    );
}

export const useUserContext = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUserContext deve essere usato all\'interno di UserProvider');
    }
    return context;
};
