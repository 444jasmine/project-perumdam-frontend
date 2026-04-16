import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Splash from './pages/auth/Splash';
import Welcome from './pages/auth/Welcome';
import Login from './pages/auth/Login';
import Home from './pages/dashboard/Home';
import ProfileSurveyor from './pages/dashboard/ProfileSurveyor';
import ProfileSurveyorDetail from './pages/dashboard/ProfileSurveyorDetail';
import EntriSurvey from './pages/survey/EntriSurvey';
import InformasiPelanggan from './pages/survey/InformasiPelanggan';
import ListSurveyor from './pages/survey/ListSurveyor';
import MulaiSurvey from './pages/survey/MulaiSurvey';
import RekapRab from './pages/survey/RekapRab';
import HasilSurvey from './pages/survey/HasilSurvey';
import PreviewNotaSurvey from './pages/survey/PreviewNotaSurvey';
import { hasValidSession } from './auth';

function ProtectedRoute({ children }) {
    return hasValidSession() ? children : <Navigate to="/login" replace />;
}

function GuestRoute({ children }) {
    return hasValidSession() ? <Navigate to="/home" replace /> : children;
}

function App() {
    return (
        <BrowserRouter>
            <div className="app-shell overflow-x-hidden">
                <div className="app-frame">
                    <Routes>
                        <Route path="/splash" element={<GuestRoute><Splash /></GuestRoute>} />
                        <Route path="/welcome" element={<GuestRoute><Welcome /></GuestRoute>} />
                        <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
                        <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
                        <Route path="/profile" element={<ProtectedRoute><ProfileSurveyor /></ProtectedRoute>} />
                        <Route path="/profile/:id" element={<ProtectedRoute><ProfileSurveyorDetail /></ProtectedRoute>} />
                        <Route path="/list-surveyor" element={<ProtectedRoute><ListSurveyor /></ProtectedRoute>} />
                        <Route path="/" element={<Navigate to="/splash" replace />} />
                        <Route path="/entri-survey" element={<ProtectedRoute><EntriSurvey /></ProtectedRoute>} />
                        <Route path="/hasil-survey" element={<ProtectedRoute><HasilSurvey /></ProtectedRoute>} />
                        <Route path="/hasil-survey/:id/nota" element={<ProtectedRoute><PreviewNotaSurvey /></ProtectedRoute>} />
                        <Route path="/survey/:id" element={<ProtectedRoute><InformasiPelanggan /></ProtectedRoute>} />
                        <Route path="/survey/:id/mulai" element={<ProtectedRoute><MulaiSurvey /></ProtectedRoute>} />
                        <Route path="/survey/:id/rekap-rab" element={<ProtectedRoute><RekapRab /></ProtectedRoute>} />

                        {/* Catch all route - redirect to splash */}
                        <Route path="*" element={<Navigate to="/splash" replace />} />
                    </Routes>
                </div>
            </div>
        </BrowserRouter>
    );
}

export default App;
