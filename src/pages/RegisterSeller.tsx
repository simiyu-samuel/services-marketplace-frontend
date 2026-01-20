import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { showError, showSuccess } from "@/utils/toast";
import { usePackagePrices } from "@/hooks/usePackagePrices";
import { RegisterPayload } from "@/types";
import { AxiosError } from "axios";
import { CheckCircle, Camera, List, Star, Calendar, Sparkles, Zap, Shield, ChevronRight, Check, X, ArrowLeft, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Invalid email address." }),
  phone_number: z.string().min(10, { message: "Please enter a valid phone number." }),
  password: z.string().min(8, { message: "Password must be at least 8 characters." }),
  password_confirmation: z.string(),
  seller_package: z.enum(["basic", "standard", "premium"], { required_error: "You need to select a package." }),
}).refine(data => data.password === data.password_confirmation, {
  message: "Passwords do not match.",
  path: ["password_confirmation"],
});

const packageFeatures = {
  basic: [
    { feature: "2 photos per service", included: true },
    { feature: "1 service listing", included: true },
    { feature: "Standard listing visibility", included: true },
    { feature: "Book appointment feature", included: true },
  ],
  standard: [
    { feature: "3 photos per service", included: true },
    { feature: "2 service listings", included: true },
    { feature: "Enhanced listing visibility", included: true },
    { feature: "Book appointment feature", included: true },
    { feature: "Priority support", included: true },
  ],
  premium: [
    { feature: "5 photos per service", included: true },
    { feature: "4 service listings", included: true },
    { feature: "Premium listing visibility", included: true },
    { feature: "Book appointment feature", included: true },
    { feature: "24/7 priority support", included: true },
    { feature: "Featured on homepage", included: true },
  ],
};

const packageDetails = {
  basic: { 
    name: "Basic", 
    badgeColor: "border-blue-500 bg-blue-50",
    textColor: "text-blue-700",
    icon: CheckCircle,
    price: 1500,
    recommended: false
  },
  standard: { 
    name: "Standard", 
    badgeColor: "border-purple-500 bg-purple-50",
    textColor: "text-purple-700",
    icon: Zap,
    price: 2500,
    recommended: true
  },
  premium: { 
    name: "Premium", 
    badgeColor: "border-amber-500 bg-amber-50",
    textColor: "text-amber-700",
    icon: Sparkles,
    price: 4000,
    recommended: false
  },
};

