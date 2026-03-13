import { createClient } from '../../utils/supabase/server';
import Link from 'next/link';
import { Button } from './components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from './components/ui/card';
import { BookIcon, CalendarIcon, MessageCircleIcon, UsersIcon, HeartIcon, SparklesIcon } from 'lucide-react';

export default async function Home() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  const isLoggedIn = !!data.user;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <section className="px-6 py-16 md:py-24 max-w-6xl mx-auto text-center">
        <div className="flex justify-center mb-6">
          <div className="bg-blue-100 p-4 rounded-full">
            <UsersIcon className="w-12 h-12 text-blue-600" />
          </div>
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
          Welcome to Community Builder
        </h1>
        
        <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
          A warm and welcoming online community designed especially for seniors. 
          Connect with others, stay informed, and participate in events — all in one easy-to-use place.
        </p>

        {!isLoggedIn ? (
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-8 py-6">
              <Link href="/login">Join Our Community</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="bg-gray-700 hover:bg-gray-800 text-white border-gray-700 text-lg px-8 py-6">
              <Link href="/login">Sign In</Link>
            </Button>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-8 py-6">
              <Link href="/blog">Read Articles</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="bg-gray-700 hover:bg-gray-800 text-white border-gray-700 text-lg px-8 py-6">
              <Link href="/calendar">View Events</Link>
            </Button>
          </div>
        )}
      </section>

      {/* Features Section */}
      <section className="px-6 py-16 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-4">
            What You Can Do Here
          </h2>
          <p className="text-lg text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            Our community offers simple and enjoyable ways to stay connected and engaged.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-center mb-4">
                  <div className="bg-green-100 p-3 rounded-full">
                    <BookIcon className="w-8 h-8 text-green-600" />
                  </div>
                </div>
                <CardTitle className="text-xl">Read Articles</CardTitle>
                <CardDescription className="text-base">
                  Discover helpful articles on health, hobbies, technology tips, and community news.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="link" className="text-blue-600">
                  <Link href="/blog">Browse Articles →</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-center mb-4">
                  <div className="bg-purple-100 p-3 rounded-full">
                    <CalendarIcon className="w-8 h-8 text-purple-600" />
                  </div>
                </div>
                <CardTitle className="text-xl">Join Events</CardTitle>
                <CardDescription className="text-base">
                  Find local and online events, workshops, and social gatherings to participate in.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="link" className="text-blue-600">
                  <Link href="/calendar">View Calendar →</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-center mb-4">
                  <div className="bg-orange-100 p-3 rounded-full">
                    <MessageCircleIcon className="w-8 h-8 text-orange-600" />
                  </div>
                </div>
                <CardTitle className="text-xl">Share & Comment</CardTitle>
                <CardDescription className="text-base">
                  Join conversations, share your thoughts, and connect with fellow community members.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="link" className="text-blue-600">
                  <Link href="/blog">Start Chatting →</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How to Use Section */}
      <section className="px-6 py-16 bg-blue-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-4">
            How to Get Started
          </h2>
          <p className="text-lg text-gray-600 text-center mb-12">
            Getting started is easy! Follow these simple steps:
          </p>

          <div className="space-y-6">
            {!isLoggedIn ? (
              <>
                <StepCard 
                  step={1} 
                  title="Create Your Account" 
                  description="Click 'Join Our Community' and fill in your details. You'll need an email address and password."
                />
                <StepCard 
                  step={2} 
                  title="Explore the Articles" 
                  description="Click on 'Articles' in the menu bar at the top to read interesting stories and helpful information."
                />
                <StepCard 
                  step={3} 
                  title="Check the Events Calendar" 
                  description="Click on 'Events' to see upcoming activities. You can find both online and in-person events."
                />
                <StepCard 
                  step={4} 
                  title="Join the Conversation" 
                  description="Leave comments on articles to share your thoughts and connect with other members."
                />
              </>
            ) : (
              <>
                <StepCard 
                  step={1} 
                  title="Read Today's Articles" 
                  description="Click on 'Articles' in the menu to discover new content. Take your time reading — there's no rush!"
                />
                <StepCard 
                  step={2} 
                  title="Check Upcoming Events" 
                  description="Visit the 'Events' page to see what's happening this week. Mark your favorites so you don't forget!"
                />
                <StepCard 
                  step={3} 
                  title="Share Your Thoughts" 
                  description="Found an interesting article? Scroll down and leave a comment to share your perspective with others."
                />
                <StepCard 
                  step={4} 
                  title="Come Back Often" 
                  description="New articles and events are added regularly. Make it a habit to check in and stay connected!"
                />
              </>
            )}
          </div>
        </div>
      </section>

      {/* Why Join Section (for non-logged in users) */}
      {!isLoggedIn && (
        <section className="px-6 py-16 bg-white">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12">
              Why Join Our Community?
            </h2>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div className="flex items-start gap-4 text-left">
                <div className="bg-red-100 p-2 rounded-full shrink-0">
                  <HeartIcon className="w-6 h-6 text-red-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Built for Seniors</h3>
                  <p className="text-gray-600">Large text, simple navigation, and a clean design make everything easy to read and use.</p>
                </div>
              </div>

              <div className="flex items-start gap-4 text-left">
                <div className="bg-blue-100 p-2 rounded-full shrink-0">
                  <UsersIcon className="w-6 h-6 text-blue-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Friendly Community</h3>
                  <p className="text-gray-600">Connect with like-minded people who share your interests and experiences.</p>
                </div>
              </div>

              <div className="flex items-start gap-4 text-left">
                <div className="bg-green-100 p-2 rounded-full shrink-0">
                  <SparklesIcon className="w-6 h-6 text-green-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Always Free</h3>
                  <p className="text-gray-600">Our community is completely free to join and use. No hidden fees or subscriptions.</p>
                </div>
              </div>

              <div className="flex items-start gap-4 text-left">
                <div className="bg-purple-100 p-2 rounded-full shrink-0">
                  <CalendarIcon className="w-6 h-6 text-purple-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Stay Active</h3>
                  <p className="text-gray-600">Regular events and fresh content help you stay engaged and connected.</p>
                </div>
              </div>
            </div>

            <div className="mt-12">
              <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-8 py-6">
                <Link href="/login">Join Our Community Today</Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="px-6 py-8 bg-gray-100 text-center">
        <p className="text-gray-600">
          Community Builder — Connecting Seniors, Building Friendships
        </p>
        <p className="text-gray-500 text-sm mt-2">
          Need help? Contact us at support@communitybuilder.com
        </p>
      </footer>
    </div>
  );
}

function StepCard({ step, title, description }: { step: number; title: string; description: string }) {
  return (
    <div className="flex items-start gap-4 bg-white p-6 rounded-xl shadow-sm">
      <div className="bg-blue-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg shrink-0">
        {step}
      </div>
      <div>
        <h3 className="font-semibold text-xl text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 text-lg">{description}</p>
      </div>
    </div>
  );
}
