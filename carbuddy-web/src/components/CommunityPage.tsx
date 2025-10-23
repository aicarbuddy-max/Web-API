import { useState } from 'react';
import { Heart, MessageCircle, Share2, Plus } from 'lucide-react';
import { Card } from './ui/card';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { toast } from 'sonner@2.0.3';

interface CommunityPageProps {
  isDarkMode: boolean;
}

const initialPosts = [
  {
    id: 1,
    author: 'Mike Johnson',
    avatar: 'MJ',
    time: '2h ago',
    content: 'Just got my oil changed at AutoCare Pro. Amazing service and quick turnaround! Highly recommend for routine maintenance.',
    likes: 24,
    comments: 5,
  },
  {
    id: 2,
    author: 'Sarah Williams',
    avatar: 'SW',
    time: '5h ago',
    content: 'Does anyone know a good place for brake service in downtown? Looking for honest pricing and quality work.',
    likes: 12,
    comments: 8,
  },
  {
    id: 3,
    author: 'Tom Anderson',
    avatar: 'TA',
    time: '1d ago',
    content: 'PSA: Check your tire pressure regularly! Just avoided a potential blowout thanks to routine checks. Stay safe out there! 🚗',
    likes: 45,
    comments: 12,
  },
  {
    id: 4,
    author: 'Emily Chen',
    avatar: 'EC',
    time: '2d ago',
    content: 'Elite Motors gave me exceptional service on my transmission repair. They explained everything clearly and finished ahead of schedule.',
    likes: 18,
    comments: 3,
  },
];

export function CommunityPage({ isDarkMode }: CommunityPageProps) {
  const [posts, setPosts] = useState(initialPosts);
  const [newPostContent, setNewPostContent] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleAddPost = () => {
    if (newPostContent.trim()) {
      const newPost = {
        id: posts.length + 1,
        author: 'You',
        avatar: 'YO',
        time: 'Just now',
        content: newPostContent,
        likes: 0,
        comments: 0,
      };
      setPosts([newPost, ...posts]);
      setNewPostContent('');
      setIsDialogOpen(false);
      toast.success('Post added successfully!');
    }
  };

  const handleLike = (postId: number) => {
    setPosts(posts.map(post => 
      post.id === postId ? { ...post, likes: post.likes + 1 } : post
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className={isDarkMode ? 'text-gray-100' : 'text-gray-900'}>Community</h2>
          <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
            Share experiences and ask questions
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              className={`rounded-full ${isDarkMode ? 'bg-orange-600 hover:bg-orange-700' : 'bg-orange-600 hover:bg-orange-700'}`}
            >
              <Plus className="w-5 h-5" />
            </Button>
          </DialogTrigger>
          <DialogContent className={isDarkMode ? 'bg-gray-900 border-gray-800 text-gray-100' : 'bg-white'}>
            <DialogHeader>
              <DialogTitle>Create New Post</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <Textarea
                placeholder="Share your thoughts, questions, or experiences..."
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                className={`min-h-32 ${isDarkMode ? 'bg-gray-800 border-gray-700 text-gray-100' : ''}`}
              />
              <div className="flex gap-2 justify-end">
                <Button
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAddPost}
                  className="bg-orange-600 hover:bg-orange-700"
                >
                  Post
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {posts.map((post) => (
          <Card
            key={post.id}
            className={`p-4 ${isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}
          >
            <div className="flex gap-3 mb-3">
              <Avatar>
                <AvatarFallback className={isDarkMode ? 'bg-orange-900 text-orange-300' : 'bg-orange-100 text-orange-700'}>
                  {post.avatar}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h4 className={isDarkMode ? 'text-gray-100' : 'text-gray-900'}>{post.author}</h4>
                  <span className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                    {post.time}
                  </span>
                </div>
              </div>
            </div>

            <p className={`mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              {post.content}
            </p>

            <div className="flex gap-6">
              <button
                onClick={() => handleLike(post.id)}
                className={`flex items-center gap-2 ${isDarkMode ? 'text-gray-400 hover:text-red-400' : 'text-gray-600 hover:text-red-600'} transition-colors`}
              >
                <Heart className="w-5 h-5" />
                <span>{post.likes}</span>
              </button>
              <button className={`flex items-center gap-2 ${isDarkMode ? 'text-gray-400 hover:text-orange-400' : 'text-gray-600 hover:text-orange-600'} transition-colors`}>
                <MessageCircle className="w-5 h-5" />
                <span>{post.comments}</span>
              </button>
              <button className={`flex items-center gap-2 ${isDarkMode ? 'text-gray-400 hover:text-green-400' : 'text-gray-600 hover:text-green-600'} transition-colors`}>
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
