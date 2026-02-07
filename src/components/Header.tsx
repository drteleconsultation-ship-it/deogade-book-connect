import React from 'react';
import logoImage from '@/assets/logo-new.jpg';
import doctorPhoto from '@/assets/doctor-photo.jpg';
import LanguageSelector from '@/components/LanguageSelector';
import ThemeToggle from '@/components/ThemeToggle';
import ClinicStatusBadge from '@/components/ClinicStatusBadge';

const Header: React.FC = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <div className="flex justify-center items-center gap-4 flex-1">
            <img 
              src={doctorPhoto} 
              alt="Dr. Deogade - Medical Professional" 
              className="h-20 w-20 rounded-full object-cover border-2 border-primary/20"
            />
            <img 
              src={logoImage} 
              alt="Dr Deogade Clinic Logo - Rejuvenating Life" 
              className="h-24 w-auto object-contain"
            />
          </div>
          
          <div className="flex items-center gap-3">
            <ClinicStatusBadge />
            <ThemeToggle />
            <LanguageSelector />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;