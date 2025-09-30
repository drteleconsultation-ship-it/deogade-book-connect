import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, User, Phone, Mail, FileText, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Appointment {
  id: string;
  patient_name: string;
  age: string;
  gender: string;
  whatsapp: string;
  email?: string;
  reason: string;
  consultation_type: 'online' | 'clinic';
  service_type: string;
  appointment_date: string;
  time_slot: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  created_at: string;
}

const AdminDashboard: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error || !session) {
        navigate('/admin-auth');
        return;
      }

      // Check if user is authorized admin
      const { data: adminUser, error: adminError } = await supabase
        .from('admin_users')
        .select('*')
        .eq('email', session.user.email)
        .eq('is_active', true)
        .single();

      if (adminError || !adminUser) {
        toast({
          title: "Access Denied",
          description: "You are not authorized to access this dashboard.",
          variant: "destructive",
        });
        await supabase.auth.signOut();
        navigate('/admin-auth');
        return;
      }

      setUser(session.user);
      fetchAppointments();
    } catch (error) {
      console.error('Auth check error:', error);
      navigate('/admin-auth');
    }
  };

  const fetchAppointments = async () => {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .order('appointment_date', { ascending: true });

      if (error) {
        console.error('Supabase error:', error);
        toast({
          title: "Error",
          description: "Failed to load appointments. Please check if the appointments table exists.",
          variant: "destructive",
        });
        return;
      }

      setAppointments((data as Appointment[]) || []);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      toast({
        title: "Error",
        description: "Failed to load appointments",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateAppointmentStatus = async (id: string, status: string) => {
    try {
      // Validate status parameter
      const validStatuses = ['pending', 'confirmed', 'completed', 'cancelled'];
      if (!validStatuses.includes(status)) {
        toast({
          title: "Error",
          description: "Invalid appointment status",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from('appointments')
        .update({ status })
        .eq('id', id);

      if (error) throw error;

      setAppointments(appointments.map(apt => 
        apt.id === id ? { ...apt, status: status as any } : apt
      ));

      toast({
        title: "Success",
        description: `Appointment ${status}`,
      });
    } catch (error) {
      console.error('Error updating appointment');
      toast({
        title: "Error",
        description: "Failed to update appointment",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const todayAppointments = appointments.filter(apt => 
    new Date(apt.appointment_date).toDateString() === new Date().toDateString()
  );

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/admin-auth');
  };

  if (loading || !user) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" onClick={() => navigate('/')}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
          </div>
          <Button variant="outline" onClick={handleSignOut}>
            Sign Out
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Appointments</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{appointments.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today's Appointments</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{todayAppointments.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {appointments.filter(apt => apt.status === 'pending').length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Confirmed</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {appointments.filter(apt => apt.status === 'confirmed').length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* All Appointments */}
        <Card>
          <CardHeader>
            <CardTitle>All Appointments ({appointments.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {appointments.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No appointments found</p>
            ) : (
              <div className="space-y-4">
                {appointments.map((appointment) => (
                  <div key={appointment.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-6 gap-4 flex-1">
                      <div>
                        <p className="font-medium">{appointment.patient_name}</p>
                        <p className="text-sm text-muted-foreground">{appointment.age}Y, {appointment.gender}</p>
                      </div>
                      <div>
                        <p className="text-sm">{new Date(appointment.appointment_date).toLocaleDateString()}</p>
                        <p className="text-sm text-muted-foreground">{appointment.time_slot}</p>
                      </div>
                      <div>
                        <p className="text-sm">{appointment.consultation_type}</p>
                        <p className="text-sm text-muted-foreground">{appointment.service_type}</p>
                      </div>
                      <div>
                        <p className="text-sm">{appointment.whatsapp}</p>
                        {appointment.email && <p className="text-sm text-muted-foreground">{appointment.email}</p>}
                      </div>
                      <div>
                        <p className="text-sm">{appointment.reason}</p>
                      </div>
                      <div>
                        <Badge className={getStatusColor(appointment.status)}>
                          {appointment.status}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      {appointment.status === 'pending' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateAppointmentStatus(appointment.id, 'confirmed')}
                        >
                          Confirm
                        </Button>
                      )}
                      {(appointment.status === 'confirmed' || appointment.status === 'pending') && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateAppointmentStatus(appointment.id, 'completed')}
                        >
                          Complete
                        </Button>
                      )}
                      {appointment.status !== 'cancelled' && appointment.status !== 'completed' && (
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => updateAppointmentStatus(appointment.id, 'cancelled')}
                        >
                          Cancel
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;