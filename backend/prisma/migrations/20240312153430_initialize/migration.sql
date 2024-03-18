-- CreateEnum
CREATE TYPE "AppreciateModes" AS ENUM ('Likes', 'Upvotes');

-- CreateTable
CREATE TABLE "User" (
    "user_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "bio" TEXT NOT NULL,
    "profile_image" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "appreciate_mode" "AppreciateModes" NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "Friend" (
    "friend_id" TEXT NOT NULL,
    "user1_id" TEXT NOT NULL,
    "user2_id" TEXT NOT NULL,
    "mutual" BOOLEAN NOT NULL,

    CONSTRAINT "Friend_pkey" PRIMARY KEY ("friend_id")
);

-- CreateTable
CREATE TABLE "Post" (
    "post_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "post_image" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("post_id")
);

-- CreateTable
CREATE TABLE "Comment" (
    "comment_id" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "post_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("comment_id")
);

-- CreateTable
CREATE TABLE "CommentPreferences" (
    "c_preference_id" TEXT NOT NULL,
    "comment_id" TEXT NOT NULL,
    "preference" BOOLEAN NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "CommentPreferences_pkey" PRIMARY KEY ("c_preference_id")
);

-- CreateTable
CREATE TABLE "PostPreference" (
    "p_preference_id" TEXT NOT NULL,
    "post_id" TEXT NOT NULL,
    "preference" BOOLEAN NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "PostPreference_pkey" PRIMARY KEY ("p_preference_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Friend_user1_id_key" ON "Friend"("user1_id");

-- AddForeignKey
ALTER TABLE "Friend" ADD CONSTRAINT "Friend_user1_id_fkey" FOREIGN KEY ("user1_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Friend" ADD CONSTRAINT "Friend_user2_id_fkey" FOREIGN KEY ("user2_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "Post"("post_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommentPreferences" ADD CONSTRAINT "CommentPreferences_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommentPreferences" ADD CONSTRAINT "CommentPreferences_comment_id_fkey" FOREIGN KEY ("comment_id") REFERENCES "Comment"("comment_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostPreference" ADD CONSTRAINT "PostPreference_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "Post"("post_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostPreference" ADD CONSTRAINT "PostPreference_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
