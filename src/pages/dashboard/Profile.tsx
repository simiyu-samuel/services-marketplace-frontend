import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Profile = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>My Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">A form to edit your profile information will appear here.</p>
      </CardContent>
    </Card>
  );
};

export default Profile;