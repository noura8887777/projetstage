import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../AuthContext"
import Navbar from "../../Navbar"

const DashboardLayout = () => {
    const { user, isLoading } = useAuth();
    return isLoading ? <p>Loading</p> : 
    user === null ? 
    <Navigate to="/" replace={ true } /> : 
    <>
        <Navbar />
        <Outlet />
    </>
}

export default DashboardLayout