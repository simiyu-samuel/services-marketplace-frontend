import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Check, Clock, User, Phone, Mail, MessageSquare, ArrowRight } from 'lucide-react';
import { format, setHours, setMinutes } from 'date-fns';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast'; // Use the custom toast
import api from '@/lib/api'; // Assuming an API utility

const timeSlots = [
  '09:00', '10:00', '11:00', '12:00',
  '13:00', '14:00', '15:00', '16:00',
  '17:00', '18:00'
];

interface FormData {
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  preferred_date_time: Date | undefined;
  message: string;
}

const GeneralBookingSection: React.FC = (): JSX.Element | null => {
  const [formData, setFormData] = useState<FormData>({
    customer_name: '',
    customer_phone: '',
    customer_email: '',
    preferred_date_time: undefined,
    message: '',
  });
  const [loading, setLoading] = useState(false);
      const [errors, setErrors] = useState<Record<string, string[]>>({});
      const { toast } = useToast();

      const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
      const [selectedTime, setSelectedTime] = useState<string | null>(null);
      const [activeTab, setActiveTab] = useState('schedule');

      const handleDateSelect = (date: Date | undefined) => {
        setSelectedDate(date);
        if (date && selectedTime) {
          const [hours, minutes] = selectedTime.split(':').map(Number);
          const newDateTime = setMinutes(setHours(date, hours), minutes);
          setFormData((prev) => ({ ...prev, preferred_date_time: newDateTime }));
        } else if (date) {
          setFormData((prev) => ({ ...prev, preferred_date_time: date }));
        }
        if (errors.preferred_date_time) {
          setErrors((prev) => {
            const newErrors = { ...prev };
            delete newErrors.preferred_date_time;
            return newErrors;
          });
        }
      };

      const handleTimeSelect = (time: string) => {
        setSelectedTime(time);
        if (selectedDate) {
          const [hours, minutes] = time.split(':').map(Number);
          const newDateTime = setMinutes(setHours(selectedDate, hours), minutes);
          setFormData((prev) => ({ ...prev, preferred_date_time: newDateTime }));
          setActiveTab('enquiry');
        }
        if (errors.preferred_date_time) {
          setErrors((prev) => {
            const newErrors = { ...prev };
            delete newErrors.preferred_date_time;
            return newErrors;
          });
        }
      };

      const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setFormData((prev) => ({ ...prev, [id]: value }));
        if (errors[id]) {
          setErrors((prev) => {
            const newErrors = { ...prev };
            delete newErrors[id];
            return newErrors;
          });
        }
      };

      const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        // Basic validation before API call
        if (!selectedDate) {
          setErrors({ preferred_date_time: ["Please select a date."] });
          setLoading(false);
          return;
        }
        if (!selectedTime) {
          setErrors({ preferred_date_time: ["Please select a time slot."] });
          setLoading(false);
          return;
        }
        if (!formData.customer_name) {
          setErrors({ customer_name: ["Name is required."] });
          setLoading(false);
          return;
        }
        if (!formData.customer_phone) {
          setErrors({ customer_phone: ["Phone number is required."] });
          setLoading(false);
          return;
        }
        if (!formData.customer_email) {
          setErrors({ customer_email: ["Email is required."] });
          setLoading(false);
          return;
        }

        try {
          const payload = {
            ...formData,
            preferred_date_time: formData.preferred_date_time
              ? format(formData.preferred_date_time, "yyyy-MM-dd HH:mm:ss") // Changed format to match Y-m-d H:i:s
              : null,
          };

          const response = await api.post('/general-bookings', payload);

          toast({
            title: 'Success!',
            description: response.data.message,
          });

          // Clear form
          setFormData({
            customer_name: '',
            customer_phone: '',
            customer_email: '',
            preferred_date_time: undefined,
            message: '',
          });
          setSelectedDate(new Date());
          setSelectedTime(null);
          setActiveTab('schedule');
        } catch (error: unknown) { // Changed to 'unknown' for better type safety
          const typedError = error as { response?: { status: number; data: { errors: Record<string, string[]>; message?: string } } };
          if (typedError.response && typedError.response.status === 422) {
            setErrors(typedError.response.data.errors);
            toast({
              title: 'Validation Error',
              description: 'Please correct the errors in the form.',
              variant: 'destructive',
            });
          } else {
            toast({
              title: 'Error',
              description: typedError.response?.data?.message || 'An unexpected error occurred.',
              variant: 'destructive',
            });
          }
        } finally {
          setLoading(false);
        }
      };

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-xl bg-gradient-to-br from-gray-50 to-white flex flex-col">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Book a General Appointment</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col overflow-hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full flex-grow flex flex-col">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="schedule">
              <Clock className="h-4 w-4 mr-2" /> Schedule
            </TabsTrigger>
            <TabsTrigger value="enquiry" disabled={!selectedDate || !selectedTime} className={cn(selectedDate && selectedTime ? "text-primary" : "text-muted-foreground")}>
              <MessageSquare className="h-4 w-4 mr-2" /> Enquiry
            </TabsTrigger>
          </TabsList>
          <TabsContent value="schedule" className="mt-6 flex-grow overflow-y-auto h-full">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full"
            >
              <div className="flex flex-col h-full">
                <h3 className="text-lg font-semibold mb-3">Select Date</h3>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={handleDateSelect}
                  className={cn("rounded-md border shadow w-full flex-grow", errors.preferred_date_time ? 'border-red-500' : '')}
                  disabled={(date) => date < new Date()}
                />
                {errors.preferred_date_time && (
                  <p className="text-red-500 text-sm mt-1">{errors.preferred_date_time[0]}</p>
                )}
              </div>
              <div className="flex flex-col h-full">
                <h3 className="text-lg font-semibold mb-3">Select Time Slot</h3>
                <div className={cn("grid grid-cols-2 sm:grid-cols-3 gap-2 flex-grow overflow-y-auto pr-2 max-h-[250px]", errors.preferred_date_time ? 'border-red-500' : '')}>
                  {timeSlots.map(slot => (
                    <Button
                      key={slot}
                      variant={selectedTime === slot ? 'default' : 'outline'}
                      onClick={() => handleTimeSelect(slot)}
                      disabled={!selectedDate}
                      className={cn("flex items-center justify-center", selectedTime === slot ? "bg-primary text-primary-foreground" : "")}
                    >
                      {slot}
                      {selectedTime === slot && <Check className="ml-2 h-4 w-4" />}
                    </Button>
                  ))}
                </div>
                {errors.preferred_date_time && !selectedTime && (
                  <p className="text-red-500 text-sm mt-1">{errors.preferred_date_time[0]}</p>
                )}
              </div>
            </motion.div>
          </TabsContent>
          <TabsContent value="enquiry" className="mt-6 flex-grow overflow-y-auto h-full">
            <motion.form
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              onSubmit={handleSubmit}
              className="space-y-4 flex flex-col h-full"
            >
              <div>
                <Label htmlFor="customer_name" className="flex items-center gap-2 mb-1">
                  <User className="h-4 w-4" /> Your Name
                </Label>
                <Input
                  id="customer_name"
                  name="customer_name"
                  value={formData.customer_name}
                  onChange={handleFormChange}
                  placeholder="John Doe"
                  className={errors.customer_name ? 'border-red-500' : ''}
                />
                {errors.customer_name && (
                  <p className="text-red-500 text-sm mt-1">{errors.customer_name[0]}</p>
                )}
              </div>
              <div>
                <Label htmlFor="customer_phone" className="flex items-center gap-2 mb-1">
                  <Phone className="h-4 w-4" /> Phone Number
                </Label>
                <Input
                  id="customer_phone"
                  name="customer_phone"
                  value={formData.customer_phone}
                  onChange={handleFormChange}
                  placeholder="+123 456 7890"
                  className={errors.customer_phone ? 'border-red-500' : ''}
                />
                {errors.customer_phone && (
                  <p className="text-red-500 text-sm mt-1">{errors.customer_phone[0]}</p>
                )}
              </div>
              <div>
                <Label htmlFor="customer_email" className="flex items-center gap-2 mb-1">
                  <Mail className="h-4 w-4" /> Email Address
                </Label>
                <Input
                  id="customer_email"
                  name="customer_email"
                  type="email"
                  value={formData.customer_email}
                  onChange={handleFormChange}
                  placeholder="john.doe@example.com"
                  className={errors.customer_email ? 'border-red-500' : ''}
                />
                {errors.customer_email && (
                  <p className="text-red-500 text-sm mt-1">{errors.customer_email[0]}</p>
                )}
              </div>
              <div>
                <Label htmlFor="message" className="flex items-center gap-2 mb-1">
                  <MessageSquare className="h-4 w-4" /> Message (Optional)
                </Label>
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleFormChange}
                  placeholder="Any specific requests or details?"
                  rows={4}
                  className={errors.message ? 'border-red-500' : ''}
                />
                {errors.message && (
                  <p className="text-red-500 text-sm mt-1">{errors.message[0]}</p>
                )}
              </div>
              <Button type="submit" className="w-full mt-auto" disabled={loading}>
                {loading ? 'Submitting...' : 'Submit Appointment Request'}
              </Button>
            </motion.form>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default GeneralBookingSection;
