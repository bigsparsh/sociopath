interface Comment {
  comment_id: string;
  is_answer: boolean;
  message: string;
  created_at: string;
  user: User;
  preference: Preference[];
}

interface User {
  user_id: string;
  name: string;
  email: string;
  password: string;
  bio: string;
  profile_image: string;
  phone: string;
  address: string;
  appreciate_mode: string;
}

interface Preference {
  preference: boolean;
  user: User;
}

export default Comment;
