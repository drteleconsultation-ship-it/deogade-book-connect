import React from 'react';
import logoImage from '@/assets/logo.jpg';
import LanguageSelector from '@/components/LanguageSelector';

const Header: React.FC = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <div className="flex justify-center flex-1">
            <img 
              src={logoImage} 
              alt="Dr Deogade Clinic Logo - Rejuvenating Life" 
              className="h-16 w-auto object-contain"
            />
          </div>
          
          <div className="flex items-center gap-4">
            <LanguageSelector />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;