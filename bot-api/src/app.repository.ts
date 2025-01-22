import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { User } from './type';

@Injectable()
export class AppRepository {
  constructor(private prisma: PrismaService) {}

  async updateUser(userId: string, updateUserDto: User) {
    //@ts-ignore
    delete updateUserDto.id;
    const { jobExperiences, academicExperience, expectedJob, ...userData } =
      updateUserDto;

    return this.prisma.$transaction(async (prisma) => {
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: userData,
      });

      if (jobExperiences) {
        await Promise.all(
          jobExperiences.map(async (experience) => {
            await prisma.jobExperience.create({
              data: {
                ...experience,
                user: {
                  connect: { id: userId }, // Connects the JobExperience to the existing User
                },
              },
            });
          }),
        );
      }

      if (academicExperience) {
        await Promise.all(
          academicExperience.map(async (experience) => {
            await prisma.academicExperience.create({
              data: { ...experience, userId },
            });
          }),
        );
      }

      if (expectedJob) {
        await prisma.expectedJob.upsert({
          where: { userId },
          create: { ...expectedJob, userId },
          update: { ...expectedJob },
        });
      }

      return updatedUser;
    });
  }
}
