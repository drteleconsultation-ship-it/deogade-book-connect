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
import { Calendar as CalendarIcon, Clock, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

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
  date: Date | undefined;
  timeSlot: string;
}

// Generate time slots (10-minute intervals from 9 AM to 6 PM)
const generateTimeSlots = () => {
  const slots = [];
  for (let hour = 9; hour < 18; hour++) {
    for (let minute = 0; minute < 60; minute += 10) {
      const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      slots.push(time);
    }
  }
  return slots;
};

const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose }) => {
  const { toast } = useToast();
  const [booking, setBooking] = useState<BookingData>({
    name: '',
    age: '',
    gender: '',
    whatsapp: '',
    email: '',
    reason: '',
    consultationType: 'clinic',
    date: undefined,
    timeSlot: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const timeSlots = generateTimeSlots();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!booking.date || !booking.timeSlot || !booking.name || !booking.age || !booking.gender || !booking.whatsapp || !booking.email || !booking.reason) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields and select both date and time for your appointment.",
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
          date: format(booking.date, 'PPP'),
          timeSlot: booking.timeSlot,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send confirmation emails');
      }

      const result = await response.json();
      console.log('Email confirmation result:', result);
      
      toast({
        title: "Appointment Booked Successfully! ✅",
        description: `Your ${booking.consultationType} consultation is scheduled for ${format(booking.date, 'PPP')} at ${booking.timeSlot}. Confirmation emails have been sent to you and our clinic.`,
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
        date: undefined,
        timeSlot: '',
      });
      
      onClose();
    } catch (error) {
      console.error('Booking error:', error);
      toast({
        title: "Booking Failed",
        description: "There was an error processing your appointment. Please try again or contact us directly via WhatsApp.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-primary flex items-center gap-2">
            <CalendarIcon className="h-6 w-6" />
            Book Your Appointment
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Consultation Type */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Consultation Type</Label>
            <RadioGroup
              value={booking.consultationType}
              onValueChange={(value: 'online' | 'clinic') => 
                setBooking({ ...booking, consultationType: value })
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
            <Label htmlFor="email">Email Address *</Label>
            <Input
              id="email"
              type="email"
              value={booking.email}
              onChange={(e) => setBooking({ ...booking, email: e.target.value })}
              required
              placeholder="your.email@example.com"
            />
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
              <Label>Time Slot *</Label>
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
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1"
              variant="medical"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Booking...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Confirm Appointment
                </div>
              )}
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default BookingModal;