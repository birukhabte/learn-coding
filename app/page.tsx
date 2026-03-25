'use client';

import React, { useState, useEffect } from 'react';
import { BookOpen, Code, Trophy, Users, ArrowRight, CheckCircle, Terminal, Github, Menu, X, FileText, Play, Sparkles, Zap, Target, Award, Clock } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  const [scrollY, setScrollY] = useState(0);
  const [activeLanguage, setActiveLanguage] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveLanguage((prev) => (prev + 1) % 4);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  const languages = [
    { 
      name: 'Python', 
      icon: 'https://img.icons8.com/color/96/python--v1.png',
      description: 'Perfect for beginners with clean, readable syntax',
      topics: ['Syntax & Variables', 'Data Structures', 'Functions & Modules', 'Object-Oriented'],
      color: 'from-blue-500 to-yellow-500'
    },
    { 
      name: 'C', 
      icon: 'https://img.icons8.com/color/96/c-programming.png',
      description: 'Master low-level programming fundamentals',
      topics: ['Syntax Basics', 'Pointers & Memory', 'File Operations', 'Data Structures'],
      color: 'from-blue-600 to-blue-800'
    },
    { 
      name: 'C++', 
      icon: 'https://img.icons8.com/color/96/c-plus-plus-logo.png',
      description: 'Object-oriented programming with performance',
      topics: ['OOP Concepts', 'STL Library', 'Templates', 'Exception Handling'],
      color: 'from-blue-500 to-purple-600'
    },
    { 
      name: 'Java', 
      icon: 'https://img.icons8.com/color/96/java-coffee-cup-logo--v1.png',
      description: 'Enterprise development and cross-platform apps',
      topics: ['OOP Principles', 'Collections API', 'Multithreading', 'Spring Framework'],
      color: 'from-red-500 to-orange-500'
    }
  ];

  const features = [
    { 
      icon: FileText, 
      title: 'Comprehensive Documentation', 
      desc: 'Step-by-step guides covering every concept from basics to advanced topics',
      highlight: 'Learn'
    },
    { 
      icon: Play, 
      title: 'Real Code Examples', 
      desc: 'Hundreds of working code samples demonstrating practical applications',
      highlight: 'Practice'
    },
    { 
      icon: Trophy, 
      title: 'Interactive Quizzes', 
      desc: 'Test your knowledge and track progress with detailed assessments',
      highlight: 'Test'
    },
    { 
      icon: Target, 
      title: 'Structured Learning Path', 
      desc: 'Carefully designed curriculum that builds skills progressively',
      highlight: 'Master'
    }
  ];

  const stats = [
    { number: '4', label: 'Programming Languages', icon: Code },
    { number: '100+', label: 'Code Examples', icon: Play },
    { number: '50+', label: 'Practice Quizzes', icon: Trophy },
    { number: '100%', label: 'Free Access', icon: Sparkles }
  ];

  const codeExamples = [
    {
      lang: 'Python',
      code: `# Python Example
def greet(name):
    return f"Hello, {name}!"

print(greet("CodeLearn"))
# Output: Hello, CodeLearn!`
    },
    {
      lang: 'C',
      code: `// C Example
#include <stdio.h>

int main() {
    printf("Hello from C!\\n");
    return 0;
}`
    },
    {
      lang: 'C++',
      code: `// C++ Example
#include <iostream>
using namespace std;

int main() {
    cout << "Hello C++!" << endl;
    return 0;
}`
    },
    {
      lang: 'Java',
      code: `// Java Example
public class Hello {
    public static void main(String[] args) {
        System.out.println("Hello Java!");
    }
}`
    }
  ];

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrollY > 50 
          ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200' 
          : 'bg-white/80 backdrop-blur-sm border-b border-gray-100'
      }`}>
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <Terminal className="w-6 h-6 text-white" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-black">CodeLearn</span>
                <span className="px-2.5 py-1 bg-gradient-to-r from-black to-gray-700 text-white text-xs font-bold rounded-md shadow-sm">
                  BETA
                </span>
              </div>
            </Link>
            
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-gray-600 hover:text-black transition-colors font-medium">Features</a>
              <a href="#languages" className="text-gray-600 hover:text-black transition-colors font-medium">Languages</a>
              <a href="#how-it-works" className="text-gray-600 hover:text-black transition-colors font-medium">How it Works</a>
              <div className="flex items-center gap-4">
                <Link href="/login" className="px-6 py-2.5 border-2 border-black text-black rounded-lg hover:bg-black hover:text-white transition-all font-semibold">
                  Login
                </Link>
                <Link href="/signup" className="px-6 py-2.5 bg-black text-white rounded-lg hover:bg-gray-800 transition-all font-semibold shadow-lg hover:shadow-xl">
                  Get Started
                </Link>
              </div>
            </div>

            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-black p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {mobileMenuOpen && (
            <div className="md:hidden mt-4 pt-4 border-t border-gray-200 space-y-3 pb-4">
              <a href="#features" onClick={() => setMobileMenuOpen(false)} className="block text-gray-600 hover:text-black transition-colors py-2">Features</a>
              <a href="#languages" onClick={() => setMobileMenuOpen(false)} className="block text-gray-600 hover:text-black transition-colors py-2">Languages</a>
              <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)} className="block text-gray-600 hover:text-black transition-colors py-2">How it Works</a>
              <Link href="/login" className="block px-6 py-2.5 border-2 border-black text-black rounded-lg text-center font-semibold">
                Login
              </Link>
              <Link href="/signup" className="block px-6 py-2.5 bg-black text-white rounded-lg text-center font-semibold">
                Get Started
              </Link>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 bg-gradient-to-br from-white via-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border-2 border-gray-200 rounded-full shadow-sm">
                <Sparkles className="w-4 h-4 text-black" />
                <span className="text-sm font-semibold text-black">Free Learning Platform for Students</span>
              </div>

              <div className="space-y-4">
                <h1 className="text-5xl md:text-7xl font-bold leading-tight">
                  Master Programming
                  <span className="block mt-2 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                    Step by Step
                  </span>
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Learn Python, C, C++, and Java through comprehensive documentation, 
                  real-world examples, and interactive quizzes. Built specifically for students.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/signup" className="group px-8 py-4 bg-black text-white rounded-xl font-bold text-lg hover:bg-gray-800 transition-all flex items-center gap-2 justify-center shadow-lg hover:shadow-xl">
                  Start Learning Now
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <a href="#languages" className="px-8 py-4 border-2 border-black text-black rounded-xl font-bold text-lg hover:bg-black hover:text-white transition-all text-center">
                  Explore Languages
                </a>
              </div>

              <div className="flex flex-wrap items-center gap-6 pt-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="font-medium">No Credit Card Required</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="font-medium">100% Free Forever</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="font-medium">Instant Access</span>
                </div>
              </div>
            </div>

            {/* Code Preview */}
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-3xl blur-2xl opacity-20"></div>
              <div className="relative bg-white rounded-2xl p-8 border-2 border-gray-200 shadow-2xl">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                  </div>
                  <div className="flex items-center gap-2 ml-auto">
                    <img 
                      src={languages[activeLanguage].icon} 
                      alt={languages[activeLanguage].name}
                      className="w-6 h-6"
                    />
                    <span className="font-semibold text-sm">{codeExamples[activeLanguage].lang}</span>
                  </div>
                </div>
                <pre className="font-mono text-sm text-gray-800 overflow-x-auto">
                  {codeExamples[activeLanguage].code}
                </pre>
                <div className="flex gap-2 mt-6">
                  {languages.map((_, idx) => (
                    <div 
                      key={idx}
                      className={`h-1 flex-1 rounded-full transition-all ${
                        idx === activeLanguage ? 'bg-black' : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20">
            {stats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div key={idx} className="bg-white rounded-xl p-6 border border-gray-200 text-center hover:border-black transition-all hover:shadow-lg">
                  <Icon className="w-8 h-8 mx-auto mb-3 text-black" />
                  <p className="text-3xl font-bold text-black mb-1">{stat.number}</p>
                  <p className="text-sm text-gray-600 font-medium">{stat.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Everything You Need to Excel</h2>
            <p className="text-xl text-gray-600">A complete learning ecosystem designed for student success</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div key={idx} className="group bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 border-2 border-gray-200 hover:border-black transition-all hover:shadow-xl hover:-translate-y-1">
                  <div className="w-14 h-14 bg-black rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <div className="inline-block px-3 py-1 bg-black text-white text-xs font-bold rounded-full mb-3">
                    {feature.highlight}
                  </div>
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Languages Section */}
      <section id="languages" className="py-24 px-6 bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Four Essential Languages</h2>
            <p className="text-xl text-gray-600">Master the most in-demand programming languages for your career</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {languages.map((lang, idx) => (
              <div key={idx} className="group bg-white rounded-2xl p-8 border-2 border-gray-200 hover:border-black transition-all hover:shadow-2xl hover:-translate-y-2">
                <div className="mb-6">
                  <img 
                    src={lang.icon} 
                    alt={lang.name}
                    className="w-20 h-20 mx-auto group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-center">{lang.name}</h3>
                <p className="text-gray-600 text-sm mb-6 text-center leading-relaxed">{lang.description}</p>
                
                <div className="space-y-3 mb-6">
                  {lang.topics.map((topic, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-black flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700 font-medium">{topic}</span>
                    </div>
                  ))}
                </div>
                
                <Link href="/signup" className="block w-full text-center py-3 bg-black text-white rounded-xl font-bold hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl">
                  Start {lang.name}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Your Learning Journey</h2>
            <p className="text-xl text-gray-600">Three simple steps to programming mastery</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                icon: BookOpen,
                title: 'Read Documentation',
                desc: 'Start with comprehensive guides that explain concepts clearly with examples'
              },
              {
                step: '02',
                icon: Code,
                title: 'Practice with Examples',
                desc: 'Work through real code examples and understand how concepts are applied'
              },
              {
                step: '03',
                icon: Trophy,
                title: 'Take Quizzes',
                desc: 'Test your knowledge and track your progress with interactive assessments'
              }
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="relative">
                  {idx < 2 && (
                    <div className="hidden md:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-black to-transparent"></div>
                  )}
                  <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 border-2 border-gray-200 hover:border-black transition-all hover:shadow-xl">
                    <div className="text-6xl font-bold text-gray-200 mb-4">{item.step}</div>
                    <div className="w-16 h-16 bg-black rounded-xl flex items-center justify-center mb-6 shadow-lg">
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold mb-3">{item.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 bg-gradient-to-br from-black via-gray-900 to-black text-white">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/20 rounded-full mb-8">
            <Zap className="w-4 h-4 text-white" />
            <span className="text-sm font-semibold">Limited Beta Access</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Begin Your Coding Journey?
          </h2>
          <p className="text-xl text-gray-300 mb-10 leading-relaxed">
            Join students who are already mastering programming with CodeLearn. 
            Start learning today with instant access to all courses and features.
          </p>
          <Link href="/signup" className="inline-block px-12 py-5 bg-white text-black rounded-xl font-bold text-lg hover:bg-gray-100 transition-all shadow-2xl hover:shadow-white/20 hover:scale-105">
            Get Started Free
          </Link>
          <p className="mt-8 text-sm text-gray-400 flex items-center justify-center gap-6 flex-wrap">
            <span className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              No Credit Card
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Instant Access
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Free Forever
            </span>
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t-2 border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
                <Terminal className="w-6 h-6 text-white" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold">CodeLearn</span>
                <span className="px-2 py-0.5 bg-black text-white text-xs font-bold rounded">BETA</span>
              </div>
            </div>
            
            <div className="flex items-center gap-8">
              <Link 
                href="https://github.com/birukhabte" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors group"
              >
                <Github className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium">GitHub</span>
              </Link>
            </div>
          </div>
          
          <div className="mt-10 pt-8 border-t border-gray-200 text-center">
            <p className="text-gray-600 text-sm">
              © 2025 CodeLearn. Crafted with <span className="text-red-500">❤️</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
