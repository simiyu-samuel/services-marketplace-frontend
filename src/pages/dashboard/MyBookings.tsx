import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const MyBookings = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>My Bookings</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">A list of your past and upcoming bookings will appear here.</p>
      </CardContent>
    </Card>
  );
};

export default MyBookings;