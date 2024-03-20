interface Post {
  post_id: string;
  description: string;
  created_at: string;
  post_image: string;
  user: {
    name: string;
    user_id: string;
    friend: {
      friend_id: string;
      user1_id: string;
      user2_id: string;
      mutual: boolean;
    }[];
    email: string;
    profile_image: string;
  };
  comment: {
    comment_id: string;
    message: string;
    created_at: string;
    post_id: string;
    user_id: string;
  }[];
  preference: {
    p_preference_id: string;
    post_id: string;
    preference: boolean;
    user_id: string;
  }[];
}
export default Post;
