import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from './auth.model';
import { JwtAuthGuard } from './jwt-auth-guard.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('register')
  register(@Body() userRegisterInfo: User) {
    return this.authService.register(userRegisterInfo);
  }
  @Post('login')
  login(@Body() userLoginInfo: User) {
    return this.authService.login(userLoginInfo);
  }
  @Get('verify-user')
  verify(@Query() param: string) {
    return this.authService.verify(param['email']);
  }
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async profile(@Query() param: string, @Request() req: any) {
    const user = await this.authService.profile(param['id']);
    return {
      id: user.id,
      name: user.name,
      surname: user.surname,
      age: user.age,
      email: user.email,
      iat: req.user.iat,
      exp: req.user.exp,
    };
  }
}
