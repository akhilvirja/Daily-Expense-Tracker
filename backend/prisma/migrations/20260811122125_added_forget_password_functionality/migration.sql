-- AlterTable
ALTER TABLE "users" ADD COLUMN     "resetPasswordExpires" TIMESTAMPTZ(6),
ADD COLUMN     "resetPasswordToken" VARCHAR(255);
