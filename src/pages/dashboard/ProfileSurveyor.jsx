import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import BottomNavigation from '../../components/layout/BottomNavigation';
import { getSurveyorProfiles } from './profileStorage';

const ProfileSurveyor = () => {
    const navigate = useNavigate();
    const profiles = getSurveyorProfiles();

    return (
        <div className="min-h-screen bg-[#F8FBFF] flex flex-col relative w-full h-full pb-[88px]">
            <div className="flex items-center px-[18px] pt-[16px] pb-[18px] relative">
                <button
                    onClick={() => navigate(-1)}
                    className="p-1 z-10 text-[#1E1E1E] hover:bg-gray-100 rounded-full transition-colors active:scale-95"
                    aria-label="Kembali"
                >
                    <ChevronLeft size={26} strokeWidth={2.8} />
                </button>
                <div className="absolute inset-0 flex justify-center items-center pointer-events-none">
                    <h1 className="text-[#000000] font-bold text-[22px]" style={{ fontFamily: 'Inter, sans-serif' }}>
                        Profile
                    </h1>
                </div>
            </div>

            <div className="px-[12px] flex-1 flex flex-col">
                <p className="text-[#000000] text-[11px] mb-[8px]" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Nama Surveyor
                </p>

                <div className="space-y-[10px]">
                    {profiles.map((profile) => (
                        <button
                            key={profile.id}
                            type="button"
                            onClick={() => navigate(`/profile/${profile.id}`)}
                            className="w-full rounded-[10px] border border-[#3B91C0] bg-white px-[10px] py-[10px] text-left"
                        >
                            <div className="flex items-center justify-between gap-3">
                                <div>
                                    <p className="text-[#000000] font-bold text-[12px]" style={{ fontFamily: 'Inter, sans-serif' }}>
                                        {profile.fullName}
                                    </p>
                                    <p className="text-[#000000] text-[11px] mt-[2px]" style={{ fontFamily: 'Inter, sans-serif' }}>
                                        {profile.role}
                                    </p>
                                    <p className="text-[#4B5563] text-[10px] mt-[4px]" style={{ fontFamily: 'Inter, sans-serif' }}>
                                        ID : {profile.employeeNumber || '-'}
                                    </p>
                                </div>
                                <ChevronRight size={18} className="text-[#1E1E1E] shrink-0" strokeWidth={2.2} />
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            <BottomNavigation />
        </div>
    );
};

export default ProfileSurveyor;
