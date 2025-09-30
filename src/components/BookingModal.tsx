import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { Calendar as CalendarIcon, Clock, CheckCircle, CreditCard, ArrowLeft, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { z } from 'zod';

// Validation schema
const bookingSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
  age: z.string().regex(/^\d+$/, "Age must be a number").refine(val => {
    const num = parseInt(val);
    return num >= 1 && num <= 120;
  }, "Age must be between 1 and 120"),
  gender: z.enum(['male', 'female', 'other'], { required_error: "Gender is required" }),
  whatsapp: z.string().trim().regex(/^\+?[1-9]\d{9,14}$/, "Invalid phone number format"),
  email: z.string().trim().email("Invalid email address").max(255, "Email too long").optional().or(z.literal('')),
  reason: z.string().trim().min(1, "Reason is required").max(1000, "Reason must be less than 1000 characters"),
  serviceType: z.string().min(1, "Service type is required"),
  date: z.date({ required_error: "Appointment date is required" }),
  timeSlot: z.string().min(1, "Time slot is required"),
});

// Import background images
import psychiatricBg from '@/assets/psychiatric-counselling-bg.jpg';
import medicalCertificateBg from '@/assets/medical-certificate-bg.jpg';
import generalPhysicianBg from '@/assets/general-physician-bg.jpg';
import gynecologyBg from '@/assets/gynecology-bg.jpg';
import dermatologyBg from '@/assets/dermatology-bg.jpg';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface BookingData {
  name: string;
  age: string;
  gender: string;
  whatsapp: string;
  email: string;
  reason: string;
  consultationType: 'online' | 'clinic';
  serviceType: string;
  date: Date | undefined;
  timeSlot: string;
  attachments?: File[];
}

interface ServiceType {
  id: string;
  name: string;
  price: number;
  description: string;
  backgroundImage?: string;
}

const services: ServiceType[] = [
  { id: 'general', name: 'General Physician', price: 150, description: 'Comprehensive general medical consultation', backgroundImage: generalPhysicianBg },
  { id: 'gynecology', name: 'Gynecology (Women\'s issues)', price: 200, description: 'Specialized women\'s health consultation', backgroundImage: gynecologyBg },
  { id: 'dermatology', name: 'Dermatology (Skin & Hair)', price: 200, description: 'Expert skin and hair care consultation', backgroundImage: dermatologyBg },
  { id: 'psychiatric', name: 'Psychiatric Counselling', price: 300, description: 'Professional mental health counseling', backgroundImage: psychiatricBg },
  { id: 'certificate', name: 'Medical / Fitness Certificate', price: 200, description: 'Official medical certificates', backgroundImage: medicalCertificateBg },
  { id: 'certificate_prescription', name: 'Medical Certificate + Prescription', price: 250, description: 'Complete medical assessment with prescription', backgroundImage: medicalCertificateBg },
  { id: 'followup', name: 'Free follow up for same issue', price: 0, description: 'Complimentary follow-up consultation for the same medical issue' }
];

// Generate time slots based on consultation type
const generateTimeSlots = (consultationType: 'online' | 'clinic') => {
  const slots = [];
  let startHour, endHour;
  
  if (consultationType === 'clinic') {
    // In-clinic: 6 PM to 9 PM
    startHour = 18;
    endHour = 21;
  } else {
    // Online: 9 AM to 10 PM
    startHour = 9;
    endHour = 22;
  }
  
  for (let hour = startHour; hour < endHour; hour++) {
    for (let minute = 0; minute < 60; minute += 10) {
      const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      slots.push(time);
    }
  }
  return slots;
};

