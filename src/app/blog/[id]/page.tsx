'use client'

import { useParams } from 'next/navigation';
import { useEffect, useLayoutEffect, useState, type FormEvent } from 'react';
import { getBlogComments, getSlugifiedblogData, handleSubmitComment } from '../actions';
import Comments from '../../components/Comments';
import Image from 'next/image';
import { Textarea } from "../../../../@/components/ui/textarea" // Update the import path as needed
import { Button } from '../../components/ui/button';

export type Blog = {
  blogImage: any;
  id: string;
  articleTitle: string;
  articleText: string;
};

const Blog = () => {
  const [postData, setPostData] = useState<Blog>();
  const [comments, setComments] = useState<any[] | null>(null);
   const [commentText, setCommentText] = useState<string>('');
  const params = useParams();

  const submitComment = async (e: FormEvent) => {
    e.preventDefault();
    if (!params?.id) return;
    if (!commentText.trim()) return;

    const res = await handleSubmitComment(params.id as string, commentText.trim());
    if (res.error) {
      console.error('Error saving comment', res.error);
    }

    setCommentText('');
    const commentsResp = await getBlogComments(params.id as string);
    setComments(commentsResp.data);
  };

  useEffect(() => {

    const fetchblogData = async () => {
      if (!params?.id) return;
      const blogData = await getSlugifiedblogData((params.id) as string);
      const comments= await getBlogComments((params.id) as string);
      setPostData(blogData.data);
      setComments(comments.data)
    }

    fetchblogData();

  }, [params.id])
  if (!postData) {
    return <p>Loading…</p>; // avoid rendering undefined
  }

  return (
   <article className="max-w-4xl mx-auto p-6 bg-white rounded-2xl shadow-md space-y-6 m-6">
  {/* Blog Image */}
  {postData.blogImage?.formats?.large?.url ? (
    <div className="overflow-hidden rounded-xl shadow-lg">
      <Image
        src={postData.blogImage.formats.large.url}
        height={1000}
        width={1000}
        alt={postData.articleTitle}
        className="w-full h-auto object-cover"
      />
    </div>
  ) : null}

  {/* Article Title */}
  <h1 className="text-4xl font-bold text-gray-900 break-words">
    {postData.articleTitle}
  </h1>

  {/* Article Content */}
  <div className="max-w-full">
    <p className="text-gray-700 text-lg leading-relaxed break-words whitespace-pre-line">
      {postData.articleText}
    </p>
  </div>

  {/* Comment Section */}
  <div className="mt-8">
    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Add a Comment</h2>
    <form onSubmit={submitComment}>
      <Textarea
        placeholder="Write your comment here..."
        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
        value={commentText}
        onChange={e => setCommentText(e.target.value)}
        rows={5}
      />
      <Button type='submit' className="mt-3 bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600">
        Submit Comment
      </Button>
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Comments</h2>
      <Comments data={comments}/> 
    </form>
  </div>
</article>

  );

}

export default Blog;


