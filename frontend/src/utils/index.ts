import axios from "axios";
import CommentType from "../types/CommentType";
import { NavigateFunction } from "react-router-dom";

export const removePostPreference = async (
  user_id: string | undefined,
  post_id: string,
) => {
  await axios.delete(
    import.meta.env.VITE_BACKEND_URL + "/post/removePreference",
    {
      data: {
        user_id: user_id,
        post_id: post_id,
      },
      headers: {
        Authorization: localStorage.getItem("auth-token"),
      },
    },
  );
};

export const uploadComment = (
  user_id: string | undefined,
  post_id: string,
  message: string,
): Promise<CommentType> | void => {
  axios
    .post(
      import.meta.env.VITE_BACKEND_URL + "/comment/create",
      {
        user_id: user_id,
        post_id: post_id,
        message: message,
      },
      {
        headers: {
          Authorization: localStorage.getItem("auth-token"),
        },
      },
    )
    .then((res) => {
      return res.data.comment;
    });
};

export const updatePostPreference = async (
  user_id: string | undefined,
  post_id: string,
  preference: boolean,
) => {
  await axios.put(
    import.meta.env.VITE_BACKEND_URL + "/post/updatePreference",
    {
      user_id: user_id,
      post_id: post_id,
      preference: preference,
    },
    {
      headers: {
        Authorization: localStorage.getItem("auth-token"),
      },
    },
  );
};

export const removeCommentPreference = async (
  user_id: string | undefined,
  comment_id: string,
) => {
  await axios.delete(
    import.meta.env.VITE_BACKEND_URL + "/comment/removePreference",
    {
      data: {
        user_id: user_id,
        post_id: comment_id,
      },
      headers: {
        Authorization: localStorage.getItem("auth-token"),
      },
    },
  );
};

export const updateCommentPreference = async (
  user_id: string | undefined,
  comment_id: string,
  preference: boolean,
) => {
  await axios.put(
    import.meta.env.VITE_BACKEND_URL + "/comment/updatePreference",
    {
      user_id: user_id,
      comment_id: comment_id,
      preference: preference,
    },
    {
      headers: {
        Authorization: localStorage.getItem("auth-token"),
      },
    },
  );
};

export const logout = (navigator: NavigateFunction) => {
  navigator("/");
  localStorage.clear();
};
