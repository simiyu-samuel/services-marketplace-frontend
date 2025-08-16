import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Settings = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">Options to manage your account settings, such as changing your password, will appear here.</p>
      </CardContent>
    </Card>
  );
};

export default Settings;