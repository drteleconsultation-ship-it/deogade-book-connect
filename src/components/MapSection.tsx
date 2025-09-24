import React from 'react';
import { MapPin } from 'lucide-react';

const MapSection: React.FC = () => {
  const latitude = 21.1280545;
  const longitude = 79.1036852;
  
  // Google Maps embed URL using the provided place ID
  const mapUrl = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3720.5!2d${longitude}!3d${latitude}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bd4c1837136df49:0xc86217e441466919!2sDr+Deogade+Clinic!5e0!3m2!1sen!2sin!4v1637123456789!5m2!1sen!2sin`;

  const handleGetDirections = () => {
    const directionsUrl = "https://www.google.com/maps/place/Dr+Deogade+Clinic+(MBBS,+CGO,+CCH,+CSD,+CVD,+Medical+Officer)/@21.1280595,79.1011103,17z/data=!3m1!4b1!4m6!3m5!1s0x3bd4c1837136df49:0xc86217e441466919!8m2!3d21.1280545!4d79.1036852!16s%2Fg%2F11spxjsngk?entry=ttu&g_ep=EgoyMDI1MDkyMS4wIKXMDSoASAFQAw%3D%3D";
    
    const link = document.createElement('a');
    link.href = directionsUrl;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6">
              Visit Our Clinic
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Find us easily with our convenient location near Krida Chowk, Nagpur
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Map */}
            <div className="order-2 lg:order-1">
              <div className="relative rounded-xl overflow-hidden shadow-medical">
                <iframe
                  src={mapUrl}
                  width="100%"
                  height="400"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Dr. Deogade Clinic Location"
                  className="w-full h-[400px]"
                />
              </div>
            </div>

            {/* Location Info */}
            <div className="order-1 lg:order-2">
              <div className="bg-card border border-border rounded-xl p-8 shadow-card">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-medical-gradient p-3 rounded-full">
                    <MapPin className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-primary">Clinic Location</h3>
                </div>
                
                <div className="space-y-4 mb-8">
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Dr. Deogade Clinic</h4>
                    <p className="text-muted-foreground leading-relaxed">
                      Near Krida Chowk, Nagpur<br />
                      Maharashtra, India
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Coordinates</h4>
                    <p className="text-muted-foreground font-mono text-sm">
                      {latitude}, {longitude}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Clinic Hours</h4>
                    <p className="text-muted-foreground">
                      Evening: 6:00 PM - 9:00 PM<br />
                      Online: 9:00 AM - 10:00 PM
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleGetDirections}
                  className="w-full bg-medical-gradient text-white py-3 px-4 rounded-lg font-semibold hover:shadow-medical transition-all duration-300 hover:-translate-y-0.5"
                >
                  <MapPin className="inline h-5 w-5 mr-2" />
                  Get Directions
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MapSection;