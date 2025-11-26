'use client'

import { useParams } from 'next/navigation';
import { useEffect, useLayoutEffect, useState } from 'react';
import { getSlugifiedblogData } from '../actions';
import Image from 'next/image';

export type Blog = {
  blogImage: any;
  id: string;
  articleTitle: string;
  articleText: string;
};

const Blog = () => {
  const [postData,setPostData] = useState<Blog>();
  const params = useParams();
  useEffect(()=>{

    const fetchblogData = async () =>{
    if (!params?.id) return;
    const blogData = await getSlugifiedblogData((params.id)as string);
    setPostData(blogData.data);
    }

    fetchblogData();

  },[params.id])
  if (!postData) {
    return <p>Loading…</p>; // avoid rendering undefined
  }

  return (
    <article>
      <Image 
      src={postData.blogImage.formats.large.url}
      height={1000}
      width={1000}
      alt={postData.articleTitle}>

      </Image>
      <h1>{postData.articleTitle}</h1>
      <p>{postData.articleText}</p>
    </article>
  );

}

export default Blog;


