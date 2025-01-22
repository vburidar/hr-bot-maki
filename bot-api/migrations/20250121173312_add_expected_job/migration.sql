-- CreateTable
CREATE TABLE "ExpectedJob" (
    "id" SERIAL NOT NULL,
    "jobTitle" TEXT NOT NULL,
    "annualSalary" INTEGER NOT NULL,
    "userId" TEXT,

    CONSTRAINT "ExpectedJob_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ExpectedJob_userId_key" ON "ExpectedJob"("userId");

-- AddForeignKey
ALTER TABLE "ExpectedJob" ADD CONSTRAINT "ExpectedJob_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
