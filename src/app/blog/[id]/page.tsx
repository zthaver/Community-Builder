'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState, type FormEvent } from 'react';
import {
  getBlogComments,
  getSlugifiedblogData,
  handleSubmitComment,
} from '../actions';
import Comments from '../../components/Comments';
import Image from 'next/image';
import Link from 'next/link';
import { Textarea } from '../../../../@/components/ui/textarea';
import { Button } from '../../components/ui/button';
import { ArrowLeftIcon, SendIcon, MessageSquareIcon, Loader2Icon } from 'lucide-react';

type BlogImage = {
  formats: {
    large: {
      url: string;
    };
  };
};

export type Blog = {
  blogImage: BlogImage;
  id: string;
  articleTitle: string;
  articleText: string;
};

const Blog = () => {
  const [postData, setPostData] = useState<Blog>();
  const [comments, setComments] = useState<Comment[] | null>(null);
  const [commentText, setCommentText] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const params = useParams();

  const submitComment = async (e: FormEvent) => {
    e.preventDefault();
    if (!params?.id) return;
    if (!commentText.trim()) return;

    setIsSubmitting(true);
    const res = await handleSubmitComment(
      params.id as string,
      commentText.trim(),
    );
    if (res.error) {
      console.error('Error saving comment', res.error);
    }

    setCommentText('');
    const commentsResp = await getBlogComments(params.id as string);
    setComments(commentsResp.data);
    setIsSubmitting(false);
  };

  useEffect(() => {
    const fetchblogData = async () => {
      if (!params?.id) return;
      const blogData = await getSlugifiedblogData(params.id as string);
      const comments = await getBlogComments(params.id as string);
      setPostData(blogData.data);
      setComments(comments.data);
    };

    fetchblogData();
  }, [params.id]);

  if (!postData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2Icon className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-xl text-gray-600">Loading article...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <article className="max-w-4xl mx-auto px-4">
        {/* Back Button */}
        <Link 
          href="/blog"
          className="inline-flex items-center gap-2 text-lg text-blue-600 hover:text-blue-800 font-medium mb-6 py-2"
        >
          <ArrowLeftIcon size={24} />
          Back to All Articles
        </Link>

        {/* Main Article Card */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Blog Image */}
          {postData.blogImage?.formats?.large?.url ? (
            <div className="relative w-full h-80 md:h-96">
              <Image
                src={postData.blogImage.formats.large.url}
                fill
                alt={postData.articleTitle}
                className="object-cover"
              />
            </div>
          ) : null}

          <div className="p-8 md:p-10">
            {/* Article Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
              {postData.articleTitle}
            </h1>

            {/* Article Content */}
            <div className="prose prose-lg max-w-none">
              <p className="text-xl text-gray-700 leading-relaxed whitespace-pre-line">
                {postData.articleText}
              </p>
            </div>
          </div>
        </div>

        {/* Comment Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-10 mt-8">
          <div className="flex items-center gap-3 mb-6">
            <MessageSquareIcon className="w-8 h-8 text-blue-600" />
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              Share Your Thoughts
            </h2>
          </div>
          
          <form onSubmit={submitComment} className="mb-10">
            <label className="block text-lg font-semibold text-gray-700 mb-3">
              Write a comment:
            </label>
            <Textarea
              placeholder="What do you think about this article? Share your thoughts with the community..."
              className="w-full p-5 text-lg border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 resize-none min-h-[150px]"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              rows={5}
            />
            <Button
              type="submit"
              disabled={isSubmitting || !commentText.trim()}
              className="mt-4 bg-blue-600 hover:bg-blue-700 text-white text-xl py-4 px-8 rounded-xl flex items-center gap-3 min-h-[60px] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <Loader2Icon className="w-6 h-6 animate-spin" />
              ) : (
                <SendIcon size={24} />
              )}
              {isSubmitting ? 'Posting...' : 'Post Comment'}
            </Button>
          </form>

          {/* Comments List */}
          <div className="border-t-2 border-gray-200 pt-8">
            <h3 className="text-xl font-bold text-gray-800 mb-6">
              Community Comments
            </h3>
            <Comments data={comments} />
          </div>
        </div>
      </article>
    </div>
  );
};

export default Blog;
