import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma.service';
import { PromptService } from './prompt.service';
import { AppRepository } from './app.repository';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, PrismaService, PromptService, AppRepository],
})
export class AppModule {}
