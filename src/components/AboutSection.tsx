import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Phone, Mail, Clock, Heart, Award, Sparkles, CheckCircle, Stethoscope } from 'lucide-react';
import doctorIcon from '@/assets/doctor-icon.png';
import { useLanguage } from '@/components/LanguageSelector';

const AboutSection: React.FC = () => {
  const { t } = useLanguage();
  
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6">
              {t('about.title')}
            </h2>
            <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed mb-8">
              <strong className="text-primary">"Consider Me As Your Friend While Consulting"</strong>
            </p>
            <p className="text-lg text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              Fastest Reply On Consultation. Treatment Of All Diseases And Covid Treatment/ Cough/ Pain/Diabetes/Thyroid/Weight Loss/ Skin/Acne/ Skin Infection/ Itching /Rashes/ Psychiatry / Stress Relieving Guidance/ Sexual Problems Guidance And Treatment/ Infertility / Medicine & Symptoms Google Search Deaddiction Guidance/ Gynecological Problems / Periods Delay/ Hair Loss / Greying Of Hairs / Hair Fall / Chicken Pox,Typhoid,Dengue / Bp / Asthma/ Fever/ Viral/ Issuing Medical Certificates.
            </p>
          </div>

          {/* Medical Specialties */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            <Card className="shadow-card border-none hover:shadow-medical transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-primary text-center">
                  <Stethoscope className="h-8 w-8 mx-auto mb-2" />
                  GENERAL PHYSICIAN
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Cold & Flu, Sore Throat, Fever, Migraine, Headache, Diarrhea And Vomiting, Stomach Upset/Pain Gas/Acidity Bp Issues (Hypertension/Hypo-Tension), Asthma, Back Pain, Neck Pain, Joint Pain And More.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-card border-none hover:shadow-medical transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-primary text-center">
                  <Heart className="h-8 w-8 mx-auto mb-2" />
                  GYNECOLOGY
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Missed Periods, Pcos / Pcod Advice, Menopause Issues, Urinary Tract Infection (Uti), Pregnancy Planning Advice, Pre And Post Pregnancy Queries, Infertility Consultation.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-card border-none hover:shadow-medical transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-primary text-center">
                  <Sparkles className="h-8 w-8 mx-auto mb-2" />
                  DERMATOLOGY
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Acne & Pimples, Anti-Aging, Eczema, Hair Fall, Dandruff, Skin Diseases/Rashes, Dark Circles, Itching.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-card border-none hover:shadow-medical transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-primary text-center">
                  <Heart className="h-8 w-8 mx-auto mb-2" />
                  PEDIATRICS (CHILD)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Cold And Flu, Fever, Skin And Diaper Rashes, Weight Gain, Stomach Upset, Diarrhoea.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-card border-none hover:shadow-medical transition-all duration-300 lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-primary text-center">
                  <Award className="h-8 w-8 mx-auto mb-2" />
                  OTHER SPECIALTIES
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Mental Health Counselling, Sexologist Counselling, Dietician Counselling, Diabetology (Online Diabetes Consultation), Online Child Psychology Consultation, Emotional Wellbeing (Psychiatrist/Counsellors/Therapists), Ear Nose Throat (Online Ent Consultation), Ophthalmologists (Online Eye Doctor Consultation), Online Allergy & Asthma Consultation, Online Child Allergy Consultation, Urologist Consultation.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Doctor Profile and Contact */}
          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div className="text-center md:text-left">
              <div className="bg-medical-gradient p-6 rounded-full w-32 h-32 mx-auto md:mx-0 mb-6 flex items-center justify-center">
                <img 
                  src={doctorIcon} 
                  alt="Dr. Rikki Deogade - Professional Medical Care" 
                  className="w-20 h-20 object-contain"
                />
              </div>
              <h3 className="text-3xl font-bold text-primary mb-2">Dr. Rikki Deogade</h3>
              <p className="text-lg text-muted-foreground mb-4">
                MBBS, CGO, CCH, CSD, CVD, Medical Officer
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Dedicated to providing compassionate, quality healthcare services with years of experience 
                in multiple medical specialties. Committed to patient-centered care and modern medical practices.
              </p>
            </div>

            <div className="grid gap-6">
              <div className="flex items-center gap-4 p-4 bg-card rounded-lg border border-border hover:shadow-md transition-all duration-300">
                <div className="bg-medical-gradient p-3 rounded-full">
                  <Award className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-primary">Professional Excellence</h4>
                  <p className="text-sm text-muted-foreground">Qualified medical professional with multiple certifications</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-card rounded-lg border border-border hover:shadow-md transition-all duration-300">
                <div className="bg-medical-gradient p-3 rounded-full">
                  <Heart className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-primary">Patient-Centered Care</h4>
                  <p className="text-sm text-muted-foreground">Compassionate treatment with focus on individual needs</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-card rounded-lg border border-border hover:shadow-md transition-all duration-300">
                <div className="bg-medical-gradient p-3 rounded-full">
                  <Clock className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-primary">Flexible Consultations</h4>
                  <p className="text-sm text-muted-foreground">Online and in-clinic appointments to suit your schedule</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="shadow-card border-none hover:shadow-medical transition-all duration-300">
              <CardHeader className="text-center">
                <div className="bg-medical-gradient p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <MapPin className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-primary">Clinic Location</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground leading-relaxed">
                  Dr Deogade Clinic<br />
                  Near Krida Chowk<br />
                  Nagpur, Maharashtra
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-card border-none hover:shadow-medical transition-all duration-300">
              <CardHeader className="text-center">
                <div className="bg-medical-gradient p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Phone className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-primary">Contact Number</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground leading-relaxed">
                  <a href="tel:7415379845" className="hover:text-primary transition-colors">
                    +91 74153 79845
                  </a>
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Available on WhatsApp
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-card border-none hover:shadow-medical transition-all duration-300">
              <CardHeader className="text-center">
                <div className="bg-medical-gradient p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Mail className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-primary">Email Address</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground leading-relaxed">
                  <a href="mailto:drteleconsultation@gmail.com" className="hover:text-primary transition-colors">
                    drteleconsultation@gmail.com
                  </a>
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  For appointments & queries
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;