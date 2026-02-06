const Comments = ({ data }: { data: any[] | null }) => {
    console.log(data)
    if (!data) return null;
    return <>{data.map((comment: any) => 
    <div key={comment.comment_id} className="border-b border-gray-200 py-2">
        <h1 className="font-semibold">{comment.user_name} Said</h1>
        <h2 className="text-lg">{comment.comment_text}</h2>
    </div>)}</>
}

export default Comments;