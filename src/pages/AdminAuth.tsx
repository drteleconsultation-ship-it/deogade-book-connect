import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, ArrowLeft, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const AdminAuth: React.FC = () => {
  const [email, setEmail] = useState('drteleconsultation@gmail.com');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const sendOTP = async () => {
    setLoading(true);
    try {
      // Send OTP without revealing if email is authorized
      // This prevents email enumeration attacks
      const { error } = await supabase.auth.signInWithOtp({
        email: email,
        options: {
          emailRedirectTo: `${window.location.origin}/admin`
        }
      });

      if (error) throw error;

      setStep('otp');
      toast({
        title: "Verification Code Sent",
        description: "If your email is authorized, you will receive a verification code.",
      });
    } catch (error: any) {
      toast({
        title: "Request Received",
        description: "If your email is authorized, you will receive a verification code.",
      });
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email: email,
        token: otp,
        type: 'email'
      });

      if (error) throw error;

      if (data.user) {
        // Verify admin status after successful OTP
        const { data: adminUser, error: adminError } = await supabase
          .from('admin_users')
          .select('*')
          .eq('email', email)
          .eq('is_active', true)
          .single();

        if (adminError || !adminUser) {
          await supabase.auth.signOut();
          toast({
            title: "Access Denied",
            description: "You are not authorized for admin access.",
            variant: "destructive",
          });
          return;
        }

        toast({
          title: "Success",
          description: "Login successful! Redirecting to admin dashboard.",
        });
        navigate('/admin');
      }
    } catch (error: any) {
      toast({
        title: "Verification Failed",
        description: "Invalid or expired code. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="outline" size="icon" onClick={() => navigate('/')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold text-foreground">Admin Login</h1>
        </div>

        <Card>
          <CardHeader className="text-center">
            <div className="bg-medical-gradient p-3 rounded-full w-12 h-12 mx-auto mb-4 flex items-center justify-center">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <CardTitle className="text-xl">
              {step === 'email' ? 'Enter Admin Email' : 'Enter Verification Code'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {step === 'email' ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter admin email"
                    disabled={loading}
                  />
                </div>
                <Button 
                  onClick={sendOTP} 
                  disabled={loading || !email}
                  className="w-full"
                >
                  <Mail className="mr-2 h-4 w-4" />
                  {loading ? 'Sending...' : 'Send OTP'}
                </Button>
              </>
            ) : (
              <>
                <div className="space-y-2">
                  <Label htmlFor="otp">Verification Code</Label>
                  <Input
                    id="otp"
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter 6-digit code"
                    disabled={loading}
                    maxLength={6}
                  />
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    onClick={() => setStep('email')}
                    disabled={loading}
                    className="flex-1"
                  >
                    Back
                  </Button>
                  <Button 
                    onClick={verifyOTP} 
                    disabled={loading || otp.length !== 6}
                    className="flex-1"
                  >
                    {loading ? 'Verifying...' : 'Verify'}
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminAuth;