'use client';

import React, { useEffect, useState } from 'react';
import ArticleCard from '../../components/ArticleCard';
import { getblogData } from '../../../utils/blog/actions';
import { BookOpenIcon, Loader2Icon, AlertCircleIcon } from 'lucide-react';
type ArticleData = {
  id: string;
  documentId: string;
  articleTitle: string;
  articleText: string;
  blogImage: {
    formats: {
      small: {
        url: string;
      };
    };
  };
};

const Blog = () => {
  const [postData, setPostData] = useState<ArticleData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchblogData = async () => {
      const blogData = await getblogData();
      if (blogData.error) {
        setError(blogData.error);
      } else {
        setPostData(blogData.data || []);
      }
      setLoading(false);
    };

    fetchblogData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2Icon className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-xl text-gray-600">Loading articles...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center">
          <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-8 max-w-lg mx-auto">
            <AlertCircleIcon className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-red-700 mb-2">Unable to Load Articles</h2>
            <p className="text-lg text-red-600 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="text-center mb-10">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-100 p-4 rounded-full">
              <BookOpenIcon className="w-10 h-10 text-blue-600" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Community Articles</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover helpful articles on health, hobbies, technology, and community news. 
            Click on any article to read more and join the conversation.
          </p>
        </div>

        {/* Articles Grid */}
        {postData.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-xl text-gray-500">No articles available yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {postData.map((post: ArticleData) => (
              <ArticleCard key={post.id} articleData={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Blog;
