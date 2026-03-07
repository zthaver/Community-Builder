import { UserCircleIcon } from 'lucide-react';

const Comments = ({ data }: { data: any[] | null }) => {
  if (!data || data.length === 0) {
    return (
      <div className="bg-gray-50 rounded-xl p-6 text-center">
        <p className="text-lg text-gray-500">No comments yet. Be the first to share your thoughts!</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {data.map((comment: any) => (
        <div 
          key={comment.comment_id} 
          className="bg-gray-50 rounded-xl p-5 border-l-4 border-blue-400"
        >
          <div className="flex items-center gap-3 mb-3">
            <UserCircleIcon className="w-8 h-8 text-blue-500" />
            <span className="text-xl font-semibold text-gray-800">
              {comment.user_name}
            </span>
          </div>
          <p className="text-lg text-gray-700 leading-relaxed pl-11">
            {comment.comment_text}
          </p>
        </div>
      ))}
    </div>
  );
};

export default Comments;
