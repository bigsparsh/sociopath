import axios from "axios"

export const removePreference = async (user_id, post_id) => {
  await axios.delete(import.meta.env.VITE_BACKEND_URL+ "/post/removePreference", {
    data: {
      user_id: user_id,
      post_id: post_id
    },
    headers: {
      Authorization: localStorage.getItem("auth-token")
    }
  }) 
}

export const updatePreference = async (user_id, post_id, preference) => {
  await axios.put(import.meta.env.VITE_BACKEND_URL + "/post/updatePreference", {
      user_id: user_id,
      post_id: post_id,
      preference: preference
    },{
    headers: {
      Authorization: localStorage.getItem("auth-token")
    }
  })
}

