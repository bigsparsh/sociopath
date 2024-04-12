interface User {
  user_id: string;
  friend: {
    user1_id: string;
    user2_id: string;
    mutual: boolean;
    friend_id: string;
  }[];
  name: string;
  email: string;
  password: string;
  bio: string;
  profile_image: string;
  phone: string;
  address: string;
  appreciate_mode: "Likes" | "Upvotes";
  _count: {
    post: number;
    comment: number;
    post_preference: number;
    comment_preference: number;
    user2: number;
  };
}
export default User;
