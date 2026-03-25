'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/authContext';
import { getUserProfile } from '@/lib/userService';
import { Button } from '@/components/ui/button';
import { Mail, User, Edit2, ArrowLeft, CheckCircle, Hash, Award, BookOpen, Code, Target } from 'lucide-react';
import PageLoader from '@/components/PageLoader';

export default function ProfilePage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [branch, setBranch] = useState('');
  const [semester, setSemester] = useState('');
  const [rollNum, setRollNum] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');

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
            setFirstName(profile.firstName || '');
            setLastName(profile.lastName || '');
            setEmail(profile.email || '');
            setUsername(profile.username || '');
            setBranch(profile.branch || '');
            setSemester(profile.semester || '');
            setRollNum(profile.rollNum || '');
            setAvatarUrl(profile.avatarUrl || '');
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

  const calculateProfileCompletion = (data: any) => {
    const fields = ['firstName', 'lastName', 'email', 'username', 'branch', 'semester', 'rollNum'];
    const filledFields = fields.filter(field => data[field] && data[field].trim() !== '');
    return Math.round((filledFields.length / fields.length) * 100);
  };

  const profileCompletion = calculateProfileCompletion({
    firstName,
    lastName,
    email,
    username,
    branch,
    semester,
    rollNum,
  });

  if (authLoading || isLoading) {
    return <PageLoader />;
  }

  if (!user) {
    return null;
  }

  const roboHashUrl = getRoboHashUrl(`${firstName} ${lastName}`);
  const displayAvatarUrl = avatarUrl || roboHashUrl;

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-gray-200 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-black rounded-lg">
                <User className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-black">My Profile</h1>
            </div>
            <Link href="/dashboard">
              <Button variant="outline" className="border-gray-300 text-black hover:bg-gray-100 gap-2 text-sm sm:text-base">
                <ArrowLeft className="h-4 w-4" />
                <span className="hidden sm:inline">Back to Dashboard</span>
                <span className="sm:hidden">Back</span>
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:py-12 lg:px-8">
        {/* Messages */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg animate-in fade-in">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        <div className="space-y-8">
          {/* Hero Profile Card */}
          <div className="relative overflow-hidden rounded-2xl bg-white border-2 border-black shadow-xl hover:shadow-2xl transition-shadow duration-300">
            <div className="p-8 sm:p-12">
              <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
                {/* Avatar Section */}
                <div className="flex-shrink-0 relative group">
                  <img
                    src={displayAvatarUrl}
                    alt="Avatar"
                    className="h-32 w-32 sm:h-40 sm:w-40 lg:h-48 lg:w-48 rounded-full object-cover border-4 border-black shadow-lg transform group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute bottom-0 right-0 bg-black rounded-full p-3 border-4 border-white">
                    <CheckCircle className="h-6 w-6 text-white" />
                  </div>
                </div>

                {/* Profile Info */}
                <div className="flex-1 text-center lg:text-left">
                  <div className="mb-4">
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-black mb-2">
                      {firstName} {lastName}
                    </h2>
                    {username && (
                      <p className="text-lg text-gray-600">@{username}</p>
                    )}
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 mb-8 py-6 border-t-2 border-b-2 border-black">
                    <div className="text-center lg:text-left">
                      <p className="text-2xl sm:text-3xl font-bold text-black">{semester || '0'}</p>
                      <p className="text-xs sm:text-sm text-gray-600">Semester</p>
                    </div>
                    <div className="text-center lg:text-left">
                      <p className="text-2xl sm:text-3xl font-bold text-black">{branch || 'N/A'}</p>
                      <p className="text-xs sm:text-sm text-gray-600">Branch</p>
                    </div>
                    <div className="text-center lg:text-left">
                      <p className="text-2xl sm:text-3xl font-bold text-black">{profileCompletion}%</p>
                      <p className="text-xs sm:text-sm text-gray-600">Complete</p>
                    </div>
                  </div>

                  {/* Profile Completion Bar */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-sm font-semibold text-gray-700">Profile Completion</p>
                      <p className="text-lg font-bold text-black">{profileCompletion}%</p>
                    </div>
                    <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden border border-black">
                      <div
                        className="h-full bg-black transition-all duration-500 rounded-full"
                        style={{ width: `${profileCompletion}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Edit Button */}
                  <Link href="/edit-profile">
                    <button className="w-full sm:w-auto px-8 py-3 bg-black hover:bg-gray-900 text-white font-bold rounded-lg transition-all transform hover:scale-105 flex items-center justify-center gap-2 text-sm sm:text-base shadow-md">
                      <Edit2 className="h-5 w-5" />
                      Edit Profile
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Information Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Email Card */}
            <div className="group bg-white border-2 border-gray-300 hover:border-black rounded-xl p-6 sm:p-8 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-black rounded-lg">
                  <Mail className="h-6 w-6 text-white" />
                </div>
                <p className="text-xs sm:text-sm font-bold text-gray-600 uppercase tracking-wider">Email</p>
              </div>
              <p className="text-sm sm:text-base font-semibold text-black break-all">{email || '-'}</p>
            </div>

            {/* Branch Card */}
            <div className="group bg-white border-2 border-gray-300 hover:border-black rounded-xl p-6 sm:p-8 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-black rounded-lg">
                  <Code className="h-6 w-6 text-white" />
                </div>
                <p className="text-xs sm:text-sm font-bold text-gray-600 uppercase tracking-wider">Branch</p>
              </div>
              <p className="text-sm sm:text-base font-semibold text-black">{branch || '-'}</p>
            </div>

            {/* Semester Card */}
            <div className="group bg-white border-2 border-gray-300 hover:border-black rounded-xl p-6 sm:p-8 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-black rounded-lg">
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
                <p className="text-xs sm:text-sm font-bold text-gray-600 uppercase tracking-wider">Semester</p>
              </div>
              <p className="text-sm sm:text-base font-semibold text-black">{semester ? `Semester ${semester}` : '-'}</p>
            </div>

            {/* Roll Number Card */}
            <div className="group bg-white border-2 border-gray-300 hover:border-black rounded-xl p-6 sm:p-8 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-black rounded-lg">
                  <Hash className="h-6 w-6 text-white" />
                </div>
                <p className="text-xs sm:text-sm font-bold text-gray-600 uppercase tracking-wider">Roll Number</p>
              </div>
              <p className="text-sm sm:text-base font-semibold text-black">{rollNum || '-'}</p>
            </div>

            {/* Username Card */}
            <div className="group bg-white border-2 border-gray-300 hover:border-black rounded-xl p-6 sm:p-8 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-black rounded-lg">
                  <User className="h-6 w-6 text-white" />
                </div>
                <p className="text-xs sm:text-sm font-bold text-gray-600 uppercase tracking-wider">Username</p>
              </div>
              <p className="text-sm sm:text-base font-semibold text-black">{username ? `@${username}` : '-'}</p>
            </div>

            {/* Account Status */}
            <div className="group bg-white border-2 border-gray-300 hover:border-black rounded-xl p-6 sm:p-8 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-black rounded-lg">
                  <Award className="h-6 w-6 text-white" />
                </div>
                <p className="text-xs sm:text-sm font-bold text-gray-600 uppercase tracking-wider">Status</p>
              </div>
              <p className="text-sm sm:text-base font-semibold text-black">Active</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}