-- AlterTable
ALTER TABLE "Comment" ADD COLUMN     "delete" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "delete" BOOLEAN NOT NULL DEFAULT false;
