import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UseGuards,
  Request,
  Param,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from './auth.model';
import { JwtAuthGuard } from './jwt-auth-guard.guard';
import { JwtRefreshGuard } from './jwt-refresh-guard.guard';

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
  @Post('password-reset-email')
  passwordResetEmail(
    @Body() email: { email: string },
  ): Promise<{ message: string }> {
    return this.authService.passwordResetEmail(email);
  }
  @Post('reset-password')
  resetPassword(@Body() resetInfo: any): Promise<{ message: string }> {
    return this.authService.resetPassword(resetInfo);
  }
  @UseGuards(JwtRefreshGuard)
  @Post('refresh')
  async refresh(@Request() req: any) {
    return this.authService.refresh(req.user);
  }
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async profile(@Request() req: any) {
    const userId: string = req.user.sub;
    const user = await this.authService.profile(userId);
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
