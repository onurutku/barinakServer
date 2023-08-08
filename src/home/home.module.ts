import { Module } from '@nestjs/common';
import { HomeController } from './home.controller';
import { HomeService } from './home/home.service';
import { MongooseModule } from '@nestjs/mongoose';
import { userSchema } from 'src/auth/auth.model';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'users', schema: userSchema }])],
  controllers: [HomeController],
  providers: [HomeService],
})
export class HomeModule {}
