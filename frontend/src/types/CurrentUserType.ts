interface User {
  name: string;
  email: string;
  phone: string;
  address: string;
  comment: Comment[];
  comment_preference: CommentPreference[];
  post: Post[];
  post_preference: PostPreference[];
  bio: string;
  friend: Friend[];
  profile_image: string;
  user_id: string;
  appreciate_mode: "Likes" | "Dislikes" | "Upvotes" | "Downvotes"; // Adjusted appreciate_mode to include Upvotes and Downvotes
  password: string;
}

interface Comment {
  comment_id: string;
  is_answer: string;
  message: string;
  created_at: string;
  post_id: string;
  user_id: string;
}

interface CommentPreference {
  c_preference_id: string;
  comment_id: string;
  preference: boolean;
  user_id: string;
}

interface Post {
  post_id: string;
  created_at: string;
  description: string;
  post_image: string;
  user_id: string;
  is_question: string;
}

interface PostPreference {
  p_preference_id: string;
  post_id: string;
  preference: boolean;
  user_id: string;
}

interface Friend {
  friend_id: string;
  user1_id: string;
  user2_id: string;
  mutual: boolean;
}

export default User;
