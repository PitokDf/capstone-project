/*
  Warnings:

  - A unique constraint covering the columns `[classID,courseID,lectureID,roomID,timeSlotID]` on the table `Schedule` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `classID` to the `Schedule` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Lecture" ALTER COLUMN "preference" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Schedule" ADD COLUMN     "classID" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Class" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT,

    CONSTRAINT "Class_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LectureTimePrefrence" (
    "id" SERIAL NOT NULL,
    "lectureID" INTEGER NOT NULL,
    "timeslotID" INTEGER NOT NULL,

    CONSTRAINT "LectureTimePrefrence_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Class_code_key" ON "Class"("code");

-- CreateIndex
CREATE UNIQUE INDEX "LectureTimePrefrence_lectureID_timeslotID_key" ON "LectureTimePrefrence"("lectureID", "timeslotID");

-- CreateIndex
CREATE UNIQUE INDEX "Schedule_classID_courseID_lectureID_roomID_timeSlotID_key" ON "Schedule"("classID", "courseID", "lectureID", "roomID", "timeSlotID");

-- AddForeignKey
ALTER TABLE "LectureTimePrefrence" ADD CONSTRAINT "LectureTimePrefrence_lectureID_fkey" FOREIGN KEY ("lectureID") REFERENCES "Lecture"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LectureTimePrefrence" ADD CONSTRAINT "LectureTimePrefrence_timeslotID_fkey" FOREIGN KEY ("timeslotID") REFERENCES "TimeSlot"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Schedule" ADD CONSTRAINT "Schedule_classID_fkey" FOREIGN KEY ("classID") REFERENCES "Class"("id") ON DELETE CASCADE ON UPDATE CASCADE;
