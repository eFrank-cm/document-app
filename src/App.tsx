import { Navigate, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from './components/theme-provider';
import { SearchDocumentPage } from './documents/SearchPage';
import { DocumentDetailsPage } from './documents/DetailPage';
import { Toaster } from './components/ui/toaster';
import { LoginPage } from './pages/Login';
import './App.css'
import { ProtectedRoute } from './components/protectedRoutes';
import { NotFound } from './pages/NotFound';
import { ViewPDF } from './documents/viewPDF';

export const App = () => {

	return (
		<ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
			<Routes>
				<Route path='/' element={<Navigate to='/documents' />} />
				<Route path='/login' element={<LoginPage />} />
				<Route path='/documents' element={
					<ProtectedRoute roles={['admin', 'consultor']}>
						<SearchDocumentPage />
					</ProtectedRoute>
				} />
				<Route path='/document/:id' element={
					<ProtectedRoute roles={['admin']} defaultRoute='/documents'>
						<DocumentDetailsPage />
					</ProtectedRoute>
				} />
				<Route path='/show/:url' element={<ViewPDF />} />
				<Route path='*' element={<NotFound />} />

			</Routes>
			<Toaster />
		</ThemeProvider>
	)
}
