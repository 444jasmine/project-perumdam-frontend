import React, { useState } from 'react';
import { ChevronLeft, Eye, EyeOff, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

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

    const handleSubmit = (e) => {
        e.preventDefault();

        let newErrors = { username: '', password: '' };
        let hasError = false;

        // Dummy authentication validation
        if (formData.username !== 'admin') {
            newErrors.username = 'Username tidak valid';
            hasError = true;
        }

        if (formData.username === 'admin' && formData.password !== 'admin') {
            newErrors.password = 'Password salah';
            hasError = true;
        }

        if (hasError) {
            setErrors(newErrors);
            return;
        }

        console.log('Login success:', formData);
        // Simulate successful login and navigate to home
        navigate('/home');
    };

    return (
        <div className="min-h-screen bg-white flex flex-col p-6">
            {/* Header */}
            <div className="flex items-center mb-10 mt-6 px-2 w-full max-w-[400px] mx-auto">
                <button
                    onClick={() => navigate(-1)}
                    className="p-2 text-[#1E1E1E] hover:bg-gray-100 rounded-full transition-colors active:scale-95"
                >
                    <ChevronLeft size={24} />
                </button>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col items-center w-full px-4">
                <div className="text-center mb-[42px] mt-4">
                    <h1 className="text-[#1E576F] font-bold text-[32px] leading-[150%] tracking-[-0.011em]" style={{ fontFamily: 'Montserrat, sans-serif' }}>Login</h1>
                    <p className="text-black text-[16px] leading-[150%] tracking-[-0.011em] mt-2 max-w-[300px] mx-auto opacity-90" style={{ fontFamily: 'Inter, sans-serif' }}>
                        Untuk masuk ke akun di aplikasi, masukkan username dan password.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="w-full max-w-[303px] flex flex-col animate-[fadeIn_0.5s_ease-out]">
                    <div className="mb-4">
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

                        <div className="flex flex-col gap-[12px] mt-[26px] mb-[60px] pl-2">
                            <label className="flex items-center text-[16px] leading-[140%] text-[#1E1E1E] cursor-pointer group" style={{ fontFamily: 'Inter' }}>
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

                            <label className="flex items-center text-[16px] leading-[140%] text-[#1E1E1E] cursor-pointer group" style={{ fontFamily: 'Inter' }}>
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

                        <Button type="submit">
                            Login
                        </Button>

                        <div className="text-center mt-6">
                            <p className="text-[13px] leading-[150%] tracking-[-0.011em] text-black" style={{ fontFamily: 'Inter' }}>
                                Lupa password? <a href="#" className="font-bold">Hubungi admin</a>
                            </p>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
