-- CreateTable
CREATE TABLE "AcademicExperience" (
    "id" SERIAL NOT NULL,
    "level" TEXT NOT NULL,
    "university" TEXT NOT NULL,
    "topic" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "AcademicExperience_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AcademicExperience" ADD CONSTRAINT "AcademicExperience_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
