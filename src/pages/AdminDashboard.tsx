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
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .order('appointment_date', { ascending: true });

      if (error) throw error;
      setAppointments(data || []);
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
      console.error('Error updating appointment:', error);
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

  const upcomingAppointments = appointments.filter(apt => 
    new Date(apt.appointment_date) > new Date() &&
    new Date(apt.appointment_date).toDateString() !== new Date().toDateString()
  );

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="outline" size="icon" onClick={() => navigate('/')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
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

        {/* Today's Appointments */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Today's Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            {todayAppointments.length === 0 ? (
              <p className="text-muted-foreground">No appointments for today</p>
            ) : (
              <div className="space-y-4">
                {todayAppointments.map((appointment) => (
                  <div key={appointment.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-6 gap-4 flex-1">
                      <div>
                        <p className="font-medium">{appointment.patient_name}</p>
                        <p className="text-sm text-muted-foreground">{appointment.age}Y, {appointment.gender}</p>
                      </div>
                      <div>
                        <p className="text-sm">{appointment.time_slot}</p>
                        <p className="text-sm text-muted-foreground">{appointment.consultation_type}</p>
                      </div>
                      <div>
                        <p className="text-sm">{appointment.service_type}</p>
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
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateAppointmentStatus(appointment.id, 'confirmed')}
                        disabled={appointment.status === 'confirmed'}
                      >
                        Confirm
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateAppointmentStatus(appointment.id, 'completed')}
                        disabled={appointment.status === 'completed'}
                      >
                        Complete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* All Appointments */}
        <Card>
          <CardHeader>
            <CardTitle>All Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {appointments.map((appointment) => (
                <div key={appointment.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-7 gap-4 flex-1">
                    <div>
                      <p className="font-medium">{appointment.patient_name}</p>
                      <p className="text-sm text-muted-foreground">{appointment.age}Y, {appointment.gender}</p>
                    </div>
                    <div>
                      <p className="text-sm">{appointment.appointment_date}</p>
                      <p className="text-sm text-muted-foreground">{appointment.time_slot}</p>
                    </div>
                    <div>
                      <p className="text-sm">{appointment.consultation_type}</p>
                    </div>
                    <div>
                      <p className="text-sm">{appointment.service_type}</p>
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
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateAppointmentStatus(appointment.id, 'confirmed')}
                      disabled={appointment.status === 'confirmed' || appointment.status === 'completed'}
                    >
                      Confirm
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateAppointmentStatus(appointment.id, 'completed')}
                      disabled={appointment.status === 'completed'}
                    >
                      Complete
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => updateAppointmentStatus(appointment.id, 'cancelled')}
                      disabled={appointment.status === 'cancelled' || appointment.status === 'completed'}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;