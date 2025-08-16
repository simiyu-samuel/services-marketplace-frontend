import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";

const Register = () => {
  return (
    <div className="container py-16 flex justify-center items-center">
      <div className="w-full max-w-4xl text-center">
        <h1 className="text-3xl font-bold mb-4">Join Themabinti</h1>
        <p className="text-muted-foreground mb-8">Are you looking for services, or do you want to offer them?</p>
        <div className="grid md:grid-cols-2 gap-8">
          <Card className="text-left">
            <CardHeader>
              <CardTitle>I'm a Customer</CardTitle>
              <CardDescription>Find and book the best lifestyle services near you.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link to="/register/customer">Sign up as a Customer</Link>
              </Button>
            </CardContent>
          </Card>
          <Card className="text-left">
            <CardHeader>
              <CardTitle>I'm a Seller</CardTitle>
              <CardDescription>Grow your business and reach more clients.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link to="/register/seller">Sign up as a Seller</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Register;