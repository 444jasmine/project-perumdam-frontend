import React, { useState } from 'react';
import { ChevronLeft, Eye, EyeOff, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { login } from '../../api';
import { setAuthToken } from '../../auth';

const Login = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        rememberMe: false,
        keepMeLogin: true
    });
    const [errors, setErrors] = useState({
        username: '',
        password: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors({ ...errors, [name]: '' });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        let newErrors = { username: '', password: '' };
        let hasError = false;

        if (!formData.username.trim()) {
            newErrors.username = 'Username wajib diisi';
            hasError = true;
        }

        if (!formData.password.trim()) {
            newErrors.password = 'Password wajib diisi';
            hasError = true;
        }

        if (hasError) {
            setErrors(newErrors);
            return;
        }

        setIsSubmitting(true);

        try {
            const result = await login(formData.username, formData.password);

            if (!result?.token) {
                throw new Error('Token tidak ditemukan dari server');
            }

            setAuthToken(result.token);
            navigate('/home', { replace: true });
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Login gagal';

            setErrors({
                username: '',
                password: message
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen px-5 py-6 flex flex-col bg-[linear-gradient(180deg,rgba(245,251,255,0.96)_0%,rgba(232,243,250,0.98)_100%)]">
            <div className="flex items-center mb-6 px-1 w-full">
                <button
                    onClick={() => navigate(-1)}
                    className="p-2 text-[#0f3553] hover:bg-white/80 rounded-full transition-colors active:scale-95"
                >
                    <ChevronLeft size={24} />
                </button>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center w-full px-1 pb-3">
                <div className="hero-card w-full px-5 py-6 text-center mb-5">
                    <div className="brand-row justify-center mb-4">
                        <div className="brand-badge">
                            <span className="font-extrabold text-[15px]">P</span>
                        </div>
                        <div className="text-left">
                            <p className="m-0 text-[11px] uppercase tracking-[0.2em] text-[#0a7db7] font-bold">Perumdam Bantul</p>
                            <p className="m-0 text-[13px] text-[#527085]">Survey System</p>
                        </div>
                    </div>

                    <h1 className="page-title text-[30px]">Login</h1>
                    <p className="page-subtitle max-w-[290px] mx-auto">
                        Untuk masuk ke akun di aplikasi, masukkan username dan password.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="section-card w-full px-4 py-5 flex flex-col animate-[fadeIn_0.5s_ease-out]">
                    <div>
                        <Input
                            label="Username"
                            name="username"
                            placeholder="Masukkan username"
                            value={formData.username}
                            onChange={handleChange}
                            error={errors.username}
                            required
                        />

                        <Input
                            label="Password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Masukkan password"
                            value={formData.password}
                            onChange={handleChange}
                            error={errors.password}
                            required
                            rightIcon={
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="focus:outline-none"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            }
                        />

                        <div className="flex flex-col gap-[12px] mt-[22px] mb-[28px] pl-2">
                            <label className="flex items-center text-[14px] leading-[140%] text-[#173043] cursor-pointer group" style={{ fontFamily: 'Inter' }}>
                                <input
                                    type="checkbox"
                                    name="rememberMe"
                                    className="hidden"
                                    checked={formData.rememberMe}
                                    onChange={handleChange}
                                />
                                <div className={`w-[16px] h-[16px] rounded-[4px] flex items-center justify-center mr-3 border-[1.6px] transition-all duration-200 ${formData.rememberMe
                                    ? 'bg-[#2C2C2C] border-[#2C2C2C]'
                                    : 'bg-white border-[#757575] group-hover:border-[#2C2C2C]'
                                    }`}>
                                    {formData.rememberMe && <Check size={12} color="white" strokeWidth={3} />}
                                </div>
                                Remember me
                            </label>

                            <label className="flex items-center text-[14px] leading-[140%] text-[#173043] cursor-pointer group" style={{ fontFamily: 'Inter' }}>
                                <input
                                    type="checkbox"
                                    name="keepMeLogin"
                                    className="hidden"
                                    checked={formData.keepMeLogin}
                                    onChange={handleChange}
                                />
                                <div className={`w-[16px] h-[16px] rounded-[4px] flex items-center justify-center mr-3 border-[1.6px] transition-all duration-200 ${formData.keepMeLogin
                                    ? 'bg-[#2C2C2C] border-[#2C2C2C]'
                                    : 'bg-white border-[#757575] group-hover:border-[#2C2C2C]'
                                    }`}>
                                    {formData.keepMeLogin && <Check size={12} color="white" strokeWidth={3} />}
                                </div>
                                Keep me login
                            </label>
                        </div>

                        <Button type="submit" disabled={isSubmitting} className="!max-w-none !h-[52px] !text-[18px]">
                            {isSubmitting ? 'Memproses...' : 'Login'}
                        </Button>

                        <div className="text-center mt-5">
                            <p className="text-[12px] leading-[150%] tracking-[-0.011em] text-[#527085]" style={{ fontFamily: 'Inter' }}>
                                Lupa password? <a href="#" className="text-link">Hubungi admin</a>
                            </p>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
