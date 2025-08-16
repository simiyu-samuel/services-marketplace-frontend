import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const MyServices = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>My Services</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">A table to manage your services will appear here.</p>
      </CardContent>
    </Card>
  );
};

export default MyServices;