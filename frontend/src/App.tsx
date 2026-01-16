import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { ProtectedRoute } from './components/routes/ProtectedRoute';
import { Role } from './types/auth';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
					
          <Route
            path="/dashboard"
            element={ 
							<ProtectedRoute>
								<Dashboard />
							</ProtectedRoute> 
						}
          />

          <Route
            path="/admin/users"
            element={
              <ProtectedRoute requiredRole={Role.ADMIN}>
                <div className="p-8">
                  <h1 className="text-2xl font-bold">Gestión de Usuarios (Solo Admin)</h1>
                </div>
              </ProtectedRoute>
            }
          />

          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          
          {/* Matches non-existing paths */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;