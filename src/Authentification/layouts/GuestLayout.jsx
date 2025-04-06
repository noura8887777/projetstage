import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../AuthContext"

const GuestLayout = () => {
    const { user, isLoading } = useAuth();
    console.log(user)
    return isLoading ? <p>Loading</p> : 
    user !== null ? 
    <Navigate to="/dashboard" replace={ true } /> : 
    <Outlet />
}

export default GuestLayout