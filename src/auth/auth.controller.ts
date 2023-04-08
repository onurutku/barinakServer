import { Body, Controller, Get, Post, Query, Redirect } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from './auth.model';

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
  @Get('profile')
  profile(@Query() param: any) {
    return this.authService.profile(param['id']);
  }
}
