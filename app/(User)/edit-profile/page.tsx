'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/authContext';
import { getUserProfile, updateUserProfile } from '@/lib/userService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Save, X, Loader2, ArrowLeft, Upload, CheckCircle, Hash, Camera } from 'lucide-react';
import PageLoader from '@/components/PageLoader';

export default function EditProfilePage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  const [tempFirstName, setTempFirstName] = useState('');
  const [tempLastName, setTempLastName] = useState('');
  const [tempEmail, setTempEmail] = useState('');
  const [tempUsername, setTempUsername] = useState('');
  const [tempBranch, setTempBranch] = useState('');
  const [tempSemester, setTempSemester] = useState('');
  const [tempRollNum, setTempRollNum] = useState('');
  const [tempAvatarUrl, setTempAvatarUrl] = useState('');
  
  const [tempGithub, setTempGithub] = useState('');
  const [tempLinkedin, setTempLinkedin] = useState('');
  const [tempInstagram, setTempInstagram] = useState('');
  const [tempReddit, setTempReddit] = useState('');
  const [tempDiscord, setTempDiscord] = useState('');

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      const fetchProfile = async () => {
        try {
          setIsLoading(true);
          const profile = await getUserProfile(user.uid);
          if (profile) {
            setTempFirstName(profile.firstName || '');
            setTempLastName(profile.lastName || '');
            setTempEmail(profile.email || '');
            setTempUsername(profile.username || '');
            setTempBranch(profile.branch || '');
            setTempSemester(profile.semester || '');
            setTempRollNum(profile.rollNum || '');
            setTempAvatarUrl(profile.avatarUrl || '');
            
            setTempGithub(profile.github || '');
            setTempLinkedin(profile.linkedin || '');
            setTempInstagram(profile.instagram || '');
            setTempReddit(profile.reddit || '');
            setTempDiscord(profile.discord || '');
          }
          setIsLoading(false);
        } catch (err) {
          console.error('Error fetching profile:', err);
          setError('Failed to load profile');
          setIsLoading(false);
        }
      };
      fetchProfile();
    }
  }, [user]);

  const getRoboHashUrl = (name: string) => {
    const hashString = name.replace(/\s+/g, '') || 'user';
    return `https://robohash.org/${hashString}?size=200x200&set=set1`;
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setTempAvatarUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setError('');
    setSuccessMessage('');

    if (!tempFirstName.trim() || !tempLastName.trim() || !tempEmail.trim()) {
      setError('Please fill in First Name, Last Name, and Email');
      return;
    }

    if (!isValidEmail(tempEmail)) {
      setError('Please enter a valid email address');
      return;
    }

    try {
      setIsSaving(true);
      if (user) {
        await updateUserProfile(user.uid, {
          firstName: tempFirstName,
          lastName: tempLastName,
          email: tempEmail,
          username: tempUsername,
          branch: tempBranch,
          semester: tempSemester,
          rollNum: tempRollNum,
          avatarUrl: tempAvatarUrl,
          github: tempGithub,
          linkedin: tempLinkedin,
          instagram: tempInstagram,
          reddit: tempReddit,
          discord: tempDiscord,
        });

        setSuccessMessage('✨ Profile updated successfully!');
        setTimeout(() => {
          router.push('/profile');
        }, 1500);
      }
      setIsSaving(false);
    } catch (err) {
      setIsSaving(false);
      console.error('Error updating profile:', err);
      setError('Failed to update profile. Please try again.');
    }
  };

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  if (authLoading || isLoading) {
    return <PageLoader />;
  }

  if (!user) {
    return null;
  }

  const roboHashUrl = getRoboHashUrl(`${tempFirstName} ${tempLastName}`);
  const displayAvatarUrl = tempAvatarUrl || roboHashUrl;

  const socialFields = [
    { id: 'github', label: 'GitHub', value: tempGithub, setter: setTempGithub, icon: 'https://img.icons8.com/color/96/github--v1.png' },
    { id: 'linkedin', label: 'LinkedIn', value: tempLinkedin, setter: setTempLinkedin, icon: 'https://img.icons8.com/color/96/linkedin.png' },
    { id: 'instagram', label: 'Instagram', value: tempInstagram, setter: setTempInstagram, icon: 'https://img.icons8.com/color/96/instagram-new--v1.png' },
    { id: 'reddit', label: 'Reddit', value: tempReddit, setter: setTempReddit, icon: 'https://img.icons8.com/color/96/reddit--v1.png' },
    { id: 'discord', label: 'Discord', value: tempDiscord, setter: setTempDiscord, icon: 'https://img.icons8.com/color/96/discord-logo.png' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/80 backdrop-blur-sm shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl sm:text-3xl font-bold text-black">Edit Profile</h1>
            <Link href="/profile">
              <Button variant="outline" className="border-gray-300 text-black hover:bg-gray-100 gap-2">
                <ArrowLeft className="h-4 w-4" />
                <span className="hidden sm:inline">Back</span>
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 sm:py-12 lg:px-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            {successMessage}
          </div>
        )}

        <div className="space-y-6">
          {/* Avatar Section */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h3 className="text-2xl font-bold text-black mb-8">Profile Picture</h3>
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8">
              <div className="relative group">
                <img
                  src={displayAvatarUrl}
                  alt="Avatar"
                  className="h-40 w-40 rounded-2xl object-cover border-4 border-black shadow-lg group-hover:shadow-xl transition-all"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-2 right-2 p-3 bg-black text-white rounded-full hover:bg-gray-800 transition-all shadow-lg"
                  disabled={isSaving}
                >
                  <Camera className="h-5 w-5" />
                </button>
              </div>
              <div className="flex-1">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isSaving}
                  className="w-full sm:w-auto px-8 py-3 bg-black hover:bg-gray-800 disabled:opacity-50 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Upload className="h-4 w-4" />
                  Change Photo
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  disabled={isSaving}
                  className="hidden"
                />
                <p className="text-sm text-gray-600 mt-4">JPG, PNG or GIF (Max 5MB)</p>
              </div>
            </div>
          </div>

          {/* Personal Info */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h3 className="text-2xl font-bold text-black mb-8">Personal Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <Label className="text-black font-bold mb-3 block">First Name *</Label>
                <Input
                  type="text"
                  placeholder="John"
                  value={tempFirstName}
                  onChange={(e) => setTempFirstName(e.target.value)}
                  disabled={isSaving}
                  className="border-2 border-gray-200 h-12 rounded-lg"
                />
              </div>
              <div>
                <Label className="text-black font-bold mb-3 block">Last Name *</Label>
                <Input
                  type="text"
                  placeholder="Doe"
                  value={tempLastName}
                  onChange={(e) => setTempLastName(e.target.value)}
                  disabled={isSaving}
                  className="border-2 border-gray-200 h-12 rounded-lg"
                />
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h3 className="text-2xl font-bold text-black mb-8">Contact Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <Label className="text-black font-bold mb-3 block">Email *</Label>
                <Input
                  type="email"
                  placeholder="you@example.com"
                  value={tempEmail}
                  onChange={(e) => setTempEmail(e.target.value)}
                  disabled={isSaving}
                  className="border-2 border-gray-200 h-12 rounded-lg"
                />
              </div>
              <div>
                <Label className="text-black font-bold mb-3 block">Username</Label>
                <div className="relative">
                  <span className="absolute left-4 top-4 text-gray-500 font-bold">@</span>
                  <Input
                    type="text"
                    placeholder="username"
                    value={tempUsername}
                    onChange={(e) => setTempUsername(e.target.value)}
                    disabled={isSaving}
                    className="pl-10 border-2 border-gray-200 h-12 rounded-lg"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* College Info */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h3 className="text-2xl font-bold text-black mb-8">College Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div>
                <Label className="text-black font-bold mb-3 block">Branch</Label>
                <Input
                  type="text"
                  placeholder="CSE, ECE"
                  value={tempBranch}
                  onChange={(e) => setTempBranch(e.target.value)}
                  disabled={isSaving}
                  className="border-2 border-gray-200 h-12 rounded-lg"
                />
              </div>
              <div>
                <Label className="text-black font-bold mb-3 block">Semester</Label>
                <select
                  value={tempSemester}
                  onChange={(e) => setTempSemester(e.target.value)}
                  disabled={isSaving}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg h-12 bg-white"
                >
                  <option value="">Select Semester</option>
                  {[1,2,3,4,5,6,7,8].map(i => (
                    <option key={i} value={i}>{i}st Semester</option>
                  ))}
                </select>
              </div>
              <div>
                <Label className="text-black font-bold mb-3 block">Roll Number</Label>
                <div className="relative">
                  <Hash className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="12345"
                    value={tempRollNum}
                    onChange={(e) => setTempRollNum(e.target.value)}
                    disabled={isSaving}
                    className="pl-11 border-2 border-gray-200 h-12 rounded-lg"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Social Media */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h3 className="text-2xl font-bold text-black mb-8">Social Media (Optional)</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {socialFields.map((field) => (
                <div key={field.id}>
                  <Label className="text-black font-bold mb-3 block flex items-center gap-3">
                    <img src={field.icon} alt={field.label} className="h-5 w-5" />
                    {field.label}
                  </Label>
                  <Input
                    type="text"
                    placeholder={`Your ${field.label} username`}
                    value={field.value}
                    onChange={(e) => field.setter(e.target.value)}
                    disabled={isSaving}
                    className="border-2 border-gray-200 h-12 rounded-lg"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex-1 px-8 py-4 bg-black hover:bg-gray-800 disabled:opacity-50 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2 text-base"
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-5 w-5" />
                  Save Changes
                </>
              )}
            </button>
            <Link href="/profile" className="flex-1">
              <button className="w-full px-8 py-4 border-2 border-black hover:bg-gray-100 text-black font-bold rounded-lg transition-colors flex items-center justify-center gap-2 text-base">
                <X className="h-5 w-5" />
                Cancel
              </button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}