import React from 'react';
import { Home as HomeIcon, Layers, User } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const BottomNavigation = () => {
    const location = useLocation();

    const navItems = [
        { path: '/home', icon: HomeIcon, id: 'home' },
        { path: '/list-surveyor', icon: Layers, id: 'survey-list' },
        { path: '/profile', icon: User, id: 'profile' },
    ];

    const isItemActive = (path) => {
        if (path === '/list-surveyor') {
            return (
                location.pathname === '/list-surveyor' ||
                location.pathname === '/hasil-survey' ||
                location.pathname === '/entri-survey' ||
                location.pathname.startsWith('/survey/')
            );
        }

        if (path === '/profile') {
            return location.pathname === '/profile' || location.pathname.startsWith('/profile/');
        }

        return location.pathname === path;
    };

    return (
        <div className="fixed left-1/2 -translate-x-1/2 bottom-3 w-[calc(100%-24px)] max-w-[396px] h-[68px] bg-white/92 backdrop-blur-md border border-[#CFE3EF] rounded-[24px] shadow-[0_16px_30px_rgba(1,94,156,0.16)] flex justify-between items-center px-8 z-50">
            {navItems.map((item) => {
                const isActive = isItemActive(item.path);
                const Icon = item.icon;

                return (
                    <Link
                        to={item.path}
                        key={item.id}
                        className={`w-[48px] h-[48px] rounded-full grid place-items-center transition-all ${isActive ? 'bg-[#0a7db7] text-white shadow-[0_12px_20px_rgba(10,125,183,0.22)]' : 'text-[#6d879b]'}`}
                    >
                        <Icon
                            size={isActive ? 28 : 24}
                            color="currentColor"
                            strokeWidth={isActive ? 2.5 : 2}
                            className={isActive ? 'opacity-100' : 'opacity-85'}
                        />
                    </Link>
                );
            })}
        </div>
    );
};

export default BottomNavigation;
