import React from 'react';

import Image from 'next/image';
import Link from 'next/link';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../components/ui/card';
import { ArrowRightIcon } from 'lucide-react';

type ArticleData = {
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

const ArticleCard = (articleData: ArticleData) => {
  let imageUrl: string = '/image.png';
  if (articleData.articleData.blogImage?.formats?.small) {
    imageUrl = articleData.articleData.blogImage.formats.small.url;
  }

  const articleUrl = `/blog/${articleData.articleData.documentId}`;

  return (
    <Card className="w-full max-w-md flex flex-col bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow overflow-hidden">
      {/* Image */}
      <div className="relative w-full h-56">
        <Image 
          src={imageUrl} 
          alt={articleData.articleData.articleTitle || 'Article image'} 
          fill
          className="object-cover"
        />
      </div>
      
      <CardHeader className="p-6">
        <CardTitle className="text-2xl font-bold text-gray-900 leading-tight mb-3">
          {articleData.articleData.articleTitle}
        </CardTitle>
        <CardDescription className="text-lg text-gray-600 line-clamp-3 leading-relaxed">
          {articleData.articleData.articleText}
        </CardDescription>
      </CardHeader>
      
      <CardFooter className="p-6 pt-0 mt-auto">
        <Link
          href={articleUrl}
          className="w-full flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white text-xl font-semibold py-4 px-6 rounded-xl transition-colors min-h-[56px]"
        >
          Read Article
          <ArrowRightIcon size={24} />
        </Link>
      </CardFooter>
    </Card>
  );
};

export default ArticleCard;
