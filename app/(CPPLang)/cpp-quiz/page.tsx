'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/authContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Home, Loader2 } from 'lucide-react';
import Link from 'next/link';

interface Chapter {
  id: string;
  title: string;
  description: string;
  totalQuestions: number;
}

export default function CPPQuizPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  const chapters: Chapter[] = [
    {
      id: 'basics',
      title: 'C++ Programming Basics',
      description: 'Variables, data types, operators, and basic syntax',
      totalQuestions: 10
    },
    {
      id: 'oop',
      title: 'Object-Oriented Programming',
      description: 'Classes, objects, inheritance, and polymorphism',
      totalQuestions: 15
    },
    {
      id: 'stl',
      title: 'Standard Template Library',
      description: 'Vectors, maps, sets, and algorithms',
      totalQuestions: 12
    },
    {
      id: 'pointers',
      title: 'Pointers and References',
      description: 'Pointer basics, references, and smart pointers',
      totalQuestions: 10
    },
    {
      id: 'templates',
      title: 'Templates',
      description: 'Function templates and class templates',
      totalQuestions: 10
    },
    {
      id: 'exception-handling',
      title: 'Exception Handling',
      description: 'Try-catch blocks and error handling',
      totalQuestions: 8
    }
  ];

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-black mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b-2 border-black bg-white">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-black">C++ Programming Quizzes</h1>
              <p className="text-gray-600 mt-1">Select a chapter to start practicing</p>
            </div>
            <Link href="/dashboard">
              <Button variant="outline" className="border-2 border-black text-black hover:bg-black hover:text-white">
                <Home className="w-4 h-4 mr-2" />
                Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="space-y-4">
          {chapters.map((chapter) => (
            <Card key={chapter.id} className="border-2 border-black hover:shadow-lg transition-all">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-xl text-black">{chapter.title}</CardTitle>
                    <CardDescription className="text-gray-600 mt-2">
                      {chapter.description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    {chapter.totalQuestions} Questions
                  </div>
                  <Link href={`/quiz/cpp/${chapter.id}`}>
                    <Button className="bg-black hover:bg-gray-800 text-white">
                      Start Quiz
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
