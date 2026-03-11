import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Splash from './pages/auth/Splash';
import Welcome from './pages/auth/Welcome';
import Login from './pages/auth/Login';
import Home from './pages/dashboard/Home';
import EntriSurvey from './pages/survey/EntriSurvey';
import InformasiPelanggan from './pages/survey/InformasiPelanggan';

function App() {
    return (
        <BrowserRouter>
            <div className="w-full min-h-screen bg-gray-50 flex justify-center overflow-x-hidden">
                <div className="w-full max-w-[420px] bg-white shadow-xl min-h-screen relative overflow-x-hidden">
                    <Routes>
                        <Route path="/splash" element={<Splash />} />
                        <Route path="/welcome" element={<Welcome />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/home" element={<Home />} />
                        <Route path="/" element={<Navigate to="/splash" replace />} />
                        <Route path="/entri-survey" element={<EntriSurvey />} />
                        <Route path="/survey/:id" element={<InformasiPelanggan />} />

                        {/* Catch all route - redirect to splash */}
                        <Route path="*" element={<Navigate to="/splash" replace />} />
                    </Routes>
                </div>
            </div>
        </BrowserRouter>
    );
}

export default App;
