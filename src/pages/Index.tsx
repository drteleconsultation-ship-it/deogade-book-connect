import React, { useState } from 'react';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import AboutSection from '@/components/AboutSection';
import ServicesSection from '@/components/ServicesSection';
import BookingModal from '@/components/BookingModal';
import WhatsAppButton from '@/components/WhatsAppButton';

const Index = () => {
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSection onBookingClick={() => setIsBookingOpen(true)} />
      <AboutSection />
      <ServicesSection />
      
      <BookingModal 
        isOpen={isBookingOpen} 
        onClose={() => setIsBookingOpen(false)} 
      />
      
      <WhatsAppButton />
    </div>
  );
};

export default Index;