import { Navigate, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from './components/theme-provider';
import { SearchLocation } from './pages/SearchLocation';
import { DocumentFormPage } from './documents/formPage';
import { Toaster } from './components/ui/toaster';
import { LoginPage } from './pages/LoginPage';
import './App.css'
import { ProtectedRoutes } from './components/protectedRoutes';
// import { HomePage } from './pages/HomePage';

export const App = () => {

	return (
		<ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">

			<Routes>
				<Route path='/' element={<Navigate to='/login' />} />
				<Route path='/login' element={<LoginPage />} />
				{/* <Route path='/register' element={<RegisterPage />} /> */}
				<Route element={<ProtectedRoutes />} >
					<Route path='/documents' element={<SearchLocation />} />
					<Route path='/document/create' element={<DocumentFormPage />} />
					<Route path='/document/:id' element={<DocumentFormPage />} />
					<Route path='/:url' />
				</Route>
			</Routes>
			<Toaster />
		</ThemeProvider>
	)
}
