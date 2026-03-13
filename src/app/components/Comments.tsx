import { UserCircleIcon } from 'lucide-react';

export type Comment = {
  comment_id: string;
  user_id: string;
  article_id: string;
  user_name: string;
  comment_text: string;
};

const Comments = ({ data }: { data: Comment[] | null }) => {
  if (!data || data.length === 0) {
    return (
      <div className="bg-gray-50 rounded-xl p-6 text-center" role="status">
        <p className="text-lg text-gray-500">No comments yet. Be the first to share your thoughts!</p>
      </div>
    );
  }
  
  return (
    <section aria-label={`${data.length} comment${data.length !== 1 ? 's' : ''}`}>
      <div className="space-y-4" role="feed" aria-busy="false">
        {data.map((comment: Comment, index: number) => (
          <article
            key={comment.comment_id} 
            className="bg-gray-50 rounded-xl p-5 border-l-4 border-blue-400"
            aria-labelledby={`comment-author-${comment.comment_id}`}
            aria-posinset={index + 1}
            aria-setsize={data.length}
          >
            <div className="flex items-center gap-3 mb-3">
              <UserCircleIcon className="w-8 h-8 text-blue-500" aria-hidden="true" />
              <span 
                id={`comment-author-${comment.comment_id}`}
                className="text-xl font-semibold text-gray-800"
              >
                {comment.user_name}
                <span className="sr-only"> wrote:</span>
              </span>
            </div>
            <p className="text-lg text-gray-700 leading-relaxed pl-11">
              {comment.comment_text}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
};

export default Comments;
