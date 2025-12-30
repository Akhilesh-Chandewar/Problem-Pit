import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Code, Trophy, Users, Zap, Target, BookOpen, Star, ChevronRight } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-linear-to-br from-white via-gray-50 to-gray-100 dark:from-black dark:via-gray-900 dark:to-black">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-r from-orange-500/10 to-orange-600/10 dark:from-orange-500/10 dark:to-orange-600/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
          <div className="text-center">
            <Badge variant="secondary" className="mb-4 px-4 py-2 text-sm font-medium bg-orange-500/20 text-orange-700 dark:text-orange-300 border-orange-500/30 dark:border-orange-500/30">
              🚀 Master Data Structures & Algorithms
            </Badge>
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-6">
              Welcome to{" "}
              <span className="bg-linear-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
                Problem Pit
              </span>
            </h1>
            <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Sharpen your coding skills with curated challenges, interactive problems, and comprehensive solutions.
              Join thousands of developers mastering DSA one problem at a time.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/problems">
                <Button size="lg" className="px-8 py-3 text-lg font-semibold bg-linear-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-lg hover:shadow-xl transition-all duration-300">
                  Start Solving <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/about">
                <Button variant="outline" size="lg" className="px-8 py-3 text-lg font-semibold border-orange-500/50 text-orange-700 dark:text-orange-300 hover:bg-orange-500/10 dark:hover:bg-orange-500/10 transition-all duration-300">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
        {/* Floating elements for visual appeal */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-orange-500/20 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-orange-600/20 rounded-full blur-xl"></div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Why Choose Problem Pit?
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Everything you need to excel in technical interviews and become a better programmer
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="group hover:shadow-xl transition-all duration-300 border border-orange-500/20 shadow-lg bg-white/50 dark:bg-black/50 backdrop-blur-sm">
              <CardHeader>
                <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Code className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">Curated Problems</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base text-gray-600 dark:text-gray-300">
                  Hand-picked problems ranging from easy to expert level, covering all major topics in DSA.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 border border-orange-500/20 shadow-lg bg-white/50 dark:bg-black/50 backdrop-blur-sm">
              <CardHeader>
                <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">Instant Feedback</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base text-gray-600 dark:text-gray-300">
                  Get immediate results with our powerful judge system supporting multiple programming languages.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 border border-orange-500/20 shadow-lg bg-white/50 dark:bg-black/50 backdrop-blur-sm">
              <CardHeader>
                <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Trophy className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">Competitive Contests</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base text-gray-600 dark:text-gray-300">
                  Participate in regular contests, climb leaderboards, and earn badges for your achievements.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 border border-orange-500/20 shadow-lg bg-white/50 dark:bg-black/50 backdrop-blur-sm">
              <CardHeader>
                <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">Detailed Solutions</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base text-gray-600 dark:text-gray-300">
                  Learn from comprehensive solutions with multiple approaches and time/space complexity analysis.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 border border-orange-500/20 shadow-lg bg-white/50 dark:bg-black/50 backdrop-blur-sm">
              <CardHeader>
                <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Target className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">Progress Tracking</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base text-gray-600 dark:text-gray-300">
                  Monitor your progress with detailed statistics, streaks, and personalized learning paths.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 border border-orange-500/20 shadow-lg bg-white/50 dark:bg-black/50 backdrop-blur-sm">
              <CardHeader>
                <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">Community Support</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base text-gray-600 dark:text-gray-300">
                  Connect with fellow developers, discuss solutions, and learn from the community.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 bg-linear-to-r from-orange-500 to-orange-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div className="text-white">
              <div className="text-4xl lg:text-5xl font-bold mb-2">1000+</div>
              <div className="text-orange-100 text-lg">Problems</div>
            </div>
            <div className="text-white">
              <div className="text-4xl lg:text-5xl font-bold mb-2">50K+</div>
              <div className="text-orange-100 text-lg">Active Users</div>
            </div>
            <div className="text-white">
              <div className="text-4xl lg:text-5xl font-bold mb-2">95%</div>
              <div className="text-orange-100 text-lg">Success Rate</div>
            </div>
            <div className="text-white">
              <div className="text-4xl lg:text-5xl font-bold mb-2">24/7</div>
              <div className="text-orange-100 text-lg">Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gray-100 dark:bg-black">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-6">
            Ready to Start Your Coding Journey?
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Join thousands of developers who are already improving their skills with Problem Pit.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/sign-up">
              <Button size="lg" className="px-8 py-3 text-lg font-semibold bg-linear-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-lg hover:shadow-xl transition-all duration-300">
                Get Started Free <Star className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/problems">
              <Button variant="outline" size="lg" className="px-8 py-3 text-lg font-semibold border-orange-500/50 text-orange-700 dark:text-orange-300 hover:bg-orange-500/10 dark:hover:bg-orange-500/10 transition-all duration-300">
                Browse Problems
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-200 dark:bg-black text-gray-900 dark:text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <span className="text-2xl font-bold bg-linear-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
                Problem Pit
              </span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Empowering developers to master Data Structures & Algorithms
            </p>
            <div className="flex justify-center space-x-6 text-sm text-gray-400">
              <Link href="/about" className="hover:text-orange-400 transition-colors">About</Link>
              <Link href="/contact" className="hover:text-orange-400 transition-colors">Contact</Link>
              <Link href="/privacy" className="hover:text-orange-400 transition-colors">Privacy</Link>
              <Link href="/terms" className="hover:text-orange-400 transition-colors">Terms</Link>
            </div>
            <div className="mt-8 pt-8 border-t border-orange-900 text-center text-gray-400 text-sm">
              © 2025 Problem Pit. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}