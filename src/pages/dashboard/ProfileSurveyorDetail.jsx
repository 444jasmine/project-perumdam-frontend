import React, { useState } from 'react';
import { ChevronLeft, UserRound } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import BottomNavigation from '../../components/layout/BottomNavigation';
import { getSurveyorProfileById, saveSurveyorProfile } from './profileStorage';

const ProfileSurveyorDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [profile, setProfile] = useState(() => getSurveyorProfileById(id));
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;
    setProfile((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSave = () => {
    saveSurveyorProfile(id, profile);
    setIsEditing(false);
    navigate('/profile');
  };

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

      <div className="px-[16px] flex-1 flex flex-col">
        <div className="flex items-center gap-[12px] mb-[18px]">
          <div className="w-[66px] h-[66px] rounded-full bg-[#35C2FF] flex items-center justify-center shrink-0">
            <UserRound size={34} className="text-[#015E9C]" strokeWidth={2.2} />
          </div>
          <div>
            <p className="text-[#000000] font-bold text-[13px] uppercase" style={{ fontFamily: 'Inter, sans-serif' }}>
              {profile.fullName || 'Nama Surveyor'}
            </p>
            <div className="mt-[4px] w-[104px] h-[20px] rounded-[5px] bg-[#75C8EA] flex items-center justify-center">
              <span className="text-[#003654] text-[11px]" style={{ fontFamily: 'Inter, sans-serif' }}>
                {profile.role || 'Surveyor 1'}
              </span>
            </div>
          </div>
        </div>

        <div className="border-t-2 border-[#015E9C] mb-[14px]"></div>

        <div className="space-y-[10px]">
          <ProfileField label="Nama lengkap" name="fullName" value={profile.fullName} onChange={handleChange} disabled={!isEditing} />
          <ProfileField label="No. Pegawai" name="employeeNumber" value={profile.employeeNumber} onChange={handleChange} disabled={!isEditing} />
          <ProfileField label="Nomor Telepon" name="phoneNumber" value={profile.phoneNumber} onChange={handleChange} disabled={!isEditing} />
          <ProfileField label="Email" name="email" type="email" value={profile.email} onChange={handleChange} disabled={!isEditing} />
        </div>

        {message && (
          <p className="mt-[12px] text-[12px] text-center text-[#003654] font-semibold" style={{ fontFamily: 'Inter, sans-serif' }}>
            {message}
          </p>
        )}

        <div className="mt-auto mb-[12px] grid grid-cols-2 gap-[14px]">
          <button
            type="button"
            onClick={() => {
              setIsEditing(true);
              setMessage('');
            }}
            className="h-[38px] rounded-[6px] font-bold text-[14px] text-[#003654]"
            style={{ fontFamily: 'Inter, sans-serif', backgroundColor: '#75C8EA' }}
          >
            EDIT
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="h-[38px] rounded-[6px] font-bold text-[14px] text-[#003654] disabled:opacity-60"
            style={{ fontFamily: 'Inter, sans-serif', backgroundColor: '#75C8EA' }}
            disabled={!isEditing}
          >
            SIMPAN
          </button>
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
};

const ProfileField = ({ label, name, value, onChange, disabled, type = 'text' }) => {
  return (
    <label className="block">
      <span className="block text-[#1E1E1E] text-[11px] mb-[4px]" style={{ fontFamily: 'Inter, sans-serif' }}>
        {label}
      </span>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className="w-full h-[27px] border border-[#8AB6CF] bg-white px-[8px] text-[12px] text-[#1E1E1E] outline-none disabled:bg-[#F4F8FB]"
        style={{ fontFamily: 'Inter, sans-serif' }}
      />
    </label>
  );
};

export default ProfileSurveyorDetail;
