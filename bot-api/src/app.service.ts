import { Injectable } from '@nestjs/common';
import { CreateUserOutputDto, User } from './type';
import { v4 as uuidv4 } from 'uuid';
import { PrismaService } from './prisma.service';
import { Prisma } from '@prisma/client';
import { ChatInputItemDto, CreateUserDto } from './app.dto';
import { PromptService } from './prompt.service';
import { AppRepository } from './app.repository';

@Injectable()
export class AppService {
  constructor(
    private prisma: PrismaService,
    private promptService: PromptService,
    private appRepository: AppRepository,
  ) {}

  isUserInformationComplete(user: User) {
    if (
      user.name &&
      user.surname &&
      user.phone &&
      user.address &&
      user.jobExperiences?.length > 0 &&
      user.jobExperiences[0].nbMonths &&
      user.jobExperiences[0].company &&
      user.jobExperiences[0].jobTitle &&
      user.academicExperience?.length > 0 &&
      user.academicExperience[0].level &&
      user.academicExperience[0].university &&
      user.academicExperience[0].topic &&
      user.expectedJob?.jobTitle &&
      user.expectedJob.annualSalary
    ) {
      return true;
    }
    return false;
  }

  async createUser(user: CreateUserDto): Promise<CreateUserOutputDto> {
    const createUser: Prisma.UserCreateInput = {
      name: user.name,
      surname: user.surname,
      id: uuidv4(),
    };
    return await this.prisma.user.create({
      data: createUser,
    });
  }

  async handleChatItemAndAnswer(
    chatInputItem: ChatInputItemDto,
  ): Promise<{ content: string; stopChat: boolean }> {
    const userWithJobExperiences = await this.prisma.user.findUnique({
      where: { id: chatInputItem.userId },
      include: {
        jobExperiences: true,
        academicExperience: true,
        expectedJob: true,
      },
    });

    if (userWithJobExperiences === null) {
      throw new Error(
        `Cannot find user with id ${chatInputItem.userId}, cancelling chat`,
      );
    }

    const newUser = {
      ...JSON.parse(
        await this.promptService.getUpdatedUser(
          chatInputItem.content,
          userWithJobExperiences,
        ),
      ),
      name: userWithJobExperiences.name,
      surname: userWithJobExperiences.surname,
    };

    console.log(newUser);
    if (this.isUserInformationComplete(newUser)) {
      await this.appRepository.updateUser(chatInputItem.userId, newUser);
      return {
        content: '',
        stopChat: true,
      };
    }

    return {
      content: await this.promptService.getAnswer(
        chatInputItem.content,
        newUser,
      ),
      stopChat: false,
    };
  }
}
