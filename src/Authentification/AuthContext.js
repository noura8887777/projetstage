import { createContext, useContext, useEffect, useState } from "react";
import { AxiosError } from "axios";
import api from "../services/api"

const AuthContext = createContext({})

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        (async () => {
            try
            {
                const response = await api.get('/user');
                setIsLoading(false);
                if (response.data.success && response.data.user) setUser(response.data.user) 
            }
            catch (err)
            {
                if (err.status === 401) {
                    setIsLoading(false)
                }
                throw new Error(err);
            }
        })()
    }, []);

    const login = async (credentials) => {
        try
        {
            const response = await api.post('/login', credentials);
            setUser(response.data.user);
            return { success: true, user: response.data.user }
        }
        catch (err)
        {
            if (err instanceof AxiosError && err.status === 422) {
                return { success: false, errors: err.response.data.errors }
            }
            throw new Error(err)
        }
    }

    const register = async (userDetails) => {
        try
        {
            const response = await api.post('/register', userDetails);
            return { success: true, data: response.data }
        }
        catch (err)
        {
            if (err instanceof AxiosError && err.status === 422) {
                return { success: false, errors: err.response.data.errors }
            }
            throw new Error(err)
        }
    }

    const logout = async () => {
        try
        {
            await api.post('/logout');
            setUser(null);
        }
        catch (err)
        {
            throw new Error(err)
        }
    }
    
    return (
        <AuthContext.Provider value={{ login, register, logout, user, isLoading }}>
            { children }    
        </AuthContext.Provider>
    )
}

const useAuth = () => useContext(AuthContext)
export { AuthProvider, useAuth, AuthContext };