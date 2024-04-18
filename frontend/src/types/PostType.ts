interface Post {
  post_id: string;
  description: string;
  is_question: boolean;
  created_at: string;
  post_image: string;
  comment_enabled: boolean;
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
    user: true;
    is_answer: boolean;
    comment_id: string;
    message: string;
    created_at: string;
    post_id: string;
    user_id: string;
  }[];
  preference: {
    user: true;
    p_preference_id: string;
    post_id: string;
    preference: boolean;
    user_id: string;
  }[];
  tag: {
    tag_id: string;
    post_id: string;
    name: string;
  }[];
}
export default Post;
