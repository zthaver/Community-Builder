import { createClient } from '../../../utils/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Button } from '../components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '../components/ui/card';
import { BookIcon, CalendarIcon, MessageCircleIcon, SunIcon } from 'lucide-react';

export default async function HomePage() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  
  if (!data.user) {
    redirect('/login');
  }

  const userName = data.user.email?.split('@')[0] || 'Friend';
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening';

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      {/* Welcome Section */}
      <section className="px-6 py-12 max-w-5xl mx-auto">
        <div className="flex items-center gap-3 mb-2">
          <SunIcon className="w-8 h-8 text-amber-500" />
          <span className="text-lg text-gray-600">{greeting}</span>
        </div>
        
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Welcome back, {userName}!
        </h1>
        
        <p className="text-xl text-gray-600 mb-8">
          Great to see you again. Here's what you can do today:
        </p>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-green-500">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-green-100 p-2 rounded-full">
                  <BookIcon className="w-6 h-6 text-green-600" />
                </div>
                <CardTitle className="text-xl">Read Articles</CardTitle>
              </div>
              <CardDescription className="text-base">
                Discover new stories, health tips, and community news written just for you.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full bg-green-600 hover:bg-green-700">
                <Link href="/blog">Browse Articles</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-purple-500">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-purple-100 p-2 rounded-full">
                  <CalendarIcon className="w-6 h-6 text-purple-600" />
                </div>
                <CardTitle className="text-xl">Upcoming Events</CardTitle>
              </div>
              <CardDescription className="text-base">
                Check out workshops, social gatherings, and activities happening soon.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full bg-purple-600 hover:bg-purple-700">
                <Link href="/calendar">View Calendar</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-orange-500">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-orange-100 p-2 rounded-full">
                  <MessageCircleIcon className="w-6 h-6 text-orange-600" />
                </div>
                <CardTitle className="text-xl">Join Discussions</CardTitle>
              </div>
              <CardDescription className="text-base">
                Share your thoughts and connect with other community members.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full bg-orange-600 hover:bg-orange-700">
                <Link href="/blog">Start Chatting</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Tips Section */}
      <section className="px-6 py-12 bg-blue-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Reminders</h2>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white p-5 rounded-xl shadow-sm">
              <h3 className="font-semibold text-lg mb-2">Navigation Tips</h3>
              <ul className="text-gray-600 space-y-2">
                <li>• Use the menu bar at the top to move between pages</li>
                <li>• Click "Home" to return to this page anytime</li>
                <li>• The "Logout" button is in the top-right corner</li>
              </ul>
            </div>
            
            <div className="bg-white p-5 rounded-xl shadow-sm">
              <h3 className="font-semibold text-lg mb-2">Staying Connected</h3>
              <ul className="text-gray-600 space-y-2">
                <li>• New articles are posted regularly — check back often!</li>
                <li>• Leave comments to share your perspective</li>
                <li>• Check the calendar for upcoming events</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
