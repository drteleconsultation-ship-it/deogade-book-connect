import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, MapPin, Phone } from 'lucide-react';
import heroImage from '@/assets/clinic-hero.jpg';
import { useLanguage } from '@/components/LanguageSelector';
import ScrollAnimationWrapper from '@/components/ScrollAnimationWrapper';

interface HeroSectionProps {
  onBookingClick: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onBookingClick }) => {
  const { t } = useLanguage();
  const [scrollY, setScrollY] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        if (rect.bottom > 0) {
          setScrollY(window.scrollY);
        }
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  return (
    <section ref={sectionRef} className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background Image with Parallax */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroImage} 
          alt="Dr. Deogade Clinic - Professional Medical Care" 
          className="w-full h-[120%] object-cover"
          style={{ transform: `translateY(${scrollY * -0.3}px)` }}
        />
        <div className="absolute inset-0 bg-hero-gradient opacity-85" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-20 text-center text-white">
        <div className="max-w-4xl mx-auto">
          <ScrollAnimationWrapper variant="fade-up">
            <h1 className="text-5xl md:text-7xl font-bold mb-4 leading-tight">
              {t('header.title')}
            </h1>
          </ScrollAnimationWrapper>
          <ScrollAnimationWrapper variant="fade-up" delay={100}>
            <div className="text-lg md:text-xl mb-8 opacity-95 font-medium">
              {t('header.subtitle')}
            </div>
          </ScrollAnimationWrapper>
          <ScrollAnimationWrapper variant="fade-up" delay={200}>
            <p className="text-xl md:text-2xl mb-8 opacity-90 leading-relaxed">
              {t('hero.title')}
            </p>
          </ScrollAnimationWrapper>
          <ScrollAnimationWrapper variant="fade-up" delay={300}>
            <p className="text-lg mb-12 opacity-80 max-w-2xl mx-auto">
              {t('hero.subtitle')}
            </p>
          </ScrollAnimationWrapper>

          {/* Call to Action Buttons */}
          <ScrollAnimationWrapper variant="scale" delay={400}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Button 
                onClick={onBookingClick}
                variant="medical"
                size="lg"
                className="text-lg px-8 py-4"
              >
                <Calendar className="mr-2 h-5 w-5" />
                {t('hero.bookNow')}
              </Button>
              <Button 
                variant="outline"
                size="lg"
                className="text-lg px-8 py-4 border-2 border-white text-white hover:bg-white hover:text-primary"
                asChild
              >
                <a href="https://wa.me/917415379845" target="_blank" rel="noopener noreferrer">
                  <Phone className="mr-2 h-5 w-5" />
                  WhatsApp Chat
                </a>
              </Button>
            </div>
          </ScrollAnimationWrapper>

          {/* Quick Info Cards */}
          <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <ScrollAnimationWrapper variant="fade-up" delay={500}>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
                <Clock className="h-8 w-8 mb-4 mx-auto text-medical-blue-light" />
                <h3 className="font-semibold mb-2">Flexible Timing</h3>
                <p className="text-sm opacity-90">10-minute consultation slots available</p>
              </div>
            </ScrollAnimationWrapper>
            <ScrollAnimationWrapper variant="fade-up" delay={600}>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
                <MapPin className="h-8 w-8 mb-4 mx-auto text-medical-blue-light" />
                <h3 className="font-semibold mb-2">Convenient Location</h3>
                <p className="text-sm opacity-90">Near Krida Chowk, Nagpur</p>
              </div>
            </ScrollAnimationWrapper>
            <ScrollAnimationWrapper variant="fade-up" delay={700}>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
                <Phone className="h-8 w-8 mb-4 mx-auto text-medical-blue-light" />
                <h3 className="font-semibold mb-2">Instant Support</h3>
                <p className="text-sm opacity-90">WhatsApp available 24/7</p>
              </div>
            </ScrollAnimationWrapper>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
