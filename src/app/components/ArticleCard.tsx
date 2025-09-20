import React from "react"

import Image from 'next/image'

import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button";
import { StaticImport } from "next/dist/shared/lib/get-img-props";
import { redirect } from 'next/navigation'

const ArticleCard = (articleData:any) => {
         console.log(articleData.articleData.blogImage.formats.small.url);
         let imageUrl: string = "/image.png";
         if(articleData.articleData.blogImage.formats.small)
         {
             imageUrl = articleData.articleData.blogImage.formats.small.url
         }
         
    return (
       <Card className="max-w-400 flex justify-between flex-shrink min-h-100">
      <CardHeader>
        <div className="flex object-fit:cover flex-col flex-shrink-0">
          <Image
          src={imageUrl} 
          alt="blogTitle"
          width={600}
          height={400}/>
        </div>
        <CardTitle>{articleData.articleData.articleTitle}</CardTitle>
        <CardDescription className="line-clamp-3">{articleData.articleData.articleText}</CardDescription>
      </CardHeader>
      <CardFooter className="flex">
        <Button type="submit"  onClick ={ () =>directToArticle(articleData.articleData)}variant="ghost" className="w-full">
          VIEW POST
        </Button>
      </CardFooter>
    </Card>
    )

    function directToArticle(data:any)
    {
      console.log(data.documentId)
      let id:string = "/blog/" + data.documentId;
      redirect(id);
    }
}


export default ArticleCard;