import React, { useState, useEffect } from 'react';
import {
  User, Mail, Lock, CreditCard, Calendar, Shield,
  Eye, EyeOff, Check, AlertCircle, Save, X, Edit2,
  MapPin, Building, Globe, DollarSign, Clock, CheckCircle,
  XCircle, RefreshCcw, Download, FileText, ExternalLink, Palette, Sparkles,
  Link, Layers
} from 'lucide-react';
import axios from 'axios';

const SettingsComp = ({ addLog }) => {
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // User data
  const [userData, setUserData] = useState(null);
  const [subscriptionData, setSubscriptionData] = useState(null);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [loadingPayments, setLoadingPayments] = useState(false);
  const [downloadingInvoices, setDownloadingInvoices] = useState(false);

  // Plan name to price mapping
  const PLAN_PRICES = {
    'free trial': 0,
    'free': 0,
    'starter': 29,
    'growth': 149,
    'enterprise': 299
  };

  // Profile edit state
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: ''
  });

  // Password change state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  // Fetch user data on component mount
  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      setError('');

      // Get user ID from localStorage
      const storedUser = localStorage.getItem('user');
      if (!storedUser) {
        setError('No user found. Please log in again.');
        return;
      }

      const user = JSON.parse(storedUser);
      const userId = user.id;

      // Fetch user data from API
      const response = await axios.get(
        `https://calm-possibility-production.up.railway.app/api/auth/user-by-id/${userId}`
      );

      // Access the user object from the response
      const userData = response.data.user || response.data;

      setUserData(userData);
      setProfileData({
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        email: userData.email || ''
      });

      // Fetch subscription data if user has subscription
      if (userData.subscriptionId) {
        await fetchSubscriptionData(userData.subscriptionId);
      }

      if (addLog) addLog('✅ User data loaded successfully', 'success');
    } catch (err) {
      console.error('Error fetching user data:', err);
      setError('Failed to load user data. Please try again.');
      if (addLog) addLog('❌ Failed to load user data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchSubscriptionData = async (subscriptionId) => {
    try {
      const response = await axios.get(
        `https://calm-possibility-production.up.railway.app/api/subscriptions/${subscriptionId}`
      );    
      setSubscriptionData(response.data.data);
    

    //   console.log(subscriptionData)
      // Fetch payment history
      await fetchPaymentHistory(subscriptionId);
    } catch (err) {
      console.error('Error fetching subscription data:', err);
    }
  };

  const fetchPaymentHistory = async (subscriptionId) => {
    try {
      setLoadingPayments(true);
      const response = await axios.get(
        `https://calm-possibility-production.up.railway.app/api/subscriptions/${subscriptionId}/invoices`
      );
      setPaymentHistory(response.data);
    } catch (err) {
      console.error('Error fetching payment history:', err);
    } finally {
      setLoadingPayments(false);
    }
  };

  const downloadAllInvoices = async () => {
    try {
      setDownloadingInvoices(true);
      
      if (!paymentHistory || paymentHistory.length === 0) {
        setError('No invoices available to download');
        return;
      }

      // Download each invoice
      for (const invoice of paymentHistory) {
        if (invoice.invoice_pdf) {
          // Create a temporary link and trigger download
          const link = document.createElement('a');
          link.href = invoice.invoice_pdf;
          link.download = `invoice-${invoice.number || invoice.id}.pdf`;
          link.target = '_blank';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          
          // Add a small delay between downloads to avoid browser blocking
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      }

      setSuccess(`Successfully downloaded ${paymentHistory.length} invoice(s)`);
      if (addLog) addLog(`✅ Downloaded ${paymentHistory.length} invoices`, 'success');
    } catch (err) {
      console.error('Error downloading invoices:', err);
      setError('Failed to download invoices. Please try again.');
      if (addLog) addLog('❌ Failed to download invoices', 'error');
    } finally {
      setDownloadingInvoices(false);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      setSaving(true);
      setError('');
      setSuccess('');

      const userId = JSON.parse(localStorage.getItem('user')).id;
      
      const response = await axios.put(
        `https://calm-possibility-production.up.railway.app/api/auth/update-profile/${userId}`,
        profileData
      );
      
      setUserData(response.data);
      setIsEditingProfile(false);
      setSuccess('Profile updated successfully!');
      if (addLog) addLog('✅ Profile updated successfully', 'success');
      
      // Update localStorage
      const storedUser = JSON.parse(localStorage.getItem('user'));
      localStorage.setItem('user', JSON.stringify({ ...storedUser, ...profileData }));
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err.response?.data?.message || 'Failed to update profile');
      if (addLog) addLog('❌ Failed to update profile', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    try {
      // Validation
      if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
        setError('Please fill in all password fields');
        return;
      }

      if (passwordData.newPassword !== passwordData.confirmPassword) {
        setError('New passwords do not match');
        return;
      }
      
      if (passwordData.newPassword.length < 6) {
        setError('New password must be at least 6 characters long');
        return;
      }
      
      setSaving(true);
      setError('');
      setSuccess('');
      
      const userId = JSON.parse(localStorage.getItem('user')).id;
      
      await axios.put(
        `https://calm-possibility-production.up.railway.app/api/auth/change-password/${userId}`,
        {
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        }
      );
      
      setSuccess('Password changed successfully!');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      if (addLog) addLog('✅ Password changed successfully', 'success');
    } catch (err) {
      console.error('Error changing password:', err);
      setError(err.response?.data?.message || 'Failed to change password');
      if (addLog) addLog('❌ Failed to change password', 'error');
    } finally {
      setSaving(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'text-green-400 bg-green-500/20';
      case 'canceled':
        return 'text-red-400 bg-red-500/20';
      case 'past_due':
        return 'text-yellow-400 bg-yellow-500/20';
      case 'trialing':
        return 'text-blue-400 bg-blue-500/20';
      default:
        return 'text-gray-400 bg-gray-500/20';
    }
  };

  // Helper function to get plan price from plan name
  const getPlanPrice = (planName) => {
    if (!planName) return 0;
    
    // Convert plan name to lowercase for case-insensitive matching
    const normalizedPlanName = planName.toLowerCase().trim();
    
    // Return the price from the mapping, default to 0 if not found
    return PLAN_PRICES[normalizedPlanName] ?? 0;
  };

  // Helper function to check if value should show as unlimited
  const isUnlimitedUrlTries = (value) => {
    return value > 100 || value === Number.MAX_SAFE_INTEGER;
  };

  const isUnlimitedBackground = (value) => {
    return value > 50 || value === Number.MAX_SAFE_INTEGER;
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'billing', label: 'Billing', icon: CreditCard },
    { id: 'usage', label: 'Usage', icon: RefreshCcw }
  ];

  if (loading) {
    return (
      <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
        <h2 className="text-2xl font-bold text-white mb-2">Settings</h2>
        <p className="text-gray-400">Manage your account settings and preferences</p>
      </div>

      {/* Error/Success Messages */}
      {error && (
        <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 flex items-start">
          <AlertCircle className="w-5 h-5 text-red-300 mr-2 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-red-300 font-medium">Error</p>
            <p className="text-red-200 text-sm mt-1">{error}</p>
          </div>
          <button onClick={() => setError('')} className="ml-auto">
            <X className="w-4 h-4 text-red-300" />
          </button>
        </div>
      )}

      {success && (
        <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-4 flex items-start">
          <CheckCircle className="w-5 h-5 text-green-300 mr-2 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-green-300 font-medium">Success</p>
            <p className="text-green-200 text-sm mt-1">{success}</p>
          </div>
          <button onClick={() => setSuccess('')} className="ml-auto">
            <X className="w-4 h-4 text-green-300" />
          </button>
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl overflow-hidden">
        <div className="flex border-b border-white/20 overflow-x-auto">
          {tabs.map((tab) => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                    : 'text-gray-300 hover:bg-white/5'
                }`}
              >
                <IconComponent className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="p-6">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-white">Profile Information</h3>
                {!isEditingProfile ? (
                  <button
                    onClick={() => setIsEditingProfile(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit Profile
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setIsEditingProfile(false);
                        setProfileData({
                          firstName: userData.firstName || '',
                          lastName: userData.lastName || '',
                          email: userData.email || ''
                        });
                      }}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                    >
                      <X className="w-4 h-4" />
                      Cancel
                    </button>
                    <button
                      onClick={handleUpdateProfile}
                      disabled={saving}
                      className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Save className="w-4 h-4" />
                      {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* First Name */}
                <div className="bg-gray-900/50 p-4 rounded-lg">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                    <User className="w-4 h-4" />
                    First Name
                  </label>
                  {isEditingProfile ? (
                    <input
                      type="text"
                      value={profileData.firstName}
                      onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                      className="w-full bg-black/30 border border-white/20 rounded-lg p-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Enter first name"
                    />
                  ) : (
                    <p className="text-white text-lg">{userData?.firstName || 'Not set'}</p>
                  )}
                </div>

                {/* Last Name */}
                <div className="bg-gray-900/50 p-4 rounded-lg">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                    <User className="w-4 h-4" />
                    Last Name
                  </label>
                  {isEditingProfile ? (
                    <input
                      type="text"
                      value={profileData.lastName}
                      onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                      className="w-full bg-black/30 border border-white/20 rounded-lg p-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Enter last name"
                    />
                  ) : (
                    <p className="text-white text-lg">{userData?.lastName || 'Not set'}</p>
                  )}
                </div>

                {/* Email */}
                <div className="bg-gray-900/50 p-4 rounded-lg md:col-span-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                    <Mail className="w-4 h-4" />
                    Email Address
                  </label>
                  <p className="text-white text-lg">{userData?.email}</p>
                  <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
                </div>

                {/* Account Created */}
                <div className="bg-gray-900/50 p-4 rounded-lg">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                    <Calendar className="w-4 h-4" />
                    Account Created
                  </label>
                  <p className="text-white text-lg">
                    {userData?.createdAt ? new Date(userData.createdAt).toLocaleDateString() : 'N/A'}
                  </p>
                </div>

                {/* Google Account */}
                {userData?.googleId && (
                  <div className="bg-gray-900/50 p-4 rounded-lg">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                      <Globe className="w-4 h-4" />
                      Account Type
                    </label>
                    <p className="text-white text-lg">Google Account</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-white">Change Password</h3>

              {userData?.googleId ? (
                <div className="bg-blue-500/20 border border-blue-500/50 rounded-lg p-4">
                  <p className="text-blue-300">
                    You're signed in with Google. Password management is handled through your Google account.
                  </p>
                </div>
              ) : (
                <div className="space-y-4 max-w-md">
                  {/* Current Password */}
                  <div className="bg-gray-900/50 p-4 rounded-lg">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                      <Lock className="w-4 h-4" />
                      Current Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswords.current ? 'text' : 'password'}
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                        className="w-full bg-black/30 border border-white/20 rounded-lg p-3 pr-10 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Enter current password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                      >
                        {showPasswords.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* New Password */}
                  <div className="bg-gray-900/50 p-4 rounded-lg">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                      <Lock className="w-4 h-4" />
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswords.new ? 'text' : 'password'}
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                        className="w-full bg-black/30 border border-white/20 rounded-lg p-3 pr-10 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Enter new password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                      >
                        {showPasswords.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">Must be at least 6 characters long</p>
                  </div>

                  {/* Confirm Password */}
                  <div className="bg-gray-900/50 p-4 rounded-lg">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                      <Lock className="w-4 h-4" />
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswords.confirm ? 'text' : 'password'}
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                        className="w-full bg-black/30 border border-white/20 rounded-lg p-3 pr-10 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Confirm new password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                      >
                        {showPasswords.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={handleChangePassword}
                    disabled={saving}
                    className="w-full py-3 px-6 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {saving ? 'Changing Password...' : 'Change Password'}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Billing Tab */}
          {activeTab === 'billing' && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-white mb-4">Subscription & Billing</h3>

              {subscriptionData ? (
                <div className="space-y-6">
                  {/* Current Plan */}
                  <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="text-2xl font-bold text-white">
                          {subscriptionData?.planName || 'Subscription'} Plan
                        </h4>
                        <p className="text-gray-300 mt-1">
                          ${getPlanPrice(subscriptionData?.planName)}/month
                        </p>
                      </div>
                      {subscriptionData?.status && (
                        <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(subscriptionData.status)}`}>
                          {subscriptionData.status.charAt(0).toUpperCase() + subscriptionData.status.slice(1)}
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      {subscriptionData?.createdAt && (
                        <div className="flex items-center gap-2 text-gray-300">
                          <Calendar className="w-4 h-4" />
                          <span className="text-sm">
                            Started: {new Date(subscriptionData.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                      {subscriptionData?.stripeSubscriptionId && (
                        <div className="flex items-center gap-2 text-gray-300">
                          <CreditCard className="w-4 h-4" />
                          <span className="text-sm font-mono text-xs">
                            {subscriptionData.stripeSubscriptionId}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Billing Address */}
                  {subscriptionData?.billingAddress && (
                    <div className="bg-gray-900/50 p-6 rounded-lg">
                      <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <MapPin className="w-5 h-5" />
                        Billing Address
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-300">
                        {subscriptionData.billingAddress.street && (
                          <div>
                            <p className="text-sm text-gray-400">Street</p>
                            <p className="text-white">{subscriptionData.billingAddress.street}</p>
                          </div>
                        )}
                        {subscriptionData.billingAddress.city && (
                          <div>
                            <p className="text-sm text-gray-400">City</p>
                            <p className="text-white">{subscriptionData.billingAddress.city}</p>
                          </div>
                        )}
                        {subscriptionData.billingAddress.zipCode && (
                          <div>
                            <p className="text-sm text-gray-400">ZIP Code</p>
                            <p className="text-white">{subscriptionData.billingAddress.zipCode}</p>
                          </div>
                        )}
                        {subscriptionData.billingAddress.country && (
                          <div>
                            <p className="text-sm text-gray-400">Country</p>
                            <p className="text-white">{subscriptionData.billingAddress.country}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Payment History */}
                  <div className="bg-gray-900/50 p-6 rounded-lg">
                    <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      Payment History
                    </h4>
                    
                    {loadingPayments ? (
                      <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto"></div>
                      </div>
                    ) : paymentHistory.length > 0 ? (
                      <div className="space-y-3">
                        {paymentHistory.map((invoice) => (
                          <div key={invoice.id} className="flex items-center justify-between p-4 bg-black/30 rounded-lg hover:bg-black/40 transition-colors">
                            <div>
                              <p className="text-white font-medium">
                                ${(invoice.amount_paid / 100).toFixed(2)}
                              </p>
                              <p className="text-sm text-gray-400">
                                {new Date(invoice.created * 1000).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric'
                                })}
                              </p>
                              {invoice.number && (
                                <p className="text-xs text-gray-500 mt-1">
                                  Invoice #{invoice.number}
                                </p>
                              )}
                            </div>
                            <div className="flex items-center gap-3">
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                invoice.status === 'paid' 
                                  ? 'bg-green-500/20 text-green-400' 
                                  : invoice.status === 'open'
                                  ? 'bg-blue-500/20 text-blue-400'
                                  : 'bg-gray-500/20 text-gray-400'
                              }`}>
                                {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                              </span>
                              {invoice.invoice_pdf && (
                                <a
                                  href={invoice.invoice_pdf}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-purple-400 hover:text-purple-300 transition-colors"
                                  title="Download Invoice"
                                >
                                  <Download className="w-4 h-4" />
                                </a>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-gray-400 text-center py-8">
                        <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p>No payment history yet</p>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-4">
                    <button className="flex items-center gap-2 px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors">
                      <CreditCard className="w-4 h-4" />
                      Update Payment Method
                    </button>
                    <button 
                      onClick={downloadAllInvoices}
                      disabled={downloadingInvoices || !paymentHistory || paymentHistory.length === 0}
                      className="flex items-center gap-2 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Download className="w-4 h-4" />
                      {downloadingInvoices ? 'Downloading...' : `Download All Invoices (${paymentHistory?.length || 0})`}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-900/50 p-8 rounded-lg text-center">
                  <CreditCard className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <h4 className="text-xl font-semibold text-white mb-2">No Active Subscription</h4>
                  <p className="text-gray-400 mb-6">
                    You're currently on the Free plan. Upgrade to unlock more features!
                  </p>
                  <Link to="/payment">
                    <button className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-lg transition-colors">
                      View Plans
                    </button>
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* Usage Tab */}
          {activeTab === 'usage' && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-white mb-4">Usage & Limits</h3>

              {/* Current Plan Info */}
              <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xl font-bold text-white">
                      {subscriptionData?.planName || userData?.planName || 'Free Trial'} Plan
                    </h4>
                    <p className="text-gray-300 mt-1">
                      ${getPlanPrice(subscriptionData?.planName || userData?.planName || 'Free Trial')}/month
                    </p>
                  </div>
                  {subscriptionData?.status && (
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(subscriptionData.status)}`}>
                      {subscriptionData.status.charAt(0).toUpperCase() + subscriptionData.status.slice(1)}
                    </div>
                  )}
                </div>
              </div>

              {/* Usage Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* URL Scraping - Available for Starter, Growth, Enterprise */}
                <div className="bg-gray-900/50 p-6 rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Globe className="w-5 h-5 text-blue-400" />
                      <h4 className="text-lg font-semibold text-white">URL Scraping</h4>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Remaining</span>
                      <span className="text-white font-medium">
                        {userData?.monthlyUrlLimit === 0 
                          ? 'Not Available'
                          : isUnlimitedUrlTries(userData?.monthlyUrlLimit) 
                          ? 'Unlimited' 
                          : `${userData?.urlTries || 0} / ${userData?.monthlyUrlLimit || 0}`
                        }
                      </span>
                    </div>
                    {userData?.monthlyUrlLimit > 0 && !isUnlimitedUrlTries(userData?.monthlyUrlLimit) && (
                      <div className="w-full bg-gray-800 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full transition-all duration-300"
                          style={{
                            width: `${((userData?.urlTries || 0) / (userData?.monthlyUrlLimit || 1)) * 100}%`
                          }}
                        ></div>
                      </div>
                    )}
                    <p className="text-xs text-gray-400 mt-2">
                      {userData?.monthlyUrlLimit === 0
                        ? 'Upgrade to Starter or higher to scrape product URLs'
                        : isUnlimitedUrlTries(userData?.monthlyUrlLimit)
                        ? 'Unlimited URL scraping for your plan'
                        : 'Resets monthly on your billing date'}
                    </p>
                  </div>
                </div>

                {/* Background Removal - Available for All Plans (50 for free, unlimited for paid) */}
                <div className="bg-gray-900/50 p-6 rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Layers className="w-5 h-5 text-purple-400" />
                      <h4 className="text-lg font-semibold text-white">Background Removal</h4>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Remaining</span>
                      <span className="text-white font-medium">
                        {isUnlimitedBackground(userData?.backgroundLimit)
                          ? 'Unlimited' 
                          : `${userData?.backgroundLimit || 0}`
                        }
                      </span>
                    </div>
                    {!isUnlimitedBackground(userData?.backgroundLimit) && (
                      <div className="w-full bg-gray-800 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                          style={{ 
                            width: `${((userData?.backgroundLimit || 0) / 50) * 100}%` 
                          }}
                        ></div>
                      </div>
                    )}
                    <p className="text-xs text-gray-400 mt-2">
                      {isUnlimitedBackground(userData?.backgroundLimit)
                        ? 'Unlimited background removals for your plan'
                        : 'Upgrade to Starter or higher for unlimited background removals'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Plan Features */}
              <div className="bg-gray-900/50 p-6 rounded-lg">
                <h4 className="text-lg font-semibold text-white mb-4">Plan Features</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {/* Image Gallery - All plans */}
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-white font-medium">Image Gallery</p>
                      <p className="text-sm text-gray-400">View and manage your scraped images</p>
                    </div>
                  </div>

                  {/* Background Removal - All plans */}
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-white font-medium">Background Removal</p>
                      <p className="text-sm text-gray-400">
                        {isUnlimitedBackground(userData?.backgroundLimit) 
                          ? 'Unlimited background removals'
                          : '50 background removals'}
                      </p>
                    </div>
                  </div>

                  {/* Image Optimization - Starter, Growth, Enterprise */}
                  <div className="flex items-start gap-3">
                    {['Starter', 'Growth', 'Enterprise'].includes(subscriptionData?.planName || userData?.planName || 'Free') ? (
                      <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                    )}
                    <div>
                      <p className="text-white font-medium">Image Optimization</p>
                      <p className="text-sm text-gray-400">
                        {['Starter', 'Growth', 'Enterprise'].includes(subscriptionData?.planName || userData?.planName || 'Free')
                          ? 'Upscale and enhance image quality'
                          : 'Available in Starter plan and above'}
                      </p>
                    </div>
                  </div>

                  {/* Web Scraping - Starter, Growth, Enterprise */}
                  <div className="flex items-start gap-3">
                    {userData?.monthlyUrlLimit > 0 ? (
                      <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                    )}
                    <div>
                      <p className="text-white font-medium">Web Scraping</p>
                      <p className="text-sm text-gray-400">
                        {isUnlimitedUrlTries(userData?.monthlyUrlLimit)
                          ? 'Unlimited URLs per month'
                          : userData?.monthlyUrlLimit > 0 
                          ? `${userData.monthlyUrlLimit} URLs per month` 
                          : 'Available in Starter plan and above'}
                      </p>
                    </div>
                  </div>

                  {/* Background Generation - Growth, Enterprise */}
                  <div className="flex items-start gap-3">
                    {['Growth', 'Enterprise'].includes(subscriptionData?.planName || userData?.planName || 'Free') ? (
                      <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                    )}
                    <div>
                      <p className="text-white font-medium">AI Background Generation</p>
                      <p className="text-sm text-gray-400">
                        {['Growth', 'Enterprise'].includes(subscriptionData?.planName || userData?.planName || 'Free')
                          ? 'Unlimited AI-generated backgrounds'
                          : 'Available in Growth plan and above'}
                      </p>
                    </div>
                  </div>

                  {/* Scene Suggestions - Enterprise only */}
                  <div className="flex items-start gap-3">
                    {(subscriptionData?.planName || userData?.planName || 'Free') === 'Enterprise' ? (
                      <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                    )}
                    <div>
                      <p className="text-white font-medium">AI Scene Suggestions</p>
                      <p className="text-sm text-gray-400">
                        {(subscriptionData?.planName || userData?.planName || 'Free') === 'Enterprise'
                          ? 'AI-powered background prompt suggestions'
                          : 'Available in Enterprise plan only'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Upgrade CTA for non-Enterprise users */}
              {(subscriptionData?.planName || userData?.planName || 'Free') !== 'Enterprise' && (
                <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-lg p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-purple-500/20 rounded-lg">
                      <Sparkles className="w-6 h-6 text-purple-400" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-white mb-2">Unlock More Features</h4>
                      <p className="text-gray-300 text-sm mb-4">
                        {(subscriptionData?.planName || userData?.planName || 'Free') === 'Free' || (subscriptionData?.planName || userData?.planName || 'Free') === 'Free Trial'
                          ? 'Upgrade to access unlimited background removal, URL scraping, image optimization, and AI-powered features.'
                          : (subscriptionData?.planName || userData?.planName || 'Free') === 'Starter'
                          ? 'Upgrade to Growth for AI background generation and Enterprise for AI scene suggestions.'
                          : 'Upgrade to Enterprise for AI scene suggestions and unlimited everything.'}
                      </p>
                      <Link to="/payment">
                        <button className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-lg transition-colors text-sm font-medium">
                          View Plans & Pricing
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsComp;