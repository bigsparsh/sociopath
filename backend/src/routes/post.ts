import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Hono } from "hono";
import authMiddleware from "../middlewares/auth";

export const postRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
}>();

const postReturnContent = {
  post_id: true,
  description: true,
  is_question: true,
  created_at: true,
  post_image: true,
  tag: true,
  delete: true,
  comment_enabled: true,
  user: {
    select: {
      name: true,
      user_id: true,
      friend: true,
      email: true,
      profile_image: true,
    },
  },
  comment: {
    select: {
      comment_id: true,
      post_id: true,
      is_answer: true,
      message: true,
      created_at: true,
      user: true,
      user_id: true,
    },
  },
  preference: {
    select: {
      preference: true,
      user: true,
      p_preference_id: true,
      post_id: true,
      user_id: true,
    },
  },
};

postRouter.use(authMiddleware);
postRouter.post("/create", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const body = await c.req.json();

  const post = await prisma.post.create({
    data: {
      description: body.description,
      post_image: body.post_image,
      is_question: body.is_question || false,
      user_id: body.user_id,
      comment_enabled: body.comment_enabled,
    },
  });

  await Promise.all(
    body.tag.map(async (ele: string) => {
      if (ele.trim() == "") {
        return;
      }
      await prisma.tag.create({
        data: {
          post_id: post.post_id,
          name: ele.trim(),
        },
      });
    }),
  );

  return c.json({
    message: "POST created",
    post: post,
  });
});

postRouter.delete("/removePreference", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const body = await c.req.json();
  await prisma.postPreference.deleteMany({
    where: {
      NOT: {
        user: {
          delete: true,
        },
        post: {
          delete: true,
        },
      },
      post_id: body.post_id,
      user_id: body.user_id,
    },
  });

  return c.json({
    message: "Preference deleted Successfully",
  });
});
postRouter.post("/search", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const searchParam = c.req.query("searchParam");
  const intake = Number(c.req.query("intake")) || 0;
  const body = await c.req.json();

  if (searchParam == "Appreciation") {
    const appreciationPosts = await prisma.postPreference.groupBy({
      by: ["post_id"],
      orderBy: {
        _count: {
          preference: "desc",
        },
      },
      where: {
        post: {
          user: {
            delete: false,
          },
          delete: false,
        },
        preference: body.appreciationType,
      },
      _count: {
        preference: true,
      },
      skip: intake,
      take: 5,
    });

    const posts = await Promise.all(
      appreciationPosts.map(async (ele) => {
        const post = await prisma.post.findUnique({
          where: {
            user: {
              delete: false,
            },
            delete: false,
            post_id: ele.post_id,
          },
          select: postReturnContent,
        });
        return post;
      }),
    );

    return c.json({
      posts: posts,
    });
  }
  if (searchParam == "User") {
    const user = await prisma.user.findMany({
      where: {
        NOT: {
          delete: true,
        },
        name: {
          contains: body.userName,
          mode: "insensitive",
        },
      },
    });
    const user_ids = user.map((ele) => ele.user_id);
    const posts = await prisma.post.findMany({
      where: {
        NOT: {
          user: {
            delete: true,
          },
        },
        delete: false,
        user_id: {
          in: user_ids,
        },
      },
      select: postReturnContent,
      skip: intake,
      take: 5,
    });
    return c.json({
      posts: posts,
    });
  }
  if (searchParam == "Tags") {
    const tag = await prisma.tag.findMany({
      select: {
        post_id: true,
      },
      where: {
        name: {
          in: body.tags,
          mode: "insensitive",
        },
      },
    });
    const tag_ids = tag.map((ele) => ele.post_id);
    const posts = await prisma.post.findMany({
      where: {
        NOT: {
          user: {
            delete: true,
          },
        },
        delete: false,
        post_id: {
          in: tag_ids,
        },
      },
      select: postReturnContent,
      skip: intake,
      take: 5,
    });
    return c.json({
      posts: posts,
    });
  }
  if (searchParam == "Friends") {
    const friends = await prisma.friend.findMany({
      where: {
        user1_id: body.currentUserId,
      },
      select: {
        user2_id: true,
      },
    });
    const user_ids = friends.map((ele) => ele.user2_id);
    const posts = await prisma.post.findMany({
      where: {
        NOT: {
          user: {
            delete: true,
          },
        },
        delete: false,
        user_id: {
          in: user_ids,
        },
      },
      select: postReturnContent,
      skip: intake,
      take: 5,
    });
    return c.json({
      posts: posts,
    });
  }
});

postRouter.get("/get", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const intake = Number(c.req.query("intake")) || 0;
  const count = Number(c.req.query("count")) || 5;
  const filterId = c.req.query("filterId") || "";
  if (filterId != "") {
    const post = await prisma.post.findUnique({
      where: {
        NOT: {
          user: {
            delete: true,
          },
        },
        delete: false,
        post_id: filterId,
      },
      select: postReturnContent,
    });
    return c.json({
      post: post,
    });
  }

  const posts = await prisma.post.findMany({
    skip: intake,
    take: count,
    where: {
      NOT: {
        user: {
          delete: true,
        },
      },
      delete: false,
    },
    orderBy: [
      {
        created_at: "desc",
      },
    ],
    select: postReturnContent,
  });
  return c.json({
    posts: posts,
  });
});

postRouter.delete("/delete", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const filterId = c.req.query("filterId") || "";
  if (filterId != "") {
    const post = await prisma.post.update({
      where: {
        post_id: filterId,
      },
      data: {
        delete: true,
      },
    });
    return c.json({
      message: "Successfully Deleted POST!",
      response: post,
    });
  }
  return c.json({
    message: "Kindly, Send a filter ID to indentify the post to delete",
  });
});

postRouter.put("/updatePreference", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const body = await c.req.json();
  const exists = await prisma.postPreference.findFirst({
    where: {
      NOT: {
        user: {
          delete: true,
        },
        post: {
          delete: true,
        },
      },
      post_id: body.post_id,
      user_id: body.user_id,
    },
  });
  if (!exists) {
    await prisma.postPreference.create({
      data: {
        post_id: body.post_id,
        preference: body.preference,
        user_id: body.user_id,
      },
    });
    return c.json({
      message: "Post preference created Successfully",
    });
  }
  await prisma.postPreference.updateMany({
    where: {
      NOT: {
        user: {
          delete: true,
        },
        post: {
          delete: true,
        },
      },
      post_id: body.post_id,
      user_id: body.user_id,
    },
    data: {
      preference: body.preference,
    },
  });

  return c.json({
    message: "Post preference updated Successfully",
  });
});

postRouter.put("/update", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const filterId = c.req.query("filterId");
  const updatedPost = await c.req.json();

  await prisma.post.update({
    where: {
      NOT: {
        user: {
          delete: true,
        },
        delete: true,
      },

      post_id: filterId,
    },
    data: {
      description: updatedPost.description,
      post_image: updatedPost.post_image,
      user_id: updatedPost.user_id,
      comment_enabled: updatedPost.comment_enabled,
    },
  });

  return c.json({
    message: "Post updated Successfully",
  });
});