const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose }) => {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState<'form' | 'payment' | 'confirmation'>('form');
  const [booking, setBooking] = useState<BookingData>({
    name: '',
    age: '',
    gender: '',
    whatsapp: '',
    email: '',
    reason: '',
    consultationType: 'clinic',
    serviceType: '',
    date: undefined,
    timeSlot: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);

  const timeSlots = generateTimeSlots(booking.consultationType);
  const selectedService = services.find(s => s.id === booking.serviceType);
  const amount = selectedService?.price || 0;

  const generateUPILink = () => {
    const upiId = '7415379845@okbizaxis';
    const transactionNote = `${selectedService?.name} - ${booking.name}`;
    const transactionId = `CLINIC_${Date.now()}`;
    
    return `upi://pay?pa=${upiId}&pn=Medical Clinic&tn=${encodeURIComponent(transactionNote)}&am=${amount}&cu=INR&tid=${transactionId}`;
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form data
    try {
      bookingSchema.parse({
        name: booking.name,
        age: booking.age,
        gender: booking.gender,
        whatsapp: booking.whatsapp,
        email: booking.email || '',
        reason: booking.reason,
        serviceType: booking.serviceType,
        date: booking.date,
        timeSlot: booking.timeSlot,
      });
      
      setCurrentStep('payment');
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: "Validation Error",
          description: error.errors[0].message,
          variant: "destructive",
        });
      }
    }
  };

  const handlePaymentConfirmation = async () => {
    setPaymentConfirmed(true);
    setIsSubmitting(true);

    try {
      // Save appointment to database
      const appointmentData = {
        patient_name: booking.name,
        age: booking.age,
        gender: booking.gender,
        whatsapp: booking.whatsapp,
        email: booking.email || null,
        reason: booking.reason,
        consultation_type: booking.consultationType,
        service_type: selectedService?.name || '',
        appointment_date: booking.date!.toISOString().split('T')[0],
        time_slot: booking.timeSlot,
        status: 'pending'
      };

      const { data: appointmentResult, error: dbError } = await supabase
        .from('appointments')
        .insert([appointmentData])
        .select()
        .single();

      if (dbError) {
        console.error('Database error: Failed to save appointment');
        throw new Error('Failed to save appointment to database');
      }

      console.log('Appointment saved successfully');

      // Send confirmation emails
      const response = await supabase.functions.invoke('send-booking-confirmation', {
        body: {
          name: booking.name,
          age: booking.age,
          gender: booking.gender,
          whatsapp: booking.whatsapp,
          email: booking.email,
          reason: booking.reason,
          consultationType: booking.consultationType,
          serviceName: selectedService?.name || '',
          serviceCharge: selectedService?.price || 0,
          date: format(booking.date!, 'PPP'),
          timeSlot: booking.timeSlot,
        },
      });

      if (!response.error) {
        console.log('Email confirmation sent successfully');
      } else {
        console.error('Email sending failed');
        // Don't throw error here as appointment is already saved
      }
      
      toast({
        title: "Appointment Booked Successfully! ✅",
        description: `Your ${booking.consultationType} consultation is scheduled for ${format(booking.date!, 'PPP')} at ${booking.timeSlot}. ${response.error ? 'Appointment saved but email notification failed.' : 'Confirmation emails sent.'}`,
      });

      // Reset form
      setBooking({
        name: '',
        age: '',
        gender: '',
        whatsapp: '',
        email: '',
        reason: '',
        consultationType: 'clinic',
        serviceType: '',
        date: undefined,
        timeSlot: '',
        attachments: undefined,
      });
      setCurrentStep('form');
      setPaymentConfirmed(false);
      
      onClose();
    } catch (error) {
      console.error('Booking error');
      toast({
        title: "Booking Failed",
        description: "There was an error processing your appointment. Please try again or contact us directly via WhatsApp.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFinalSubmit = async () => {
    if (!paymentConfirmed) {
      toast({
        title: "Payment Required",
        description: "Please complete the payment before confirming your appointment.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Call the Supabase Edge Function to send confirmation emails
      const response = await fetch('https://dgnwrghklgpnocyynqem.supabase.co/functions/v1/send-booking-confirmation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: booking.name,
          age: booking.age,
          gender: booking.gender,
          whatsapp: booking.whatsapp,
          email: booking.email,
          reason: booking.reason,
          consultationType: booking.consultationType,
          serviceType: selectedService?.name || '',
          amount: amount,
          date: format(booking.date!, 'PPP'),
          timeSlot: booking.timeSlot,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send confirmation emails');
      }

      console.log('Email confirmation sent successfully');
      
      toast({
        title: "Appointment Booked Successfully! ✅",
        description: `Your ${booking.consultationType} consultation is scheduled for ${format(booking.date!, 'PPP')} at ${booking.timeSlot}. Confirmation emails have been sent.`,
      });

      // Reset form
      setBooking({
        name: '',
        age: '',
        gender: '',
        whatsapp: '',
        email: '',
        reason: '',
        consultationType: 'clinic',
        serviceType: '',
        date: undefined,
        timeSlot: '',
      });
      setCurrentStep('form');
      setPaymentConfirmed(false);
      
      onClose();
    } catch (error) {
      console.error('Booking error');
      toast({
        title: "Booking Failed",
        description: "There was an error processing your appointment. Please try again or contact us directly via WhatsApp.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderFormStep = () => (
    <form onSubmit={handleFormSubmit} className="space-y-6">
      {/* Service Type Selection */}
      <div className="space-y-3">
        <Label className="text-base font-semibold">Service Type *</Label>
        <Select onValueChange={(value) => setBooking({ ...booking, serviceType: value })}>
          <SelectTrigger>
            <SelectValue placeholder="Select consultation service" />
          </SelectTrigger>
          <SelectContent>
            {services.map((service) => (
              <SelectItem key={service.id} value={service.id}>
                <div className="flex justify-between items-center w-full">
                  <span>{service.name}</span>
                  <span className="font-semibold text-primary ml-4">₹{service.price}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {selectedService && selectedService.backgroundImage && (
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">{selectedService.description}</p>
            <div 
              className="h-20 w-full bg-cover bg-center rounded-lg opacity-30 border"
              style={{
                backgroundImage: `url(${selectedService.backgroundImage})`
              }}
            />
          </div>
        )}
        {selectedService && !selectedService.backgroundImage && (
          <p className="text-sm text-muted-foreground">{selectedService.description}</p>
        )}
      </div>

      {/* Consultation Type */}
      <div className="space-y-3">
        <Label className="text-base font-semibold">Consultation Type</Label>
        <RadioGroup
          value={booking.consultationType}
          onValueChange={(value: 'online' | 'clinic') => 
            setBooking({ ...booking, consultationType: value, timeSlot: '' })
          }
          className="flex gap-6"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="clinic" id="clinic" />
            <Label htmlFor="clinic">In-Clinic Visit</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="online" id="online" />
            <Label htmlFor="online">Online Consultation</Label>
          </div>
        </RadioGroup>
      </div>

      {/* Personal Information */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name *</Label>
          <Input
            id="name"
            value={booking.name}
            onChange={(e) => setBooking({ ...booking, name: e.target.value })}
            required
            placeholder="Enter your full name"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="age">Age *</Label>
          <Input
            id="age"
            type="number"
            value={booking.age}
            onChange={(e) => setBooking({ ...booking, age: e.target.value })}
            required
            placeholder="Enter your age"
            min="1"
            max="120"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="gender">Gender *</Label>
          <Select onValueChange={(value) => setBooking({ ...booking, gender: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="whatsapp">WhatsApp Number *</Label>
          <Input
            id="whatsapp"
            value={booking.whatsapp}
            onChange={(e) => setBooking({ ...booking, whatsapp: e.target.value })}
            required
            placeholder="+91 XXXXXXXXXX"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email Address (Optional)</Label>
        <Input
          id="email"
          type="email"
          value={booking.email}
          onChange={(e) => setBooking({ ...booking, email: e.target.value })}
          placeholder="your.email@example.com (optional)"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="attachments">Medical Documents (Optional)</Label>
        <Input
          id="attachments"
          type="file"
          multiple
          accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
          onChange={(e) => {
            const files = Array.from(e.target.files || []);
            setBooking({ ...booking, attachments: files });
          }}
          className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
        />
        <p className="text-xs text-muted-foreground">
          Upload lab reports, medical documents, prescriptions (PDF, JPG, PNG, DOC - Max 10MB per file)
        </p>
      </div>

      {/* Date and Time Selection */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Appointment Date *</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !booking.date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {booking.date ? format(booking.date, "PPP") : "Select date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={booking.date}
                onSelect={(date) => setBooking({ ...booking, date })}
                disabled={(date) => date < new Date() || date < new Date("1900-01-01")}
                initialFocus
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>
        
        <div className="space-y-2">
          <Label>Time Slot * <span className="text-xs text-muted-foreground">(Max 2 consultations per slot)</span></Label>
          <Select onValueChange={(value) => setBooking({ ...booking, timeSlot: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select time" />
            </SelectTrigger>
            <SelectContent className="max-h-60">
              {timeSlots.map((time) => (
                <SelectItem key={time} value={time}>
                  <Clock className="inline mr-2 h-4 w-4" />
                  {time}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            Note: Maximum 2 consultations can be booked per time slot
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="reason">Reason for Consultation *</Label>
        <Textarea
          id="reason"
          value={booking.reason}
          onChange={(e) => setBooking({ ...booking, reason: e.target.value })}
          required
          placeholder="Please describe your symptoms or reason for consultation..."
          rows={3}
        />
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="submit" className="flex-1" variant="medical">
          <CreditCard className="h-4 w-4 mr-2" />
          Proceed to Payment
        </Button>
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
      </div>
    </form>
  );

  const renderPaymentStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-primary mb-4">Payment Details</h3>
        <div className="bg-muted/50 rounded-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <span className="text-lg">Service:</span>
            <span className="font-semibold">{selectedService?.name}</span>
          </div>
          <div className="flex justify-between items-center mb-4">
            <span className="text-lg">Amount:</span>
            <span className="text-2xl font-bold text-primary">₹{amount}</span>
          </div>
          <div className="text-sm text-muted-foreground">
            Includes free follow-up for 7-8 days
          </div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg p-6">
        <h4 className="text-lg font-semibold mb-4 text-center">Pay via UPI</h4>
        <div className="space-y-4">
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-4">
              UPI ID: <span className="font-mono font-semibold">7415379845@okbizaxis</span>
            </p>
            
            <Button 
              className="w-full mb-4" 
              variant="medical"
              onClick={() => window.open(generateUPILink(), '_blank')}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Pay ₹{amount} via UPI
            </Button>
            
            <p className="text-xs text-muted-foreground mb-4">
              Click above to open your UPI app and complete the payment
            </p>
          </div>
          
          <div className="border-t pt-4">
            <p className="text-sm text-muted-foreground text-center mb-4">
              After completing payment, click below to confirm
            </p>
            <Button 
              onClick={handlePaymentConfirmation}
              className="w-full"
              variant="outline"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                  Confirming Appointment...
                </div>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  I have completed the payment
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => setCurrentStep('form')}
          className="flex-1"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Form
        </Button>
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
      </div>
    </div>
  );

  const renderConfirmationStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-primary mb-4">Confirm Your Appointment</h3>
      </div>

      <div className="bg-card border border-border rounded-lg p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div><strong>Service:</strong></div>
          <div>{selectedService?.name}</div>
          
          <div><strong>Type:</strong></div>
          <div className="capitalize">{booking.consultationType}</div>
          
          <div><strong>Date:</strong></div>
          <div>{booking.date && format(booking.date, 'PPP')}</div>
          
          <div><strong>Time:</strong></div>
          <div>{booking.timeSlot}</div>
          
          <div><strong>Amount Paid:</strong></div>
          <div className="font-semibold text-primary">₹{amount}</div>
        </div>
      </div>

      <div className="flex gap-3">
        <Button
          onClick={handleFinalSubmit}
          disabled={isSubmitting}
          className="flex-1"
          variant="medical"
        >
          {isSubmitting ? (
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Confirming...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Confirm Appointment
            </div>
          )}
        </Button>
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => setCurrentStep('payment')}
          disabled={isSubmitting}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      </div>
    </div>
  );

  const handleModalClose = () => {
    setCurrentStep('form');
    setPaymentConfirmed(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleModalClose}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-primary flex items-center gap-2">
            <CalendarIcon className="h-6 w-6" />
            {currentStep === 'form' && 'Book Your Appointment'}
            {currentStep === 'payment' && 'Payment'}
            {currentStep === 'confirmation' && 'Confirm Booking'}
          </DialogTitle>
        </DialogHeader>

        {currentStep === 'form' && renderFormStep()}
        {currentStep === 'payment' && renderPaymentStep()}
        {currentStep === 'confirmation' && renderConfirmationStep()}
      </DialogContent>
    </Dialog>
  );
};

export default BookingModal;