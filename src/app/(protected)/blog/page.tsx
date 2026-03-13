'use client';

import React, { useEffect, useState } from 'react';
import ArticleCard from '../../components/ArticleCard';
import { getblogData } from '../../blog/actions';
import { BookOpenIcon, Loader2Icon } from 'lucide-react';

const Blog = () => {
  const [postData, setPostData] = useState<ArticleData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchblogData = async () => {
      const blogData = await getblogData();
      setPostData(blogData.data || []);
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
