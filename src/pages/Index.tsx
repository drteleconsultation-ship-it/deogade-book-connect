import React, { useState, useEffect, useCallback } from 'react';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import MissionSection from '@/components/MissionSection';
import ChargesSection from '@/components/ChargesSection';
import AboutSection from '@/components/AboutSection';
import ServicesSection from '@/components/ServicesSection';
import MapSection from '@/components/MapSection';
import BookingModal from '@/components/BookingModal';
import FloatingButtons from '@/components/FloatingButtons';
import InstallPrompt from '@/components/InstallPrompt';
import PageLoader from '@/components/PageLoader';
import SocialShareButtons from '@/components/SocialShareButtons';
import ScrollToTop from '@/components/ScrollToTop';
import { LanguageProvider } from '@/components/LanguageSelector';
import useKeyboardShortcuts from '@/hooks/useKeyboardShortcuts';

const Index = () => {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Keyboard shortcut handlers
  const scrollToSection = useCallback((sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  const handleHome = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleBooking = useCallback(() => {
    setIsBookingOpen(true);
  }, []);

  // Initialize keyboard shortcuts
  useKeyboardShortcuts({
    onBooking: handleBooking,
    onHome: handleHome,
    onServices: () => scrollToSection('services'),
    onAbout: () => scrollToSection('about'),
    onContact: () => scrollToSection('contact'),
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('book') === 'true' || params.get('action') === 'book') {
      setIsBookingOpen(true);
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  useEffect(() => {
    // Minimum display time for loader (prevents flash)
    const minLoadTime = 800;
    const maxLoadTime = 3000;
    const startTime = Date.now();

    const hideLoader = () => {
      const elapsed = Date.now() - startTime;
      const remainingTime = Math.max(0, minLoadTime - elapsed);
      
      setTimeout(() => {
        setIsLoading(false);
      }, remainingTime);
    };

    // Hide loader when window fully loads or after max time
    if (document.readyState === 'complete') {
      hideLoader();
    } else {
      window.addEventListener('load', hideLoader);
    }

    // Force hide after max time
    const maxTimeout = setTimeout(() => {
      setIsLoading(false);
    }, maxLoadTime);

    return () => {
      window.removeEventListener('load', hideLoader);
      clearTimeout(maxTimeout);
    };
  }, []);

  return (
    <LanguageProvider>
      <PageLoader isVisible={isLoading} />
      <div className={`min-h-screen bg-background transition-opacity duration-500 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
        <Header />
        <HeroSection onBookingClick={() => setIsBookingOpen(true)} />
        <MissionSection />
        <ChargesSection />
        <AboutSection />
        <ServicesSection />
        <MapSection />
        
        <BookingModal 
          isOpen={isBookingOpen} 
          onClose={() => setIsBookingOpen(false)} 
        />
        
        <FloatingButtons />
        <InstallPrompt />
        <SocialShareButtons />
        <ScrollToTop />
      </div>
    </LanguageProvider>
  );
};

export default Index;