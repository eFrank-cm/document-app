import { Navigate, Outlet } from "react-router-dom"
import { useUserStore } from "../store/userStore"


export const ProtectedRoutes = () => {
    const user = useUserStore(st => st.user)
    return user ? <Outlet /> : <Navigate to={'/login'} />
}
