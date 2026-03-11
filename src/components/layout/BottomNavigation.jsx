import React from 'react';
import { Home as HomeIcon, Layers, User } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const BottomNavigation = () => {
    const location = useLocation();

    const navItems = [
        { path: '/home', icon: HomeIcon, id: 'home' },
        { path: '/entri-survey', icon: Layers, id: 'survey-list' },
        { path: '/profile', icon: User, id: 'profile' },
    ];

    return (
        <div className="fixed bottom-0 w-full max-w-[420px] h-[61px] bg-[#068EC9] flex justify-between items-center px-[52px] z-50">
            {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                const Icon = item.icon;

                return (
                    <Link to={item.path} key={item.id} className="relative flex items-center justify-center h-full pt-1">
                        <Icon
                            size={isActive ? 32 : 30}
                            color="white"
                            strokeWidth={isActive ? 2.5 : 2}
                            className={isActive ? "opacity-100" : "opacity-80"}
                        />
                    </Link>
                );
            })}
        </div>
    );
};

export default BottomNavigation;
