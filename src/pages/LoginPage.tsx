import { ChangeEvent, FormEvent, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { User } from "../types";
import { useUserStore } from "../store/userStore";

const admin: User = {
    username: 'Admin',
    email: 'admin@gmail.com',
    password: '123456',
    type: 'admin',
}

const normal: User = {
    username: 'User',
    email: 'normal@gmail.com',
    password: '123456',
    type: 'normal',
}

const initialState: User = { username: '', email: '', password: '', type: 'normal' }

export const LoginPage = () => {
    const user = useUserStore(st => st.user)
    const navigate = useNavigate()

    const login = useUserStore(st => st.login)
    const [loginForm, setLogInForm] = useState<User>(initialState)
    const { email, password } = loginForm

    useEffect(() => {
        if (user) navigate('/documents')
    }, [])

    function handleOnChange(event: ChangeEvent<HTMLInputElement>) {
        const { id, value } = event.target
        setLogInForm(prev => ({
            ...prev,
            [id]: value
        }))
    }

    function handleOnSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        login(loginForm)
        navigate('/documents')
        // console.log(JSON.stringify(loginForm) === JSON.stringify(correctAcount))
        // if (JSON.stringify(loginForm) === JSON.stringify(correctAcount)) {
        //     navigate('/search-location')
        // }
    }

    return (
        <main className="w-full">

            <section className="mt-28">
                <Card className="mx-auto max-w-sm">
                    <CardHeader>
                        <CardTitle className="text-2xl">Iniciar Sesion</CardTitle>
                        <CardDescription>
                            Ingrese su correo y contraseña para iniciar sesion
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleOnSubmit}>
                            <div className="grid gap-4">
                                <div className="grid gap-2">
                                    <label htmlFor="email">Correo Electronico</label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="email@example.com"
                                        value={email}
                                        onChange={handleOnChange}
                                        required
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <div className="flex items-center">
                                        <label htmlFor="password">Contraseña</label>
                                    </div>
                                    <Input
                                        id="password"
                                        type="password"
                                        value={password}
                                        onChange={handleOnChange}
                                        required
                                    />
                                </div>
                                <Button type="submit" className="w-full">
                                    Iniciar Sesion
                                </Button>
                            </div>
                            <div className="mt-4 text-center text-sm">
                                {/* Don&apos;t have an account?{" "} */}
                                {/* <a href="#" className="underline" >Sign up</a> */}
                                <div className="flex gap-1 mt-2">
                                    <Button size='sm' variant='outline' onClick={() => setLogInForm(normal)} type='button'>cargar usurio normal</Button>
                                    <Button size='sm' variant='outline' onClick={() => setLogInForm(admin)} type='button'>cargar usurio admin</Button>
                                </div>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </section>
        </main >
    )
}
