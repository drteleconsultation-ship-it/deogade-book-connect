import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Phone, Mail, Clock, Award, Users } from 'lucide-react';
import doctorIcon from '@/assets/doctor-icon.png';

const AboutSection: React.FC = () => {
  return (
    <section className="py-20 bg-medical-blue-light">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6">
              About Dr. Deogade Clinic
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Providing compassionate healthcare with modern medical practices and 
              personalized patient care in the heart of Nagpur.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
            <div className="space-y-6">
              <div className="flex items-center gap-4 mb-8">
                <img 
                  src={doctorIcon} 
                  alt="Dr. Deogade Professional Medical Care" 
                  className="w-16 h-16"
                />
                <div>
                  <h3 className="text-2xl font-bold text-primary">Dr. Deogade</h3>
                  <p className="text-muted-foreground">Medical Practitioner</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Award className="h-6 w-6 text-medical-blue mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-primary mb-1">Professional Excellence</h4>
                    <p className="text-muted-foreground">
                      Committed to providing the highest standard of medical care with 
                      years of experience in healthcare.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Users className="h-6 w-6 text-medical-blue mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-primary mb-1">Patient-Centered Care</h4>
                    <p className="text-muted-foreground">
                      Every patient receives personalized attention and treatment plans 
                      tailored to their specific health needs.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="h-6 w-6 text-medical-blue mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-primary mb-1">Flexible Consultations</h4>
                    <p className="text-muted-foreground">
                      Offering both in-clinic visits and online consultations for 
                      your convenience and accessibility.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-6">
              <Card className="shadow-card border-none">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="bg-medical-gradient p-3 rounded-full">
                      <MapPin className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-primary">Clinic Location</h4>
                      <p className="text-sm text-muted-foreground">Easy to find</p>
                    </div>
                  </div>
                  <p className="text-foreground">
                    419/B, Dev Arch Apartment<br />
                    Near Krida Chowk, Nagpur
                  </p>
                </CardContent>
              </Card>

              <Card className="shadow-card border-none">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="bg-medical-gradient p-3 rounded-full">
                      <Phone className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-primary">Contact</h4>
                      <p className="text-sm text-muted-foreground">24/7 WhatsApp Support</p>
                    </div>
                  </div>
                  <p className="text-foreground">
                    WhatsApp: +91 7415379845<br />
                    Instant messaging available
                  </p>
                </CardContent>
              </Card>

              <Card className="shadow-card border-none">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="bg-medical-gradient p-3 rounded-full">
                      <Mail className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-primary">Email</h4>
                      <p className="text-sm text-muted-foreground">Consultation inquiries</p>
                    </div>
                  </div>
                  <p className="text-foreground">
                    drteleconsultation@gmail.com
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;