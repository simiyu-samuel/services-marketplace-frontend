import { useState } from "react";
import { Service } from "@/types";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { showSuccess, showError } from "@/utils/toast";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";

interface BookingDialogProps {
  service: Service;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

const BookingDialog = ({ service, isOpen, onOpenChange }: BookingDialogProps) => {
  const { user } = useAuth();
  const [date, setDate] = useState<Date | undefined>(new Date());

  const handleBooking = () => {
    if (!date) {
      showError("Please select a date for your appointment.");
      return;
    }
    // In a real app, you would call an API to create the booking.
    console.log({
      userId: user?.id,
      serviceId: service.id,
      bookingDate: date,
    });
    showSuccess(`Booking for "${service.title}" confirmed for ${date.toLocaleDateString()}!`);
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Book: {service.title}</DialogTitle>
          <DialogDescription>
            Select a date for your appointment. The seller will contact you to confirm the time.
          </DialogDescription>
        </DialogHeader>
        {user ? (
          <div className="py-4">
            <div className="flex justify-center">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border"
                disabled={(day) => day < new Date(new Date().setDate(new Date().getDate() - 1))}
              />
            </div>
          </div>
        ) : (
          <div className="py-8 text-center">
            <p className="mb-4">You need to be logged in to book a service.</p>
            <Button asChild>
              <Link to="/login">Login to Continue</Link>
            </Button>
          </div>
        )}
        {user && (
          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button onClick={handleBooking}>Confirm Booking</Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default BookingDialog;