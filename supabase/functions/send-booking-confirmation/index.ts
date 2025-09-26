import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface BookingEmailRequest {
  name: string;
  age: string;
  gender: string;
  whatsapp: string;
  email?: string;
  reason: string;
  consultationType: 'online' | 'clinic';
  serviceName: string;
  serviceCharge: number;
  date: string;
  timeSlot: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const bookingData: BookingEmailRequest = await req.json();
    
    console.log("Processing booking confirmation email for:", bookingData.email || "No email provided");

    // Email content for customer
    const customerEmailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
        <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #2563eb; margin: 0; font-size: 28px;">Dr. Deogade Clinic</h1>
            <p style="color: #666; margin: 5px 0 0 0;">Professional Medical Care & Teleconsultation</p>
          </div>
          
          <div style="background-color: #dbeafe; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
            <h2 style="color: #1e40af; margin: 0 0 15px 0; font-size: 22px;">✅ Appointment Confirmed!</h2>
            <p style="color: #374151; margin: 0; font-size: 16px;">Dear ${bookingData.name}, your appointment has been successfully booked.</p>
          </div>

          <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
            <h3 style="color: #374151; margin: 0 0 15px 0; font-size: 18px;">Appointment Details:</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #6b7280; font-weight: 500;">Patient Name:</td>
                <td style="padding: 8px 0; color: #111827; font-weight: 500;">${bookingData.name}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6b7280; font-weight: 500;">Age:</td>
                <td style="padding: 8px 0; color: #111827;">${bookingData.age} years</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6b7280; font-weight: 500;">Gender:</td>
                <td style="padding: 8px 0; color: #111827;">${bookingData.gender}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6b7280; font-weight: 500;">Service Type:</td>
                <td style="padding: 8px 0; color: #111827; font-weight: 500;">${bookingData.serviceName}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6b7280; font-weight: 500;">Consultation Charge:</td>
                <td style="padding: 8px 0; color: #111827; font-weight: 600;">₹${bookingData.serviceCharge}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6b7280; font-weight: 500;">Consultation Type:</td>
                <td style="padding: 8px 0; color: #111827; text-transform: capitalize;">${bookingData.consultationType === 'online' ? 'Online Consultation' : 'In-Clinic Visit'}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6b7280; font-weight: 500;">Date:</td>
                <td style="padding: 8px 0; color: #111827;">${bookingData.date}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6b7280; font-weight: 500;">Time:</td>
                <td style="padding: 8px 0; color: #111827;">${bookingData.timeSlot}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6b7280; font-weight: 500;">WhatsApp:</td>
                <td style="padding: 8px 0; color: #111827;">${bookingData.whatsapp}</td>
              </tr>
              ${bookingData.email ? `
              <tr>
                <td style="padding: 8px 0; color: #6b7280; font-weight: 500;">Email:</td>
                <td style="padding: 8px 0; color: #111827;">${bookingData.email}</td>
              </tr>
              ` : ''}
              <tr>
                <td style="padding: 8px 0; color: #6b7280; font-weight: 500;">Reason:</td>
                <td style="padding: 8px 0; color: #111827;">${bookingData.reason}</td>
              </tr>
            </table>
          </div>

          <div style="background-color: #fef3c7; padding: 20px; border-radius: 8px; border-left: 4px solid #f59e0b; margin-bottom: 25px;">
            <h3 style="color: #92400e; margin: 0 0 10px 0; font-size: 16px;">Important Instructions:</h3>
            <ul style="color: #78350f; margin: 0; padding-left: 20px;">
              <li style="margin-bottom: 5px;">Please arrive 10 minutes early for in-clinic visits</li>
              <li style="margin-bottom: 5px;">For online consultations, you'll receive a call on your WhatsApp number</li>
              <li style="margin-bottom: 5px;">Bring your medical history and current medications</li>
              <li>If you need to reschedule, please contact us at least 2 hours in advance</li>
            </ul>
          </div>

          <div style="text-align: center; padding: 20px; background-color: #f1f5f9; border-radius: 8px;">
            <h3 style="color: #334155; margin: 0 0 10px 0;">Need to Contact Us?</h3>
            <p style="color: #64748b; margin: 0 0 10px 0;">WhatsApp: <strong>+91 7415379845</strong></p>
            <p style="color: #64748b; margin: 0 0 10px 0;">Email: <strong>drteleconsultation@gmail.com</strong></p>
            <p style="color: #64748b; margin: 0;">Address: 419/B, Dev Arch Apartment, near Krida Chowk, Nagpur</p>
          </div>
        </div>
      </div>
    `;

    // Email content for clinic
    const clinicEmailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #2563eb;">New Appointment Booking</h2>
        <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px;">
          <h3>Patient Details:</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; color: #6b7280;">Patient Name:</td>
              <td style="padding: 8px 0; color: #111827; font-weight: 500;">${bookingData.name}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #6b7280;">Age:</td>
              <td style="padding: 8px 0; color: #111827;">${bookingData.age} years</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #6b7280;">Gender:</td>
              <td style="padding: 8px 0; color: #111827;">${bookingData.gender}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #6b7280;">Service Type:</td>
              <td style="padding: 8px 0; color: #111827; font-weight: 500;">${bookingData.serviceName}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #6b7280;">Consultation Charge:</td>
              <td style="padding: 8px 0; color: #111827; font-weight: 600;">₹${bookingData.serviceCharge}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #6b7280;">Consultation Type:</td>
              <td style="padding: 8px 0; color: #111827; text-transform: capitalize;">${bookingData.consultationType === 'online' ? 'Online Consultation' : 'In-Clinic Visit'}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #6b7280;">Date:</td>
              <td style="padding: 8px 0; color: #111827;">${bookingData.date}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #6b7280;">Time:</td>
              <td style="padding: 8px 0; color: #111827;">${bookingData.timeSlot}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #6b7280;">WhatsApp:</td>
              <td style="padding: 8px 0; color: #111827;">${bookingData.whatsapp}</td>
            </tr>
            ${bookingData.email ? `
            <tr>
              <td style="padding: 8px 0; color: #6b7280;">Email:</td>
              <td style="padding: 8px 0; color: #111827;">${bookingData.email}</td>
            </tr>
            ` : ''}
            <tr>
              <td style="padding: 8px 0; color: #6b7280;">Reason for Visit:</td>
              <td style="padding: 8px 0; color: #111827;">${bookingData.reason}</td>
            </tr>
          </table>
        </div>
      </div>
    `;

    let customerEmail;
    
    // Send customer confirmation email only if email is provided
    if (bookingData.email) {
      customerEmail = await resend.emails.send({
        from: 'Dr. Deogade Clinic <onboarding@resend.dev>',
        to: [bookingData.email],
        subject: 'Appointment Confirmation - Dr. Deogade Clinic',
        html: customerEmailContent,
      });

      console.log('Customer email sent:', customerEmail);
    }

    // Send clinic notification email (always sent)
    const clinicEmail = await resend.emails.send({
      from: 'Dr. Deogade Clinic <onboarding@resend.dev>',
      to: ['drteleconsultation@gmail.com'], // Replace with actual clinic email
      subject: `New Appointment: ${bookingData.name} - ${bookingData.serviceName} - ${bookingData.date} at ${bookingData.timeSlot}`,
      html: clinicEmailContent,
    });

    console.log('Clinic email sent:', clinicEmail);

    return new Response(JSON.stringify({ 
      success: true, 
      customerEmailId: customerEmail?.data?.id,
      clinicEmailId: clinicEmail.data?.id 
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-booking-confirmation function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);