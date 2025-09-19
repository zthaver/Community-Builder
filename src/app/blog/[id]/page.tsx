'use client'

import { useParams } from 'next/navigation';

const Blog = () => {
  const params = useParams()
  return <p>Post: {params.id}</p>

}

export default Blog;


