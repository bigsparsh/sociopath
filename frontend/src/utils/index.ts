import axios from "axios"


export const removePostPreference = async (user_id, post_id) => {
  await axios.delete(import.meta.env.VITE_BACKEND_URL + "/post/removePreference", {
    data: {
      user_id: user_id,
      post_id: post_id
    },
    headers: {
      Authorization: localStorage.getItem("auth-token")
    }
  })
}

export const uploadComment = async (user_id, post_id, message) => {
  await axios.post(import.meta.env.VITE_BACKEND_URL + "/comment/create", {
    user_id: user_id,
    post_id: post_id,
    message: message
  }, {
    headers: {
      Authorization: localStorage.getItem("auth-token")
    }
  })
}

export const updatePostPreference = async (user_id, post_id, preference) => {
  await axios.put(import.meta.env.VITE_BACKEND_URL + "/post/updatePreference", {
    user_id: user_id,
    post_id: post_id,
    preference: preference
  }, {
    headers: {
      Authorization: localStorage.getItem("auth-token")
    }
  })
}

export const removeCommentPreference = async (user_id, comment_id) => {
  await axios.delete(import.meta.env.VITE_BACKEND_URL + "/comment/removePreference", {
    data: {
      user_id: user_id,
      post_id: comment_id
    },
    headers: {
      Authorization: localStorage.getItem("auth-token")
    }
  })
}

export const updateCommentPreference = async (user_id, comment_id, preference) => {
  await axios.put(import.meta.env.VITE_BACKEND_URL + "/comment/updatePreference", {
    user_id: user_id,
    comment_id: comment_id,
    preference: preference
  }, {
    headers: {
      Authorization: localStorage.getItem("auth-token")
    }
  })
}

export const logout = (navigator) => {
  navigator("/");
  localStorage.clear();
}
