-- AlterTable
ALTER TABLE "Comment" ADD COLUMN     "is_answer" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "is_question" BOOLEAN NOT NULL DEFAULT false;
