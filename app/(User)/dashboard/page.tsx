'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';
import { auth, firebaseReady } from '@/lib/firebase';
import { useAuth } from '@/lib/authContext';
import { Button } from '@/components/ui/button';
import { getUserProfile, updateUserProfile } from '@/lib/userService';
import { getUserQuizStats } from '@/lib/quizService';
import { ensureDefaultAvatar } from '@/lib/userService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Menu, X, LogOut, Settings, FileText, HelpCircle, User, Code, BookOpen, Zap, ChevronRight, Award, BarChart3 } from 'lucide-react';
import PageLoader from '@/components/PageLoader';

function splitDisplayName(displayName?: string | null) {
  const parts = (displayName || '').trim().split(/\s+/).filter(Boolean);
  return {
    firstName: parts[0] || 'User',
    lastName: parts.slice(1).join(' '),
  };
}

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [userProfile, setUserProfile] = useState<any>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  
  const [quizStats, setQuizStats] = useState({
    totalAttempts: 0,
    totalQuestions: 0,
    correctAnswers: 0,
    wrongAnswers: 0,
    averageScore: 0,
    languageStats: {}
  });
  const [statsLoading, setStatsLoading] = useState(true);

  const fallbackName = splitDisplayName(user?.displayName);
  const displayProfile = userProfile ?? {
    firstName: fallbackName.firstName,
    lastName: fallbackName.lastName,
    email: user?.email || '',
    avatarUrl: user?.photoURL || '',
    createdAt: undefined,
  };

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      const fetchProfile = async () => {
        try {
          const profile = await getUserProfile(user.uid);
          setUserProfile(profile);
          
          // Ensure default avatar is set
          if (profile) {
            await ensureDefaultAvatar(user.uid, profile.firstName, profile.lastName);
          }
        } catch (error) {
          console.error('Error fetching profile:', error);
        }
      };
      fetchProfile();
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      const fetchQuizStats = async () => {
        try {
          const stats = await getUserQuizStats(user.uid);
          console.log('Quiz stats fetched:', stats);
          console.log('Average score value:', stats.averageScore);
          console.log('Type of averageScore:', typeof stats.averageScore);
          setQuizStats(stats);
          setStatsLoading(false);
        } catch (error) {
          console.error('Error fetching quiz stats:', error);
          setStatsLoading(false);
        }
      };
      fetchQuizStats();
    }
  }, [user]);

  const handleLogout = async () => {
    try {
      if (!firebaseReady || !auth) {
        router.push('/login');
        return;
      }

      await signOut(auth);
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const getRoboHashUrl = (name: string) => {
    const hashString = name.replace(/\s+/g, '') || 'user';
    return `https://robohash.org/${hashString}?size=200x200&set=set1`;
  };

  const avatarUrl = displayProfile.avatarUrl || getRoboHashUrl(`${displayProfile.firstName || 'User'} ${displayProfile.lastName || ''}`);

  if (loading) {
    return <PageLoader />;
  }

  if (!user) {
    return null;
  }

  const learningCards = [
    {
      title: 'Learn C',
      description: 'Master C fundamentals and advanced concepts',
      icon: Code,
      link: '/c-quiz',
      image: 'https://img.icons8.com/color/96/c-programming.png'
    },
    {
      title: 'Learn C++',
      description: 'Object-oriented programming with C++',
      icon: Code,
      link: '/cpp-quiz',
      image: 'https://img.icons8.com/color/96/c-plus-plus-logo.png'
    },
    {
      title: 'Learn Python',
      description: 'Versatile Python for all applications',
      icon: Code,
      link: '/python-quiz',
      image: 'https://img.icons8.com/color/96/python--v1.png'
    },
    {
      title: 'Learn Java',
      description: 'Enterprise-grade Java development',
      icon: Code,
      link: '/java-quiz',
      image: 'https://img.icons8.com/color/96/java-coffee-cup-logo--v1.png'
    },
    {
      title: 'Read Books',
      description: 'Comprehensive programming books and guides',
      icon: BookOpen,
      link: '#',
      image: null
    },
    {
      title: 'Code Examples',
      description: 'Real-world code examples for all languages',
      icon: Zap,
      link: '#',
      image: null
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Professional Header */}
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white shadow-sm">
        <div className="px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo Section */}
            <Link href="/dashboard" className="flex items-center gap-3 group flex-1 sm:flex-none">
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-bold text-black tracking-tight">
                    CodeLearn
                  </h1>
                  <span className="inline-block px-2 py-1 bg-black text-white text-xs font-bold rounded">BETA</span>
                </div>
                <p className="text-xs text-gray-500 hidden sm:block">Master Programming</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8 flex-1 justify-center">
              <a href="#learning" className="text-gray-600 hover:text-black transition-colors font-medium text-sm border-b-2 border-transparent hover:border-black pb-1">Courses</a>
              <Link href="/profile" className="text-gray-600 hover:text-black transition-colors font-medium text-sm border-b-2 border-transparent hover:border-black pb-1">Profile</Link>
              <Link href="/help" className="text-gray-600 hover:text-black transition-colors font-medium text-sm border-b-2 border-transparent hover:border-black pb-1">Help</Link>
            </nav>

            {/* Right Side - Avatar & Menu */}
            <div className="flex items-center gap-3 sm:gap-4">
              {/* Avatar - Desktop */}
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-all group hidden sm:flex"
              >
                <img
                  src={avatarUrl}
                  alt={`${displayProfile.firstName} ${displayProfile.lastName}`}
                  className="h-10 w-10 rounded-full object-cover border-2 border-black group-hover:border-gray-400 transition-colors shadow-sm"
                />
                <div className="text-left hidden md:block">
                  <p className="text-sm font-semibold text-black leading-tight">
                    {displayProfile.firstName}
                  </p>
                  <p className="text-xs text-gray-500">Student</p>
                </div>
              </button>

              {/* Avatar - Mobile */}
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex sm:hidden h-10 w-10 items-center justify-center rounded-full hover:shadow-md transition-all overflow-hidden"
              >
                <img
                  src={avatarUrl}
                  alt={`${userProfile?.firstName} ${userProfile?.lastName}`}
                  className="h-full w-full rounded-full object-cover border-2 border-black"
                />
              </button>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div className="absolute right-4 top-16 sm:right-6 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="p-5 border-b border-gray-200 bg-gray-50">
                    <div className="flex items-center gap-3 mb-3">
                      <img
                        src={avatarUrl}
                        alt={`${displayProfile.firstName} ${displayProfile.lastName}`}
                        className="h-12 w-12 rounded-full object-cover border-2 border-black"
                      />
                      <div className="flex-1">
                        <p className="font-bold text-black text-sm">{displayProfile.firstName} {displayProfile.lastName}</p>
                        <p className="text-xs text-gray-500 mt-1">{displayProfile.email}</p>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500">Member since {displayProfile.createdAt ? new Date(displayProfile.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short' }) : 'Today'}</p>
                  </div>
                  <Link href="/profile" onClick={() => setDropdownOpen(false)}>
                    <div className="flex items-center gap-3 px-5 py-3 text-gray-600 hover:bg-gray-100 hover:text-black cursor-pointer transition-colors">
                      <User className="h-4 w-4" />
                      <span className="text-sm font-medium">View Profile</span>
                    </div>
                  </Link>
                  <Link href="/edit-profile" onClick={() => setDropdownOpen(false)}>
                    <div className="flex items-center gap-3 px-5 py-3 text-gray-600 hover:bg-gray-100 hover:text-black cursor-pointer transition-colors">
                      <Settings className="h-4 w-4" />
                      <span className="text-sm font-medium">Edit Profile</span>
                    </div>
                  </Link>
                  <div className="border-t border-gray-200"></div>
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      handleLogout();
                    }}
                    className="w-full flex items-center gap-3 px-5 py-3 text-red-600 hover:bg-gray-100 cursor-pointer transition-colors text-sm font-medium"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </div>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6 text-black" />
                ) : (
                  <Menu className="h-6 w-6 text-black" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <nav className="mt-4 space-y-1 pb-4 border-t border-gray-200 pt-4 animate-in fade-in slide-in-from-top-2 duration-300 lg:hidden">
              <a href="#learning" onClick={() => setMobileMenuOpen(false)}>
                <div className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-black cursor-pointer transition-colors">
                  <Code className="h-5 w-5" />
                  <span className="font-medium">Courses</span>
                </div>
              </a>
              <Link href="/profile" onClick={() => setMobileMenuOpen(false)}>
                <div className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-black cursor-pointer transition-colors">
                  <User className="h-5 w-5" />
                  <span className="font-medium">My Profile</span>
                </div>
              </Link>
              <Link href="/help" onClick={() => setMobileMenuOpen(false)}>
                <div className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-black cursor-pointer transition-colors">
                  <HelpCircle className="h-5 w-5" />
                  <span className="font-medium">Help</span>
                </div>
              </Link>
              <Link href="/terms" onClick={() => setMobileMenuOpen(false)}>
                <div className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-black cursor-pointer transition-colors">
                  <FileText className="h-5 w-5" />
                  <span className="font-medium">Terms</span>
                </div>
              </Link>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-gray-100 cursor-pointer transition-colors font-medium mt-2 border-t border-gray-200 pt-4"
              >
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
              </button>
            </nav>
          )}
        </div>
      </header>

      {/* Welcome Section */}
      <section className="px-4 py-8 sm:px-6 lg:px-8 bg-gray-50">
        <div className="mx-auto max-w-7xl">
          {/* Welcome Card */}
          <Card className="border-0 bg-black text-white shadow-lg mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
            <CardHeader>
              <CardTitle className="text-2xl sm:text-3xl">
                Welcome back, {displayProfile.firstName}! 👋
              </CardTitle>
              <CardDescription className="text-gray-300 mt-2">
                {quizStats.totalAttempts > 0 
                  ? `You've completed ${quizStats.totalAttempts} quiz${quizStats.totalAttempts > 1 ? 'es' : ''} with an average score of ${Math.round(quizStats.averageScore)}%!`
                  : 'Start your learning journey by taking your first quiz!'
                }
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Profile Cards */}
          <div className="grid gap-3 sm:gap-4 grid-cols-2 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-8 mb-8">
            {/* Quiz Activity Card */}
            <Card className="border border-gray-200 bg-white shadow-sm hover:shadow-md transition-all duration-300 col-span-1 sm:col-span-2 md:col-span-2 lg:col-span-2">
              <CardHeader className="pb-2 pt-3 px-3 sm:pt-4 sm:px-4">
                <CardTitle className="text-sm sm:text-lg text-black">Quiz Activity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 pt-0 pb-3 px-3 sm:pb-4 sm:px-4">
                <div>
                  <p className="text-xs text-gray-600 font-semibold mb-0.5">Total Attempts</p>
                  <p className="text-3xl sm:text-4xl lg:text-5xl font-bold text-black">
                    {statsLoading ? '...' : quizStats.totalAttempts}
                  </p>
                  <p className="text-xs text-gray-500">quizzes taken</p>
                </div>
                <div className="border-t border-gray-200 pt-2">
                  <p className="text-xs text-gray-600 font-semibold mb-0.5">Questions Attempted</p>
                  <p className="text-3xl sm:text-4xl lg:text-5xl font-bold text-black">
                    {statsLoading ? '...' : quizStats.totalQuestions}
                  </p>
                  <p className="text-xs text-gray-500">questions</p>
                </div>
              </CardContent>
            </Card>

            {/* Stats Card */}
            <Card className="border border-gray-200 bg-white shadow-sm hover:shadow-md transition-all duration-300 col-span-1 sm:col-span-2 md:col-span-2 lg:col-span-2">
              <CardHeader className="pb-2 pt-3 px-3 sm:pt-4 sm:px-4">
                <CardTitle className="text-sm sm:text-lg text-black">Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-1.5 pt-0 pb-3 px-3 sm:pb-4 sm:px-4 sm:space-y-2">
                <div>
                  <p className="text-xs text-gray-600 font-semibold mb-0.5">Total Score</p>
                  <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-black">
                    {statsLoading ? '...' : quizStats.correctAnswers}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 font-semibold mb-0.5">Avg Score</p>
                  <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-black">
                    {statsLoading ? '...' : `${Math.round(quizStats.averageScore)}%`}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Answers Card */}
            <Card className="border border-gray-200 bg-white shadow-sm hover:shadow-md transition-all duration-300 col-span-1 sm:col-span-2 md:col-span-2 lg:col-span-2">
              <CardHeader className="pb-2 pt-3 px-3 sm:pt-4 sm:px-4">
                <CardTitle className="text-sm sm:text-lg text-black">Answers</CardTitle>
              </CardHeader>
              <CardContent className="space-y-1.5 pt-0 pb-3 px-3 sm:pb-4 sm:px-4 sm:space-y-2">
                <div>
                  <p className="text-xs text-gray-600 font-semibold mb-0.5">Correct</p>
                  <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-green-600">
                    {statsLoading ? '...' : quizStats.correctAnswers}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 font-semibold mb-0.5">Wrong</p>
                  <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-red-600">
                    {statsLoading ? '...' : quizStats.wrongAnswers}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Profile & Account Card */}
            <Card className="border border-gray-200 bg-white shadow-sm hover:shadow-md transition-all duration-300 col-span-1 sm:col-span-2 md:col-span-2 lg:col-span-2">
              <CardHeader className="pb-2 pt-3 px-3 sm:pt-4 sm:px-4">
                <CardTitle className="text-sm sm:text-lg text-black">Profile & Account</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 pt-0 pb-3 px-3 sm:pb-4 sm:px-4">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <img
                      src={avatarUrl}
                      alt={`${userProfile?.firstName} ${userProfile?.lastName}`}
                      className="h-12 w-12 rounded-full object-cover border-3 border-black shadow-md flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-black text-xs sm:text-sm truncate">
                        {displayProfile.firstName} {displayProfile.lastName}
                      </p>
                      <p className="text-xs text-gray-600 truncate">{displayProfile.email}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <p className="text-xs text-gray-600 font-semibold">Member Since</p>
                  <p className="text-2xl sm:text-3xl font-bold text-black">
                    {displayProfile.createdAt
                      ? new Date(displayProfile.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                      : 'Today'}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-600 font-semibold mb-1">Status</p>
                  <div className="inline-flex items-center gap-1.5 px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-bold border border-green-300">
                    <span className="w-1.5 h-1.5 bg-green-700 rounded-full animate-pulse"></span>
                    Active
                  </div>
                </div>

                <Link href="/edit-profile" className="block">
                  <Button className="w-full bg-black hover:bg-gray-800 text-white text-xs py-1.5 sm:py-2 h-7 sm:h-8">
                    <Settings className="h-3 w-3 mr-1" />
                    Edit Profile
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Learning Paths Section */}
      <section id="learning" className="px-4 py-12 sm:px-6 lg:px-8 border-t border-gray-200">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12">
            <h2 className="text-3xl sm:text-4xl font-black text-black mb-2">
              Start <span className="text-gray-600">Learning</span>
            </h2>
            <p className="text-gray-600">Choose your learning path and master programming</p>
          </div>

          <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3 auto-rows-max">
            {learningCards.map((card, index) => {
              const Icon = card.icon;
              return (
                <Card
                  key={card.title}
                  className="border border-gray-200 bg-white shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer group overflow-hidden"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <CardHeader className="relative">
                    <div className="mb-4 flex items-center gap-3">
                      {card.image ? (
                        <img src={card.image} alt={card.title} className="w-12 h-12" />
                      ) : (
                        <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-black text-white shadow-md group-hover:shadow-lg transition-all duration-300 transform group-hover:scale-110">
                          <Icon className="h-6 w-6" />
                        </div>
                      )}
                    </div>
                    <CardTitle className="text-lg sm:text-xl text-black group-hover:text-gray-700 transition-all">
                      {card.title}
                    </CardTitle>
                    <CardDescription className="text-gray-600 group-hover:text-gray-700 transition-colors">
                      {card.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="relative">
                    <Link href={card.link}>
                      <Button className="w-full bg-black hover:bg-gray-800 text-white transition-all group-hover:translate-y-1 duration-300">
                        Get Started
                        <ChevronRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="px-4 py-12 sm:px-6 lg:px-8 border-t border-gray-200 bg-gray-50">
        <div className="mx-auto max-w-7xl text-center">
          <h3 className="text-2xl sm:text-3xl font-bold text-black mb-4">Ready to Level Up?</h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Start with any language and progress at your own pace with our interactive lessons and quizzes
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#learning">
              <Button className="w-full sm:w-auto bg-black hover:bg-gray-800 text-white shadow-lg">
                Explore Courses
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </a>
            <Link href="/help">
              <Button variant="outline" className="w-full sm:w-auto border-gray-300 text-black hover:bg-gray-100">
                Need Help?
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}