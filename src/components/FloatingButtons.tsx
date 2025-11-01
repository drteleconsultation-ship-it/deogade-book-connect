import React from 'react';
import { MessageCircle, Phone, Mail } from 'lucide-react';

const FloatingButtons: React.FC = () => {
  const handleWhatsAppClick = () => {
    const message = "Hello, I would like to enquire about an appointment at Dr Deogade Clinic";
    const whatsappUrl = `https://wa.me/917415379845?text=${encodeURIComponent(message)}`;
    
    const link = document.createElement('a');
    link.href = whatsappUrl;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCallClick = () => {
    const phoneUrl = `tel:7415379845`;
    window.location.href = phoneUrl;
  };

  const handleEmailClick = () => {
    const emailUrl = `mailto:drteleconsultation@gmail.com?subject=Enquiry about consultation&body=Hello, I would like to enquire about a consultation at Dr Deogade Clinic.`;
    window.location.href = emailUrl;
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 mb-safe pb-4 sm:pb-0 sm:mb-0">
      {/* Call Button */}
      <button
        onClick={handleCallClick}
        className="bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300"
        aria-label="Call Dr Deogade Clinic"
      >
        <Phone className="h-6 w-6" />
      </button>

      {/* WhatsApp Button */}
      <button
        onClick={handleWhatsAppClick}
        className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle className="h-6 w-6" />
      </button>

      {/* Email Button */}
      <button
        onClick={handleEmailClick}
        className="bg-red-500 hover:bg-red-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300"
        aria-label="Email Dr Deogade Clinic"
      >
        <Mail className="h-6 w-6" />
      </button>
    </div>
  );
};

export default FloatingButtons;