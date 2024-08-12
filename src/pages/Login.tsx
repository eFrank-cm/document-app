import { ChangeEvent, FormEvent, useState } from "react"
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { useAuthStore } from "../store/authStore";
import { useNavigate } from "react-router-dom";


interface loginFields {
    email: string
    password: string
}

const initialState: loginFields = { email: '', password: '' }


export const LoginPage = () => {
    const [loginForm, setLogInForm] = useState<loginFields>(initialState)
    const { email, password } = loginForm
    const login = useAuthStore(st => st.login)
    const navigate = useNavigate()

    function handleOnChange(event: ChangeEvent<HTMLInputElement>) {
        const { id, value } = event.target
        setLogInForm(prev => ({
            ...prev,
            [id]: value
        }))
    }

    async function handleLogIn(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        try {
            await login(email, password) // here there are a 'throw'
            navigate('/documents')
        } catch (error) {
            console.log('Error logging in: ', error)
        }
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
                        <form onSubmit={handleLogIn}>
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
                                {/* <div className="flex gap-1 mt-2">
                                    <Button size='sm' variant='outline' onClick={() => setLogInForm(normal)} type='button'>cargar usurio normal</Button>
                                    <Button size='sm' variant='outline' onClick={() => setLogInForm(admin)} type='button'>cargar usurio admin</Button>
                                </div> */}
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </section>
        </main >
    )
}
