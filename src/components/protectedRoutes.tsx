import { Navigate } from "react-router-dom"
import { useAuthStore } from "../store/authStore"
import { FC, ReactNode } from "react"
import { Role } from "../types"

interface ProtectedRoute {
    children: ReactNode,
    roles: Role[],
    defaultRoute?: string
}

export const ProtectedRoute: FC<ProtectedRoute> = ({ children, roles, defaultRoute = '/login' }) => {
    const user = useAuthStore(st => st.user)

    if (!user || !user.token || !roles.includes(user.role)) {
        console.log('some error login')
        return <Navigate to={defaultRoute} />
    }

    return <>{children}</>
}
