import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { userSchema } from './auth.model';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports:[MongooseModule.forFeature([{name:'users',schema:userSchema}])],
  controllers: [AuthController],
  providers: [AuthService,JwtService],
})
export class AuthModule {}