const RegisterSeller = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const { data: packagePrices, isLoading: pricesLoading, isError } = usePackagePrices();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<'basic' | 'standard' | 'premium'>('standard');
  const [currentStep, setCurrentStep] = useState<'package' | 'form'>('package');
  const [isMobile, setIsMobile] = useState(false);

  // Check screen size on mount and resize
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    // Initial check
    checkScreenSize();
    
    // Add event listener
    window.addEventListener('resize', checkScreenSize);
    
    // Clean up
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Auto-switch to package view on desktop
  useEffect(() => {
    if (!isMobile) {
      setCurrentStep('package');
    }
  }, [isMobile]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { 
      name: "", 
      email: "", 
      phone_number: "", 
      password: "", 
      password_confirmation: "",
      seller_package: "standard"
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const response = await register({ ...values, user_type: 'seller' } as RegisterPayload);
      const { user, needs_seller_payment } = response;

      if (needs_seller_payment) {
        const { seller_package, email } = values;
        localStorage.setItem('selectedPackage', JSON.stringify({
          name: seller_package,
          price: packagePrices ? packagePrices[seller_package as keyof typeof packagePrices] : packageDetails[seller_package].price,
        }));
        showSuccess("Account created! Please verify your email and complete the payment to proceed.");
        navigate("/email-verification-prompt");
      } else {
        showSuccess("Registration successful!");
        navigate("/dashboard");
      }
    } catch (error: unknown) {
      if (error instanceof AxiosError && error.response?.status === 422) {
        const apiErrors = error.response.data.errors as Record<string, string[]>;
        Object.keys(apiErrors).forEach((field) => {
          form.setError(field as keyof z.infer<typeof formSchema>, {
            type: "server",
            message: apiErrors[field][0],
          });
        });
      } else {
        const errorMessage = error.response?.data?.message || "Registration failed. Please try again.";
        showError(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  }

  const handlePackageSelect = (value: 'basic' | 'standard' | 'premium') => {
    setSelectedPackage(value);
    form.setValue('seller_package', value);
    if (isMobile) {
      // Smooth transition to form
      setTimeout(() => setCurrentStep('form'), 300);
    }
  };

  const getPrice = (pkg: 'basic' | 'standard' | 'premium') => {
    if (packagePrices) {
      return packagePrices[pkg];
    }
    return packageDetails[pkg].price;
  };

  // Mobile View - Step-by-Step Flow
  if (isMobile) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-6 px-4 pb-24">
        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-8 max-w-md mx-auto">
          <div className="flex items-center gap-2">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${currentStep === 'package' ? 'bg-blue-600 text-white' : 'bg-green-100 text-green-600'}`}>
              1
            </div>
            <span className={`text-sm font-medium ${currentStep === 'package' ? 'text-blue-600' : 'text-green-600'}`}>
              Choose Plan
            </span>
          </div>
          <div className="h-0.5 flex-1 bg-gray-200 mx-2"></div>
          <div className="flex items-center gap-2">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${currentStep === 'form' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-400'}`}>
              2
            </div>
            <span className={`text-sm font-medium ${currentStep === 'form' ? 'text-blue-600' : 'text-gray-400'}`}>
              Register
            </span>
          </div>
        </div>

        {currentStep === 'package' ? (
          // Step 1: Package Selection (Mobile)
          <div className="max-w-md mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Choose Your Plan
              </h1>
              <p className="text-gray-600">
                Select the perfect package for your business
              </p>
            </div>

            {/* Package Tabs */}
            <Tabs defaultValue="standard" className="w-full mb-6">
              <TabsList className="grid w-full grid-cols-3 mb-4">
                <TabsTrigger value="basic">Basic</TabsTrigger>
                <TabsTrigger value="standard">Standard</TabsTrigger>
                <TabsTrigger value="premium">Premium</TabsTrigger>
              </TabsList>
              
              {(['basic', 'standard', 'premium'] as const).map((pkg) => {
                const details = packageDetails[pkg];
                const features = packageFeatures[pkg];
                const Icon = details.icon;
                
                return (
                  <TabsContent key={pkg} value={pkg} className="mt-4 space-y-4">
                    <Card className={`border-2 ${selectedPackage === pkg ? details.badgeColor : 'border-gray-200'}`}>
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Icon className={`h-6 w-6 ${details.textColor}`} />
                            <div>
                              <CardTitle className="text-xl">{details.name}</CardTitle>
                              <div className="text-sm text-gray-500">One-time payment</div>
                            </div>
                          </div>
                          <div className="text-2xl font-bold">
                            Ksh {getPrice(pkg).toLocaleString()}
                          </div>
                        </div>
                      </CardHeader>
                      
                      <CardContent className="pt-0">
                        <div className="space-y-3">
                          <div className="font-medium">All features included:</div>
                          <div className="space-y-2">
                            {features.map((item, index) => (
                              <div key={index} className="flex items-center gap-3">
                                <div className={`p-1 rounded-full ${item.included ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                                  <Check className="h-4 w-4" />
                                </div>
                                <span className="text-sm">{item.feature}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                );
              })}
            </Tabs>

            {/* Quick Comparison - Buttons */}
            <div className="space-y-3 mb-8">
              {(['basic', 'standard', 'premium'] as const).map((pkg) => (
                <button
                  key={pkg}
                  onClick={() => handlePackageSelect(pkg)}
                  className={`w-full p-4 rounded-lg border-2 transition-all flex items-center justify-between ${
                    selectedPackage === pkg 
                      ? packageDetails[pkg].badgeColor + ' scale-[1.02]'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div className="text-left">
                    <div className="font-medium">{packageDetails[pkg].name}</div>
                    <div className="text-sm text-gray-500">
                      {pkg === 'basic' && 'Essential features for starters'}
                      {pkg === 'standard' && 'Most popular choice'}
                      {pkg === 'premium' && 'Complete business solution'}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">Ksh {getPrice(pkg).toLocaleString()}</div>
                    <div className="text-xs text-gray-500">one-time</div>
                  </div>
                </button>
              ))}
            </div>

            {/* Select Button */}
            <Button
              onClick={() => handlePackageSelect(selectedPackage)}
              className="w-full py-6 text-lg shadow-lg mb-6"
              size="lg"
            >
              Continue with {packageDetails[selectedPackage].name} Plan
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>

            {/* Security Note */}
            <div className="p-3 bg-gray-50 rounded-lg flex items-center gap-2 border border-gray-200">
              <Shield className="h-4 w-4 text-green-600" />
              <span className="text-sm text-gray-600">
                30-day money-back guarantee • Secure payment
              </span>
            </div>
          </div>
        ) : (
          // Step 2: Registration Form (Mobile)
          <div className="max-w-md mx-auto">
            {/* Back Button and Selected Plan */}
            <div className="mb-8">
              <button
                onClick={() => setCurrentStep('package')}
                className="flex items-center gap-2 text-blue-600 mb-6"
              >
                <ArrowLeft className="h-4 w-4" />
                Change Plan
              </button>
              
              {/* Selected Plan Card */}
              <Card className="border-2 border-blue-200 bg-blue-50">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-gray-600">Selected Plan</div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-lg">{packageDetails[selectedPackage].name}</span>
                        <Badge className={packageDetails[selectedPackage].textColor + " bg-white"}>
                          {selectedPackage}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-600">One-time payment</div>
                      <div className="font-bold text-xl">Ksh {getPrice(selectedPackage).toLocaleString()}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Registration Form */}
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Create Your Account</CardTitle>
                    <CardDescription>
                      Fill in your business details
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <FormField 
                      control={form.control} 
                      name="name" 
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Business/Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Glamour Studios" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )} 
                    />
                    
                    <FormField 
                      control={form.control} 
                      name="phone_number" 
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Business Phone</FormLabel>
                          <FormControl>
                            <Input placeholder="0712345678" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )} 
                    />
                    
                    <FormField 
                      control={form.control} 
                      name="email" 
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Business Email</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="contact@glamour.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )} 
                    />
                    
                    <FormField 
                      control={form.control} 
                      name="password" 
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="••••••••" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )} 
                    />
                    
                    <FormField 
                      control={form.control} 
                      name="password_confirmation" 
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirm Password</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="••••••••" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )} 
                    />
                    
                    <input type="hidden" {...form.register('seller_package')} />
                  </CardContent>
                </Card>

                {/* Security Info */}
                <div className="flex items-center gap-2 text-sm text-gray-600 p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <Shield className="h-4 w-4 text-green-600" />
                  <span>Your information is secure with 256-bit encryption</span>
                </div>

                {/* Sticky Submit Button */}
                <div className="fixed bottom-0 left-0 right-0 bg-white p-4 border-t shadow-lg z-10">
                  <Button 
                    type="submit" 
                    className="w-full py-6 text-lg font-semibold"
                    disabled={isLoading}
                    size="lg"
                  >
                    {isLoading ? (
                      "Creating Account..."
                    ) : (
                      <>
                        Create Account & Pay Ksh {getPrice(selectedPackage).toLocaleString()}
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </>
                    )}
                  </Button>
                  <p className="text-xs text-gray-500 text-center mt-2">
                    By creating an account, you agree to our Terms & Privacy
                  </p>
                </div>
              </form>
            </Form>
            
            {/* Spacer for fixed button */}
            <div className="h-28"></div>
          </div>
        )}
      </div>
    );
  }

  // Desktop View (Original layout)
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-8 px-6 pb-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Choose Your Plan
          </h1>
          <p className="text-gray-600 text-lg">
            Select the perfect package to showcase your services
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column: Packages */}
          <div className="space-y-6">
            {(['basic', 'standard', 'premium'] as const).map((pkg) => {
              const details = packageDetails[pkg];
              const features = packageFeatures[pkg];
              const isSelected = selectedPackage === pkg;
              
              return (
                <Card 
                  key={pkg}
                  className={`relative border-2 transition-all duration-200 hover:shadow-lg ${isSelected ? details.badgeColor : 'border-gray-200'}`}
                >
                  {details.recommended && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-purple-600 text-white px-4 py-1 rounded-full">
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-2xl font-bold text-gray-900">
                          {details.name}
                        </CardTitle>
                        <div className="mt-2">
                          <div className="text-3xl font-bold text-gray-900">
                            Ksh {getPrice(pkg).toLocaleString()}
                          </div>
                          <div className="text-sm text-gray-500">
                            one-time payment
                          </div>
                        </div>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-sm font-semibold border ${details.badgeColor} ${details.textColor}`}>
                        {pkg}
                      </div>
                    </div>
                  </CardHeader>
                  
                  <Separator />
                  
                  <CardContent className="pt-6">
                    <h4 className="font-semibold text-gray-900 mb-4 text-lg">
                      Features included:
                    </h4>
                    <ul className="space-y-3">
                      {features.map((item, index) => (
                        <li key={index} className="flex items-center gap-3">
                          <div className={`p-1 rounded-full ${item.included ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                            <Check className="h-4 w-4" />
                          </div>
                          <span className={`text-sm ${item.included ? 'text-gray-700' : 'text-gray-400'}`}>
                            {item.feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                    
                    <div className="mt-6 pt-6 border-t">
                      <Button 
                        variant={isSelected ? "default" : "outline"}
                        className="w-full"
                        onClick={() => handlePackageSelect(pkg)}
                      >
                        {isSelected ? (
                          <>
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Selected
                          </>
                        ) : (
                          <>
                            Select Plan
                            <ChevronRight className="h-4 w-4 ml-2" />
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Right Column: Registration Form */}
          <div className="space-y-6">
            <Card className="border-2 border-gray-200">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-gray-900">
                  Create Your Seller Account
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Join thousands of successful businesses growing with us
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                {/* Selected Plan Banner */}
                <div className="mb-6 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-300">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-gray-500 font-medium">Selected Plan:</div>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-gray-900">
                          {packageDetails[selectedPackage].name} Package
                        </span>
                        <Badge variant="outline" className={packageDetails[selectedPackage].textColor}>
                          {selectedPackage}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-500">Total</div>
                      <div className="text-2xl font-bold text-gray-900">
                        Ksh {getPrice(selectedPackage).toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Registration Form */}
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField 
                        control={form.control} 
                        name="name" 
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700 font-medium">
                              Business/Full Name
                            </FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Glamour Studios" 
                                className="bg-white border-gray-300"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )} 
                      />
                      
                      <FormField 
                        control={form.control} 
                        name="phone_number" 
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700 font-medium">
                              Business Phone
                            </FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="0712345678" 
                                className="bg-white border-gray-300"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )} 
                      />
                    </div>
                    
                    <FormField 
                      control={form.control} 
                      name="email" 
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700 font-medium">
                            Business Email
                          </FormLabel>
                          <FormControl>
                            <Input 
                              type="email" 
                              placeholder="contact@glamour.com" 
                              className="bg-white border-gray-300"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )} 
                    />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField 
                        control={form.control} 
                        name="password" 
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700 font-medium">
                              Password
                            </FormLabel>
                            <FormControl>
                              <Input 
                                type="password" 
                                placeholder="••••••••" 
                                className="bg-white border-gray-300"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )} 
                      />
                      
                      <FormField 
                        control={form.control} 
                        name="password_confirmation" 
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700 font-medium">
                              Confirm Password
                            </FormLabel>
                            <FormControl>
                              <Input 
                                type="password" 
                                placeholder="••••••••" 
                                className="bg-white border-gray-300"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )} 
                      />
                    </div>
                    
                    <input type="hidden" {...form.register('seller_package')} />
                    
                    <div className="pt-4 space-y-3">
                      <Button 
                        type="submit" 
                        className="w-full py-6 text-lg font-semibold bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                        disabled={pricesLoading || isLoading}
                        size="lg"
                      >
                        {isLoading ? (
                          "Creating Account..."
                        ) : (
                          <div className="flex items-center justify-center gap-3">
                            <span>Create Account & Pay</span>
                            <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-bold">
                              Ksh {getPrice(selectedPackage).toLocaleString()}
                            </span>
                          </div>
                        )}
                      </Button>
                      
                      <p className="text-xs text-gray-500 text-center">
                        By creating an account, you agree to our Terms of Service and Privacy Policy
                      </p>
                    </div>
                  </form>
                </Form>
                
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex flex-col items-center gap-2">
                    <div className="flex items-center gap-2 text-green-600">
                      <Shield className="h-4 w-4" />
                      <span className="text-sm font-medium">Secure payment</span>
                    </div>
                    <div className="text-xs text-gray-500 text-center">
                      30-day money-back guarantee • SSL encrypted
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterSeller;