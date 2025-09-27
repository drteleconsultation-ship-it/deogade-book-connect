import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Monitor, Stethoscope, Clock, Shield, Heart, UserCheck } from 'lucide-react';
import { useLanguage } from '@/components/LanguageSelector';

const ServicesSection: React.FC = () => {
  const { t } = useLanguage();
  const services = [
    {
      icon: Monitor,
      title: 'Online Consultations',
      description: 'Connect with Dr. Deogade from the comfort of your home through secure video consultations.',
      features: ['Video/Audio calls', 'Digital prescriptions', 'Follow-up care', 'Convenient scheduling']
    },
    {
      icon: Stethoscope,
      title: 'In-Clinic Visits',
      description: 'Comprehensive physical examinations and treatments at our modern clinic facility.',
      features: ['Physical examination', 'Diagnostic procedures', 'Medical treatments', 'Health monitoring']
    },
    {
      icon: Clock,
      title: 'Flexible Scheduling',
      description: 'Book appointments in 10-minute slots that fit your busy schedule.',
      features: ['10-minute slots', 'Same-day booking', 'Flexible timing', 'Easy rescheduling']
    },
    {
      icon: Shield,
      title: 'Professional Care',
      description: 'Experienced medical care with a focus on patient safety and comfort.',
      features: ['Qualified doctor', 'Safe procedures', 'Hygiene protocols', 'Quality assurance']
    },
    {
      icon: Heart,
      title: 'Personalized Treatment',
      description: 'Every patient receives individualized care tailored to their specific health needs.',
      features: ['Custom treatment plans', 'Individual attention', 'Health tracking', 'Ongoing support']
    },
    {
      icon: UserCheck,
      title: '24/7 Support',
      description: 'WhatsApp support available round the clock for urgent queries and assistance.',
      features: ['WhatsApp chat', 'Quick responses', 'Urgent queries', 'Continuous support']
    }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6">
              {t('services.title')}
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Comprehensive healthcare solutions designed to meet your medical needs 
              with convenience and professional excellence.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="shadow-card border-none hover:shadow-medical transition-all duration-300 hover:-translate-y-1">
                <CardHeader className="text-center pb-4">
                  <div className="bg-medical-gradient p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <service.icon className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-xl text-primary">{service.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-muted-foreground mb-4 leading-relaxed">
                    {service.description}
                  </p>
                  <ul className="space-y-2">
                    {service.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="text-sm text-foreground flex items-center justify-center gap-2">
                        <div className="w-1.5 h-1.5 bg-medical-blue rounded-full flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;