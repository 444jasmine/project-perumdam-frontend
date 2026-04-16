import React from 'react';
import { ChevronRight, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import BottomNavigation from '../../components/layout/BottomNavigation';
import { getCurrentSurveyorProfile } from './profileStorage';
import { logout } from '../../auth';

const ProfileSurveyor = () => {
    const navigate = useNavigate();
    const currentProfile = getCurrentSurveyorProfile();

    const handleLogout = () => {
        logout();
        navigate('/login', { replace: true });
    };

    return (
        <div className="min-h-screen bg-[#F8FBFF] flex flex-col relative w-full h-full pb-[88px]">
            <div className="flex items-center justify-center px-[18px] pt-[16px] pb-[18px]">
                <h1 className="text-[#000000] font-bold text-[22px]" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Profile
                </h1>
            </div>

            <div className="px-[12px] flex-1 flex flex-col">
                <p className="text-[#000000] text-[11px] mb-[8px]" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Nama Surveyor
                </p>

                <div className="space-y-[10px]">
                    {currentProfile && (
                        <button
                            key={currentProfile.id}
                            type="button"
                            onClick={() => navigate(`/profile/${currentProfile.id}`)}
                            className="w-full rounded-[10px] border border-[#3B91C0] bg-white px-[10px] py-[10px] text-left"
                        >
                            <div className="flex items-center justify-between gap-3">
                                <div>
                                    <p className="text-[#000000] font-bold text-[12px]" style={{ fontFamily: 'Inter, sans-serif' }}>
                                        {currentProfile.fullName}
                                    </p>
                                    <p className="text-[#000000] text-[11px] mt-[2px]" style={{ fontFamily: 'Inter, sans-serif' }}>
                                        {currentProfile.role}
                                    </p>
                                    <p className="text-[#4B5563] text-[10px] mt-[4px]" style={{ fontFamily: 'Inter, sans-serif' }}>
                                        ID : {currentProfile.employeeNumber || '-'}
                                    </p>
                                </div>
                                <ChevronRight size={18} className="text-[#1E1E1E] shrink-0" strokeWidth={2.2} />
                            </div>
                        </button>
                    )}

                    {!currentProfile && (
                        <p className="text-[#4B5563] text-[12px]" style={{ fontFamily: 'Inter, sans-serif' }}>
                            Profil akun tidak ditemukan.
                        </p>
                    )}
                </div>

                <div className="mt-auto pt-[14px] pb-[8px]">
                    <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full rounded-[10px] border border-[#E53E3E] bg-[#FFF5F5] px-[12px] py-[10px] text-[#C53030] font-semibold text-[12px] flex items-center justify-center gap-2"
                    >
                        <LogOut size={16} />
                        Logout
                    </button>
                </div>
            </div>

            <BottomNavigation />
        </div>
    );
};

export default ProfileSurveyor;
