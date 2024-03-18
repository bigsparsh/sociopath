import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Hono } from "hono";
import authMiddleware from "../middlewares/auth";

export const postRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  }
}>();

postRouter.use(authMiddleware);
postRouter.post('/create', async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const body = await c.req.json();

  const post = await prisma.post.create({
    data: {
      description: body.description,
      post_image: body.post_image,
      user_id: body.user_id
    },
  });

  return c.json({
    message: "POST created",
    post: post
  })
})

postRouter.get('/getPreferences', async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const filterId = c.req.query("filterId") || "";
  if (filterId != "") {
    const likes = await prisma.postPreference.count({
      where: {
        post_id: filterId,
        preference: true
      }
    })
    const dislikes = await prisma.postPreference.count({
      where: {
        post_id: filterId,
        preference: false
      }
    })
    const comments = await prisma.comment.count({
      where: {
        post_id: filterId
      }
    })
    return c.json({
      positive: likes,
      negative: dislikes,
      comments: comments
    })
  }
  return c.json({
    error: "Send Post ID in order to find the preferences"
  })

});

postRouter.get('/get', async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const filterId = c.req.query("filterId") || "";
  if (filterId != "") {
    const post = await prisma.post.findUnique({
      where: {
        post_id: filterId
      },
      select: {
        post_id: true,
        description: true,
        created_at: true,
        post_image: true,
        user: {
          select: {
            name: true,
            user_id: true,
            friend: true,
            email: true,
            profile_image: true
          }
        },
        comment: true,
        preference: true
      }
    });
    return c.json({
      post: post
    });
  }

  const posts = await prisma.post.findMany({
    select: {
      post_id: true,
      description: true,
      created_at: true,
      post_image: true,
      user: {
        select: {
          name: true,
          user_id: true,
          friend: true,
          email: true,
          profile_image: true
        }
      },
      comment: true,
      preference: true
    }
  });
  return c.json({
    posts: posts
  });

});

postRouter.delete('/delete', async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const filterId = c.req.query("filterId") || "";
  if (filterId != "") {
    const post = await prisma.post.delete({
      where: {
        post_id: filterId
      }
    })
    return c.json({
      message: "Successfully Deleted POST!",
      response: post
    })
  }
  return c.json({
    message: "Kindly, Send a filter ID to indentify the post to delete"
  })

});

postRouter.put('/updatePreference', async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const body = await c.req.json();
  const preference = await prisma.postPreference.create({
    data: {
      post_id: body.post_id,
      preference: body.preference,
      user_id: body.user_id
    }
  })

  return c.json({
    message: "Post preference updated Successfully",
    data: preference
  })

});

postRouter.put('/update', async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const filterId = c.req.query("filterId");
  const updatedPost = await c.req.json();

  await prisma.post.update({
    where: {
      post_id: filterId
    },
    data: {
      description: updatedPost.description,
      post_image: updatedPost.post_image,
      user_id: updatedPost.user_id
    }
  });

  return c.json({
    message: "Post updated Successfully",
  })

});




