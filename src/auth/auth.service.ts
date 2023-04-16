import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from './auth.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import * as dotenv from 'dotenv';
import { MailerService } from '@nestjs-modules/mailer';
dotenv.config();

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('users') private readonly user: Model<User>,
    private jwtService: JwtService,
    private mailService: MailerService,
  ) {}
  async register(userRegisterInfo: User) {
    const hashedPassword = await bcrypt.hash(userRegisterInfo.password, 12);
    userRegisterInfo.password = hashedPassword;
    userRegisterInfo.verified = false;

    const isAlreadyExist = await this.user
      .findOne({ email: userRegisterInfo.email })
      .exec();
    const newUser = new this.user(userRegisterInfo);
    if (isAlreadyExist) {
      throw new HttpException(
        'This email address has already exist',
        HttpStatus.BAD_REQUEST,
      );
    }
    await newUser.save();
    const userResponse = {
      name: userRegisterInfo.name,
      surname: userRegisterInfo.surname,
      age: userRegisterInfo.age,
      email: userRegisterInfo.email,
      verified: userRegisterInfo.verified,
    };
    return userResponse;
  }
  async login(userLoginInfo: User) {
    const user = await this.user.findOne({ email: userLoginInfo.email });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.UNAUTHORIZED);
    }
    if (!(await bcrypt.compare(userLoginInfo.password, user.password))) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }
    if (!user.verified) {
      throw new HttpException(
        'Email address is not verified,please check your mailbox to verify your email address',
        HttpStatus.UNAUTHORIZED,
      );
    }
    const payload = { username: user.email, sub: user.id };
    const access_token = this.jwtService.sign(payload, {
      secret: `${process.env.JWT_SECRET}`,
      expiresIn: '1m',
    });
    const refresh_token = this.jwtService.sign(payload, {
      secret: `${process.env.JWT_SECRET}`,
      expiresIn: '3m',
    });
    return {
      access_token: access_token,
      refresh_token: refresh_token,
    };
  }
  async verify(email: string) {
    const isAlreadyExist = await this.user.findOne({ email: email }).exec();
    isAlreadyExist.verified = true;
    await this.user.findByIdAndUpdate(isAlreadyExist.id, isAlreadyExist);
    return `Email address verified <a href='https://onurfullstackloginregister.netlify.app/login'>click here</a> to return back`;
  }
  async profile(id: string) {
    const findUser = await this.user.findById(id).exec();
    return {
      id: findUser.id,
      name: findUser.name,
      surname: findUser.surname,
      age: findUser.age,
      email: findUser.email,
    };
  }
  async refresh(req: any) {
    const payload = { username: req.username, sub: req.sub };
    const access_token = this.jwtService.sign(payload, {
      secret: `${process.env.JWT_SECRET}`,
      expiresIn: '1m',
    });
    return { access_token: access_token };
  }
  async passwordResetEmail(email: {
    email: string;
  }): Promise<{ message: string }> {
    const user = await this.user.findOne({ email: email.email });
    await this.mailService.sendMail({
      to: email.email,
      from: 'barinakdeneme@gmail.com',
      subject: 'Verify your email address',
      html: `<a href='https://onurfullstackloginregister.netlify.app/reset-password/${user.id}'>Click here to reset your password</a>`,
      // html: `<a href='http://localhost:4200/reset-password/${user.id}'>Click here to reset your password</a>`,
    });
    return { message: 'Check you mailbox to reset your password' };
  }
  async resetPassword(resetInfo: any): Promise<{ message: string }> {
    const user = await this.user.findById(resetInfo.userId);
    const newHashedPassword = await bcrypt.hash(resetInfo.newPassword, 12);
    user.password = newHashedPassword;
    await this.user.findByIdAndUpdate(resetInfo.userId, user);
    return { message: 'Your Password has been updated' };
  }
}
