import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { CreateUserOutputDto } from './type';
import { ChatInputItemDto, CreateUserDto } from './app.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('/user')
  async createUser(
    @Body() createUserDto: CreateUserDto,
  ): Promise<CreateUserOutputDto> {
    return await this.appService.createUser(createUserDto);
  }

  @Post('/user/chat')
  async chatWithUser(
    @Body() chatItemDto: ChatInputItemDto,
  ): Promise<{ content: string; stopChat: boolean }> {
    return this.appService.handleChatItemAndAnswer(chatItemDto);
  }
}
