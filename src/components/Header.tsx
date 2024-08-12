import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu"
import { ModeToggle } from "./mode-toggle"
import { Avatar, AvatarFallback } from "./ui/avatar"
import { useAuthStore } from "../store/authStore"

export const Header = () => {
    const user = useAuthStore(st => st.user)
    const logout = useAuthStore(st => st.logout)

    function handleLogOut() {
        logout()
    }

    return (
        <header className='flex justify-between m-2'>
            <h1 className='text-2xl'>App de Documentos</h1>
            <div className='flex gap-2'>
                {/* <Link to="/">Home</Link> */}

                <label className='ml-5 flex gap-2 items-center'>
                    {user?.email}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Avatar className=''>
                                {/* <AvatarImage src="" alt="" /> */}
                                <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>Ajustes</DropdownMenuItem>
                            <DropdownMenuItem>Soporte</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={handleLogOut}>Cerrar Sesion</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <ModeToggle />

                </label>


            </div>
        </header>
    )
}
