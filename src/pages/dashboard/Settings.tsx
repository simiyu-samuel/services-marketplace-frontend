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
import { AxiosError } from 'axios';
import { useAuth } from '@/contexts/AuthContext';

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
    return <div>Loading...</div>;
  }

  if (!settings) {
    return <div>Could not load settings.</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Seller Settings</CardTitle>
          <CardDescription>Manage your account settings and preferences.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          {/* Change Password Section */}
          <div>
            <h2 className="text-lg font-semibold mb-2">Change Password</h2>
            <form onSubmit={handleSubmitPassword} className="grid gap-4">
              <div>
                <Label htmlFor="current_password">Current Password</Label>
                <Input type="password" id="current_password" value={passwordData.current_password} onChange={(e) => setPasswordData({ ...passwordData, current_password: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="new_password">New Password</Label>
                <Input type="password" id="new_password" value={passwordData.new_password} onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="new_password_confirmation">Confirm New Password</Label>
                <Input type="password" id="new_password_confirmation" value={passwordData.new_password_confirmation} onChange={(e) => setPasswordData({ ...passwordData, new_password_confirmation: e.target.value })} />
              </div>
              <Button type="submit" disabled={loading}>
                {loading ? 'Updating...' : 'Update Password'}
              </Button>
            </form>
          </div>

          {/* Notification Settings Section */}
          <div>
            <h2 className="text-lg font-semibold mb-2">Notification Settings</h2>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="notification_email_enabled">Email Notifications</Label>
                <Switch
                  id="notification_email_enabled"
                  checked={notificationEmailEnabled}
                  onCheckedChange={(checked) => setNotificationEmailEnabled(checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="notification_sms_enabled">SMS Notifications</Label>
                <Switch
                  id="notification_sms_enabled"
                  checked={notificationSmsEnabled}
                  onCheckedChange={(checked) => setNotificationSmsEnabled(checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="notification_promo_email">Promotional Emails</Label>
                <Switch
                  id="notification_promo_email"
                  checked={notificationPromoEmail}
                  onCheckedChange={(checked) => setNotificationPromoEmail(checked)}
                />
              </div>
              <Button onClick={handleSaveNotificationSettings} disabled={loading}>
                Save Notification Settings
              </Button>
            </div>
          </div>

          {/* Privacy Settings Section */}
          <div>
            <h2 className="text-lg font-semibold mb-2">Privacy Settings</h2>
            <div className="flex items-center justify-between">
              <Label htmlFor="privacy_show_phone">Show Phone on Public Profile</Label>
              <Switch
                id="privacy_show_phone"
                checked={privacyShowPhone}
                onCheckedChange={(checked) => setPrivacyShowPhone(checked)}
              />
            </div>
            <Button onClick={handleSavePrivacySettings} disabled={loading}>
              Save Privacy Settings
            </Button>
          </div>

          {/* Business Preferences Section */}
          {isSeller && (
            <div>
              <h2 className="text-lg font-semibold mb-2">Business Preferences</h2>
              <div className="grid gap-4">
                <div>
                  <Label htmlFor="seller_booking_auto_confirm">Auto-Confirm New Bookings</Label>
                  <Switch
                    id="seller_booking_auto_confirm"
                    checked={sellerBookingAutoConfirm}
                    onCheckedChange={(checked) => setSellerBookingAutoConfirm(checked)}
                  />
                </div>
                <div>
                  <Label htmlFor="seller_booking_lead_time_hours">Minimum Booking Lead Time (hours)</Label>
                  <Input
                    type="number"
                    id="seller_booking_lead_time_hours"
                    value={sellerBookingLeadTimeHours}
                    onChange={(e) => setSellerBookingLeadTimeHours(parseInt(e.target.value, 10))}
                  />
                </div>
                <div>
                  <Label htmlFor="seller_cancellation_policy">Cancellation Policy Text</Label>
                  <Textarea
                    id="seller_cancellation_policy"
                    value={sellerCancellationPolicy}
                    onChange={(e) => setSellerCancellationPolicy(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="seller_profile_visibility">Public Profile Visibility</Label>
                  <Select onValueChange={(value) => setSellerProfileVisibility(value)}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select visibility" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Public</SelectItem>
                      <SelectItem value="private">Private</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="seller_default_service_duration">Default Service Duration (minutes)</Label>
                  <Input
                    type="number"
                    id="seller_default_service_duration"
                    value={sellerDefaultServiceDuration}
                    onChange={(e) => setSellerDefaultServiceDuration(parseInt(e.target.value, 10))}
                  />
                </div>
                <Button onClick={handleSaveBusinessSettings} disabled={loading}>
                  Save Business Settings
                </Button>
              </div>
            </div>
          )}

          {/* Danger Zone Section */}
          <div>
            <h2 className="text-lg font-semibold mb-2">Danger Zone</h2>
            <Button variant="destructive" onClick={() => setIsDeleteConfirmationOpen(true)}>
              Delete My Account
            </Button>
            <AlertDialog open={isDeleteConfirmationOpen} onOpenChange={setIsDeleteConfirmationOpen}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. Please enter your password to confirm you want to delete your account.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="grid gap-2">
                  <Label htmlFor="delete_account_password">Password</Label>
                  <Input
                    type="password"
                    id="delete_account_password"
                    value={deleteAccountPassword}
                    onChange={(e) => setDeleteAccountPassword(e.target.value)}
                  />
                </div>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteAccount} disabled={loading}>
                    Delete Account
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
