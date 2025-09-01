import React, { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import api from '@/lib/api';
import { useNavigate } from 'react-router-dom';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent, CardDescription, CardTitle, CardFooter } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { AxiosError } from 'axios';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import { Settings as SettingsIcon, Key, Bell, Shield, Briefcase, Trash2, Save, RefreshCw } from 'lucide-react';
import ModernPageHeader from '@/components/dashboard/ModernPageHeader';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

const Settings = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    new_password_confirmation: '',
  });
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] = useState(false);
  const [deleteAccountPassword, setDeleteAccountPassword] = useState('');
  const navigate = useNavigate();
  const { user } = useAuth();
  const isSeller = user?.role === 'seller'; // Assuming 'role' property exists and 'seller' is the value for sellers.

  // Local state for form values
  const [notificationEmailEnabled, setNotificationEmailEnabled] = useState(false);
  const [notificationSmsEnabled, setNotificationSmsEnabled] = useState(false);
  const [notificationPromoEmail, setNotificationPromoEmail] = useState(false);
  const [privacyShowPhone, setPrivacyShowPhone] = useState(false);
  const [sellerBookingAutoConfirm, setSellerBookingAutoConfirm] = useState(false);
  const [sellerBookingLeadTimeHours, setSellerBookingLeadTimeHours] = useState(24);
  const [sellerCancellationPolicy, setSellerCancellationPolicy] = useState('');
  const [sellerProfileVisibility, setSellerProfileVisibility] = useState('public');
  const [sellerDefaultServiceDuration, setSellerDefaultServiceDuration] = useState(60);

  const handleDeleteAccount = async () => {
    setLoading(true);
    try {
      await api.delete('/user/account', {
        data: { password: deleteAccountPassword },
      });
      toast({
        title: 'Success',
        description: 'Your account has been successfully deactivated.',
      });
      localStorage.removeItem('token');
      navigate('/login');
    } catch (error) {
      toast({
        title: 'Error',
        description: (error as any)?.response?.data?.message || 'Failed to delete account.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
      setIsDeleteConfirmationOpen(false);
      setDeleteAccountPassword('');
    }
  };

  const handleSubmitPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/user/password', passwordData);
      toast({
        title: 'Success',
        description: 'Password updated successfully. Please log in with your new password.',
      });
      // Clear localStorage and redirect to login
      localStorage.removeItem('token'); // Assuming you store the token in localStorage
      navigate('/login');
    } catch (error) {
      toast({
        title: 'Error',
        description: (error as any)?.response?.data?.message || 'Failed to update password.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
      setPasswordData({
        current_password: '',
        new_password: '',
        new_password_confirmation: '',
      });
    }
  };

  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true);
      try {
        const response = await api.get('/settings');
        console.log('Settings response:', response); // Add this line
        setSettings(response.data.settings);
        // Initialize local state with fetched settings
        setNotificationEmailEnabled(response.data.settings?.notification_email_enabled || false);
        setNotificationSmsEnabled(response.data.settings?.notification_sms_enabled || false);
        setNotificationPromoEmail(response.data.settings?.notification_promo_email || false);
        setPrivacyShowPhone(response.data.settings?.privacy_show_phone || false);
        setSellerBookingAutoConfirm(response.data.settings?.seller_booking_auto_confirm || false);
        setSellerBookingLeadTimeHours(response.data.settings?.seller_booking_lead_time_hours || 24);
        setSellerCancellationPolicy(response.data.settings?.seller_cancellation_policy || '');
        setSellerProfileVisibility(response.data.settings?.seller_profile_visibility || 'public');
        setSellerDefaultServiceDuration(response.data.settings?.seller_default_service_duration || 60);
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to load settings.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleSaveNotificationSettings = async () => {
    setLoading(true);
    const payload: Record<string, any> = {};
    if (settings.notification_email_enabled !== notificationEmailEnabled) {
      payload.notification_email_enabled = notificationEmailEnabled;
    }
    if (settings.notification_sms_enabled !== notificationSmsEnabled) {
      payload.notification_sms_enabled = notificationSmsEnabled;
    }
    if (settings.notification_promo_email !== notificationPromoEmail) {
      payload.notification_promo_email = notificationPromoEmail;
    }

    // Only send the request if there are changes
    if (Object.keys(payload).length === 0) {
      toast({
        title: 'No changes',
        description: 'No notification settings were changed.',
      });
      setLoading(false);
      return;
    }

    try {
      await api.put('/settings', payload);
      toast({
        title: 'Success',
        description: 'Notification settings updated successfully.',
      });
      // Update local settings state
      setSettings({
        ...settings,
        ...payload, // Apply the changes that were sent
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update notification settings.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSavePrivacySettings = async () => {
    setLoading(true);
    try {
      await api.put('/settings', {
        privacy_show_phone: privacyShowPhone,
      });
      toast({
        title: 'Success',
        description: 'Privacy settings updated successfully.',
      });
      // Update local settings state
      setSettings({
        ...settings,
        privacy_show_phone: privacyShowPhone,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update privacy settings.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveBusinessSettings = async () => {
    setLoading(true);
    const payload: Record<string, any> = {};
    if (settings.seller_booking_auto_confirm !== sellerBookingAutoConfirm) {
      payload.seller_booking_auto_confirm = sellerBookingAutoConfirm;
    }
    if (settings.seller_booking_lead_time_hours !== sellerBookingLeadTimeHours) {
      payload.seller_booking_lead_time_hours = sellerBookingLeadTimeHours;
    }
    if (settings.seller_cancellation_policy !== sellerCancellationPolicy) {
      payload.seller_cancellation_policy = sellerCancellationPolicy;
    }
    if (settings.seller_profile_visibility !== sellerProfileVisibility) {
      payload.seller_profile_visibility = sellerProfileVisibility;
    }
    if (settings.seller_default_service_duration !== sellerDefaultServiceDuration) {
      payload.seller_default_service_duration = sellerDefaultServiceDuration;
    }

    // Only send the request if there are changes
    if (Object.keys(payload).length === 0) {
      toast({
        title: 'No changes',
        description: 'No business settings were changed.',
      });
      setLoading(false);
      return;
    }

    try {
      await api.put('/settings', payload);
      toast({
        title: 'Success',
        description: 'Business preferences updated successfully.',
      });
      // Update local settings state
      setSettings({
        ...settings,
        ...payload, // Apply the changes that were sent
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update business preferences.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading settings..." />
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="bg-destructive/10 p-3 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
            <RefreshCw className="h-8 w-8 text-destructive" />
          </div>
          <h3 className="text-lg font-semibold">Failed to load settings</h3>
          <p className="text-muted-foreground">Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <ModernPageHeader 
          title="Settings" 
          description="Manage your account settings and preferences"
          icon={SettingsIcon}
        />

        <div className="space-y-8">
          {/* Password Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="bg-card border-border shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <Key className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">Password & Security</CardTitle>
                    <CardDescription>Update your password to keep your account secure</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmitPassword} className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-1">
                    <div>
                      <Label htmlFor="current_password" className="text-sm font-medium">Current Password</Label>
                      <Input 
                        type="password" 
                        id="current_password" 
                        placeholder="Enter current password"
                        value={passwordData.current_password} 
                        onChange={(e) => setPasswordData({ ...passwordData, current_password: e.target.value })}
                        className="mt-1.5"
                      />
                    </div>
                    <div>
                      <Label htmlFor="new_password" className="text-sm font-medium">New Password</Label>
                      <Input 
                        type="password" 
                        id="new_password" 
                        placeholder="Enter new password"
                        value={passwordData.new_password} 
                        onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })}
                        className="mt-1.5"
                      />
                    </div>
                    <div>
                      <Label htmlFor="new_password_confirmation" className="text-sm font-medium">Confirm New Password</Label>
                      <Input 
                        type="password" 
                        id="new_password_confirmation" 
                        placeholder="Confirm new password"
                        value={passwordData.new_password_confirmation} 
                        onChange={(e) => setPasswordData({ ...passwordData, new_password_confirmation: e.target.value })}
                        className="mt-1.5"
                      />
                    </div>
                  </div>
                  <div className="pt-2">
                    <Button type="submit" disabled={loading} className="gap-2">
                      {loading ? (
                        <>
                          <RefreshCw className="h-4 w-4 animate-spin" />
                          Updating...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4" />
                          Update Password
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          {/* Notifications Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="bg-card border-border shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-500/10 p-2 rounded-lg">
                    <Bell className="h-5 w-5 text-blue-500" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">Notification Preferences</CardTitle>
                    <CardDescription>Choose how you want to receive notifications</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 rounded-lg border border-border/50 hover:bg-muted/50 transition-colors">
                      <div className="space-y-0.5">
                        <Label htmlFor="notification_email_enabled" className="font-medium cursor-pointer">Email Notifications</Label>
                        <p className="text-sm text-muted-foreground">Receive updates about bookings and activities</p>
                      </div>
                      <Switch
                        id="notification_email_enabled"
                        checked={notificationEmailEnabled}
                        onCheckedChange={(checked) => setNotificationEmailEnabled(checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg border border-border/50 hover:bg-muted/50 transition-colors">
                      <div className="space-y-0.5">
                        <Label htmlFor="notification_sms_enabled" className="font-medium cursor-pointer">SMS Notifications</Label>
                        <p className="text-sm text-muted-foreground">Get urgent updates via text message</p>
                      </div>
                      <Switch
                        id="notification_sms_enabled"
                        checked={notificationSmsEnabled}
                        onCheckedChange={(checked) => setNotificationSmsEnabled(checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg border border-border/50 hover:bg-muted/50 transition-colors">
                      <div className="space-y-0.5">
                        <Label htmlFor="notification_promo_email" className="font-medium cursor-pointer">Promotional Emails</Label>
                        <p className="text-sm text-muted-foreground">Receive marketing and promotional content</p>
                      </div>
                      <Switch
                        id="notification_promo_email"
                        checked={notificationPromoEmail}
                        onCheckedChange={(checked) => setNotificationPromoEmail(checked)}
                      />
                    </div>
                  </div>
                  <div className="pt-2">
                    <Button onClick={handleSaveNotificationSettings} disabled={loading} className="gap-2">
                      {loading ? (
                        <>
                          <RefreshCw className="h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4" />
                          Save Notifications
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Privacy Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="bg-card border-border shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-green-500/10 p-2 rounded-lg">
                    <Shield className="h-5 w-5 text-green-500" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">Privacy Settings</CardTitle>
                    <CardDescription>Control what information is visible to others</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-3 rounded-lg border border-border/50 hover:bg-muted/50 transition-colors">
                    <div className="space-y-0.5">
                      <Label htmlFor="privacy_show_phone" className="font-medium cursor-pointer">Show Phone on Public Profile</Label>
                      <p className="text-sm text-muted-foreground">Allow customers to see your phone number</p>
                    </div>
                    <Switch
                      id="privacy_show_phone"
                      checked={privacyShowPhone}
                      onCheckedChange={(checked) => setPrivacyShowPhone(checked)}
                    />
                  </div>
                  <div className="pt-2">
                    <Button onClick={handleSavePrivacySettings} disabled={loading} className="gap-2">
                      {loading ? (
                        <>
                          <RefreshCw className="h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4" />
                          Save Privacy
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Business Settings - Only for Sellers */}
          {isSeller && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Card className="bg-card border-border shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="pb-4">
                  <div className="flex items-center space-x-3">
                    <div className="bg-purple-500/10 p-2 rounded-lg">
                      <Briefcase className="h-5 w-5 text-purple-500" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">Business Preferences</CardTitle>
                      <CardDescription>Configure your business operations and policies</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-3 rounded-lg border border-border/50 hover:bg-muted/50 transition-colors">
                      <div className="space-y-0.5">
                        <Label htmlFor="seller_booking_auto_confirm" className="font-medium cursor-pointer">Auto-Confirm New Bookings</Label>
                        <p className="text-sm text-muted-foreground">Automatically confirm bookings without manual approval</p>
                      </div>
                      <Switch
                        id="seller_booking_auto_confirm"
                        checked={sellerBookingAutoConfirm}
                        onCheckedChange={(checked) => setSellerBookingAutoConfirm(checked)}
                      />
                    </div>
                    
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <Label htmlFor="seller_booking_lead_time_hours" className="text-sm font-medium">Minimum Booking Lead Time (hours)</Label>
                        <Input
                          type="number"
                          id="seller_booking_lead_time_hours"
                          value={sellerBookingLeadTimeHours}
                          onChange={(e) => setSellerBookingLeadTimeHours(parseInt(e.target.value, 10))}
                          className="mt-1.5"
                          min="0"
                        />
                      </div>
                      <div>
                        <Label htmlFor="seller_default_service_duration" className="text-sm font-medium">Default Service Duration (minutes)</Label>
                        <Input
                          type="number"
                          id="seller_default_service_duration"
                          value={sellerDefaultServiceDuration}
                          onChange={(e) => setSellerDefaultServiceDuration(parseInt(e.target.value, 10))}
                          className="mt-1.5"
                          min="15"
                          step="15"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="seller_profile_visibility" className="text-sm font-medium">Public Profile Visibility</Label>
                      <Select value={sellerProfileVisibility} onValueChange={(value) => setSellerProfileVisibility(value)}>
                        <SelectTrigger className="w-full mt-1.5">
                          <SelectValue placeholder="Select visibility" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="public">Public - Anyone can find me</SelectItem>
                          <SelectItem value="private">Private - Only bookings can find me</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="seller_cancellation_policy" className="text-sm font-medium">Cancellation Policy</Label>
                      <Textarea
                        id="seller_cancellation_policy"
                        value={sellerCancellationPolicy}
                        onChange={(e) => setSellerCancellationPolicy(e.target.value)}
                        placeholder="Describe your cancellation policy..."
                        className="mt-1.5 min-h-[100px]"
                      />
                    </div>

                    <div className="pt-2">
                      <Button onClick={handleSaveBusinessSettings} disabled={loading} className="gap-2">
                        {loading ? (
                          <>
                            <RefreshCw className="h-4 w-4 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="h-4 w-4" />
                            Save Business Settings
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Danger Zone */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Card className="bg-card border-destructive/20 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-destructive/10 p-2 rounded-lg">
                    <Trash2 className="h-5 w-5 text-destructive" />
                  </div>
                  <div>
                    <CardTitle className="text-xl text-destructive">Danger Zone</CardTitle>
                    <CardDescription>Irreversible actions for your account</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border border-destructive/20 rounded-lg bg-destructive/5">
                    <h4 className="font-medium text-destructive mb-2">Delete Account</h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      Once you delete your account, there is no going back. Please be certain.
                    </p>
                    <Button 
                      variant="destructive" 
                      onClick={() => setIsDeleteConfirmationOpen(true)}
                      className="gap-2"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete My Account
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Delete Account Dialog */}
        <AlertDialog open={isDeleteConfirmationOpen} onOpenChange={setIsDeleteConfirmationOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="text-destructive">Delete Account?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your account and remove your data from our servers.
                Please enter your password to confirm.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="grid gap-2">
              <Label htmlFor="delete_account_password" className="text-sm font-medium">Password</Label>
              <Input
                type="password"
                id="delete_account_password"
                placeholder="Enter your password"
                value={deleteAccountPassword}
                onChange={(e) => setDeleteAccountPassword(e.target.value)}
              />
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleDeleteAccount} 
                disabled={loading || !deleteAccountPassword}
                className="bg-destructive hover:bg-destructive/90"
              >
                {loading ? 'Deleting...' : 'Delete Account'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default Settings;
