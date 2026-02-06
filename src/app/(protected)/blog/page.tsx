'use client'

import React, { useEffect, useState } from 'react'

import ArticleCard from '../../components/ArticleCard';

import {getblogData} from "../../blog/actions";

const  Blog =  () => {
  const [postData,setPostData] = useState<any[]>([]);
  useEffect(()=>{
    const fetchblogData = async () =>{
    const blogData = await getblogData();
    setPostData(blogData.data);
    }

    fetchblogData();

  },[])

  return (
    <div className='flex flex-wrap p-10'>
      {postData.map((post: any) => (
        <div className = "flex-shrink p-5"key={post.id}>
          <ArticleCard articleData={post}/>
        </div>
      ))}
      </div>
  )
}

export default Blog;