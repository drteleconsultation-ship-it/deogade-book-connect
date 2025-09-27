import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { IndianRupee, UserCheck, Heart, Sparkles, Brain, FileText } from 'lucide-react';
import { useLanguage } from '@/components/LanguageSelector';

// Import background images
import psychiatricBg from '@/assets/psychiatric-counselling-bg.jpg';
import medicalCertificateBg from '@/assets/medical-certificate-bg.jpg';
import generalPhysicianBg from '@/assets/general-physician-bg.jpg';
import gynecologyBg from '@/assets/gynecology-bg.jpg';
import dermatologyBg from '@/assets/dermatology-bg.jpg';

const ChargesSection: React.FC = () => {
  const { t } = useLanguage();
  const charges = [
    {
      icon: UserCheck,
      title: 'General Physician',
      price: '₹150',
      description: 'Comprehensive general medical consultation and treatment',
      backgroundImage: generalPhysicianBg
    },
    {
      icon: Heart,
      title: 'Gynecology (Women\'s issues)',
      price: '₹200',
      description: 'Specialized women\'s health and gynecological consultation',
      backgroundImage: gynecologyBg
    },
    {
      icon: Sparkles,
      title: 'Dermatology (Skin & Hair)',
      price: '₹200',
      description: 'Expert skin and hair care consultation and treatment',
      backgroundImage: dermatologyBg
    },
    {
      icon: Brain,
      title: 'Psychiatric Counselling',
      price: '₹300',
      description: 'Professional mental health counseling and support',
      backgroundImage: psychiatricBg
    },
    {
      icon: FileText,
      title: 'Medical / Fitness Certificate',
      price: '₹200',
      description: 'Official medical and fitness certificates',
      backgroundImage: medicalCertificateBg
    },
    {
      icon: FileText,
      title: 'Medical Certificate + Prescription',
      price: '₹250',
      description: 'Complete medical assessment with prescription',
      backgroundImage: medicalCertificateBg
    },
    {
      icon: UserCheck,
      title: 'Free follow up for same issue',
      price: '₹0',
      description: 'Complimentary follow-up consultation for the same medical issue'
    }
  ];

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6">
              {t('charges.title')}
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Transparent and affordable pricing for quality healthcare services
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {charges.map((charge, index) => (
              <Card 
                key={index} 
                className="shadow-card border-none hover:shadow-medical transition-all duration-300 hover:-translate-y-1 relative overflow-hidden"
              >
                {charge.backgroundImage && (
                  <div 
                    className="absolute inset-0 bg-cover bg-center opacity-10"
                    style={{
                      backgroundImage: `url(${charge.backgroundImage})`
                    }}
                  />
                )}
                <div className="relative z-10">
                  <CardHeader className="text-center pb-4">
                    <div className="bg-medical-gradient p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                      <charge.icon className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-xl text-primary">{charge.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <div className="mb-4">
                      <span className="text-3xl font-bold text-primary flex items-center justify-center gap-1">
                        {charge.price}
                      </span>
                    </div>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {charge.description}
                    </p>
                  </CardContent>
                </div>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12 space-y-6">
            <div className="bg-card border border-border rounded-lg p-6 max-w-2xl mx-auto">
              <p className="text-lg font-semibold text-primary mb-2">
                📅 Follow-up Included
              </p>
              <p className="text-muted-foreground">
                All consultation includes Free follow up for 7-8 days.
              </p>
            </div>
            
            <div className="bg-card border border-border rounded-lg p-6 max-w-2xl mx-auto">
              <p className="text-lg font-semibold text-primary mb-2">
                ⏰ Waiting Time
              </p>
              <p className="text-muted-foreground">
                Waiting time minimum 2 min to maximum 15 min
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ChargesSection;