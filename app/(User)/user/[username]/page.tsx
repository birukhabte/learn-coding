'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { db, firebaseReady } from '@/lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { getUserQuizStats } from '@/lib/quizService';
import { ArrowLeft, Mail, MapPin, Flame, Award, Target, BookOpen } from 'lucide-react';
import PageLoader from '@/components/PageLoader';

export default function PublicUserProfile() {
  const params = useParams();
  const router = useRouter();
  const username = params.username as string;

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [userNotFound, setUserNotFound] = useState(false);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [branch, setBranch] = useState('');
  const [semester, setSemester] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [streak, setStreak] = useState(0);
  
  const [github, setGithub] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [instagram, setInstagram] = useState('');
  const [reddit, setReddit] = useState('');
  const [discord, setDiscord] = useState('');

  const [quizStats, setQuizStats] = useState({
    totalAttempts: 0,
    totalQuestions: 0,
    correctAnswers: 0,
    wrongAnswers: 0,
    averageScore: 0,
    languageStats: {}
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setIsLoading(true);

        if (!firebaseReady || !db) {
          setError('Firebase is not configured. Add the required NEXT_PUBLIC_FIREBASE_* variables to .env and restart the dev server.');
          setIsLoading(false);
          return;
        }
        
        const usersRef = collection(db, 'users');
        const q = query(usersRef, where('username', '==', username));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          setUserNotFound(true);
          setIsLoading(false);
          return;
        }

        const userDoc = querySnapshot.docs[0];
        const userData = userDoc.data();
        const foundUserId = userDoc.id;

        setFirstName(userData.firstName || '');
        setLastName(userData.lastName || '');
        setEmail(userData.email || '');
        setBranch(userData.branch || '');
        setSemester(userData.semester || '');
        setAvatarUrl(userData.avatarUrl || '');
        setStreak(userData.streak || 0);
        
        setGithub(userData.github || '');
        setLinkedin(userData.linkedin || '');
        setInstagram(userData.instagram || '');
        setReddit(userData.reddit || '');
        setDiscord(userData.discord || '');

        try {
          const stats = await getUserQuizStats(foundUserId);
          setQuizStats(stats);
        } catch (statsError) {
          console.error('Error fetching quiz stats:', statsError);
        }

        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('Failed to load profile');
        setIsLoading(false);
      }
    };

    if (username) {
      fetchUserProfile();
    }
  }, [username]);

  const getRoboHashUrl = (name: string) => {
    const hashString = name.replace(/\s+/g, '') || 'user';
    return `https://robohash.org/${hashString}?size=200x200&set=set1`;
  };

  const roboHashUrl = getRoboHashUrl(`${firstName} ${lastName}`);
  const displayAvatarUrl = avatarUrl || roboHashUrl;

  const socialLinks = [
    { name: 'GitHub', url: github, icon: 'https://img.icons8.com/color/96/github--v1.png', color: 'hover:shadow-gray-800' },
    { name: 'LinkedIn', url: linkedin, icon: 'https://img.icons8.com/color/96/linkedin.png', color: 'hover:shadow-blue-600' },
    { name: 'Instagram', url: instagram, icon: 'https://img.icons8.com/color/96/instagram-new--v1.png', color: 'hover:shadow-pink-600' },
    { name: 'Reddit', url: reddit, icon: 'https://img.icons8.com/color/96/reddit--v1.png', color: 'hover:shadow-orange-600' },
    { name: 'Discord', url: discord, icon: 'https://img.icons8.com/color/96/discord-logo.png', color: 'hover:shadow-indigo-600' },
  ];

  if (isLoading) {
    return <PageLoader />;
  }

  if (userNotFound) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/80 backdrop-blur-sm shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-black transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Go Back</span>
            </button>
          </div>
        </header>
        <main className="max-w-7xl mx-auto px-4 py-20 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Profile Not Found</h2>
          <p className="text-gray-600 mb-8 text-lg">The profile for @{username} doesn't exist.</p>
          <button
            onClick={() => router.push('/dashboard')}
            className="px-8 py-3 bg-black hover:bg-gray-900 text-white font-bold rounded-lg transition-all"
          >
            Go to Dashboard
          </button>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/80 backdrop-blur-sm shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl sm:text-3xl font-bold text-black">@{username}</h1>
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 text-black text-sm sm:text-base transition-all"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Go Back</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 sm:py-12 lg:px-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
            {error}
          </div>
        )}

        {/* Hero Section */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
          {/* Streak Badge Background */}
          <div className="h-32 sm:h-48 bg-gradient-to-r from-black via-gray-800 to-black relative">
            {streak > 0 && (
              <div className="absolute top-6 right-6 flex items-center gap-2 bg-white px-4 sm:px-6 py-2 sm:py-3 rounded-full shadow-lg">
                <Flame className="h-6 w-6 text-orange-500" />
                <span className="font-bold text-black text-lg">{streak} days</span>
              </div>
            )}
          </div>

          {/* Profile Content */}
          <div className="px-6 sm:px-8 pb-8">
            <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 -mt-20 sm:-mt-24 relative z-10">
              {/* Avatar */}
              <div className="flex justify-center sm:justify-start flex-shrink-0">
                <img
                  src={displayAvatarUrl}
                  alt="Avatar"
                  className="h-40 w-40 sm:h-48 sm:w-48 rounded-2xl object-cover border-4 border-white shadow-xl"
                />
              </div>

              {/* Info */}
              <div className="flex-1 pt-4 sm:pt-12 text-center sm:text-left">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-black mb-2">
                  {firstName} {lastName}
                </h2>
                <p className="text-lg text-gray-600 mb-1">@{username}</p>
                
                {/* Location & Email */}
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mt-6 text-gray-700">
                  {branch && (
                    <div className="flex items-center gap-2 justify-center sm:justify-start">
                      <MapPin className="h-5 w-5 text-gray-400" />
                      <span className="font-medium">{branch} • Sem {semester}</span>
                    </div>
                  )}
                  {email && (
                    <div className="flex items-center gap-2 justify-center sm:justify-start">
                      <Mail className="h-5 w-5 text-gray-400" />
                      <a href={`mailto:${email}`} className="hover:text-black transition-colors font-medium">
                        {email}
                      </a>
                    </div>
                  )}
                </div>

                {/* Social Links */}
                <div className="flex flex-wrap gap-4 mt-8 justify-center sm:justify-start">
                  {socialLinks.map((social) => (
                    social.url && (
                      <a
                        key={social.name}
                        href={social.name === 'Discord' ? '#' : `${social.name === 'GitHub' ? 'https://github.com/' : social.name === 'LinkedIn' ? 'https://linkedin.com/in/' : social.name === 'Instagram' ? 'https://instagram.com/' : social.name === 'Reddit' ? 'https://reddit.com/u/' : '#'}${social.url}`}
                        target={social.name !== 'Discord' ? '_blank' : undefined}
                        rel={social.name !== 'Discord' ? 'noopener noreferrer' : undefined}
                        title={social.name === 'Discord' ? `Discord: ${social.url}` : undefined}
                        className={`p-3 bg-gray-100 rounded-xl hover:shadow-lg transition-all transform hover:scale-110 ${social.color}`}
                      >
                        <img src={social.icon} alt={social.name} className="h-6 w-6" />
                      </a>
                    )
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Quizzes Taken */}
          <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all p-6 border-l-4 border-black">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-700 font-semibold text-sm uppercase tracking-wider">Quizzes Taken</h3>
              <BookOpen className="h-5 w-5 text-gray-400" />
            </div>
            <p className="text-4xl font-bold text-black">{quizStats.totalAttempts}</p>
            <p className="text-gray-500 text-sm mt-2">Assessments completed</p>
          </div>

          {/* Average Score */}
          <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all p-6 border-l-4 border-black">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-700 font-semibold text-sm uppercase tracking-wider">Average Score</h3>
              <Award className="h-5 w-5 text-gray-400" />
            </div>
            <p className="text-4xl font-bold text-black">{Math.round(quizStats.averageScore)}%</p>
            <p className="text-gray-500 text-sm mt-2">Performance metric</p>
          </div>

          {/* Correct Answers */}
          <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-700 font-semibold text-sm uppercase tracking-wider">Correct</h3>
              <Target className="h-5 w-5 text-green-500" />
            </div>
            <p className="text-4xl font-bold text-green-600">{quizStats.correctAnswers}</p>
            <p className="text-gray-500 text-sm mt-2">Accurate responses</p>
          </div>

          {/* Wrong Answers */}
          <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all p-6 border-l-4 border-red-500">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-700 font-semibold text-sm uppercase tracking-wider">Wrong</h3>
              <Target className="h-5 w-5 text-red-500" />
            </div>
            <p className="text-4xl font-bold text-red-600">{quizStats.wrongAnswers}</p>
            <p className="text-gray-500 text-sm mt-2">Learning opportunities</p>
          </div>
        </div>

        {/* Portfolio Summary */}
        <div className="bg-white rounded-xl shadow-md p-8">
          <h3 className="text-2xl font-bold text-black mb-6">Portfolio Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-bold text-gray-900 mb-3">Learning Progress</h4>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-700 font-medium">Quiz Completion</span>
                    <span className="text-black font-bold">{quizStats.totalAttempts} quizzes</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-black" style={{ width: '100%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-700 font-medium">Accuracy Rate</span>
                    <span className="text-black font-bold">{Math.round(quizStats.averageScore)}%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-black" style={{ width: `${Math.round(quizStats.averageScore)}%` }}></div>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-3">Quick Stats</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-600 text-sm">Total Questions</p>
                  <p className="text-2xl font-bold text-black mt-2">{quizStats.totalQuestions}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-600 text-sm">Success Rate</p>
                  <p className="text-2xl font-bold text-black mt-2">
                    {quizStats.totalQuestions > 0 ? Math.round((quizStats.correctAnswers / quizStats.totalQuestions) * 100) : 0}%
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}