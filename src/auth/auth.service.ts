import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from './auth.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import * as dotenv from 'dotenv';
dotenv.config();

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('users') private readonly user: Model<User>,
    private jwtService: JwtService,
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
    return {
      id: user.id,
      name: user.name,
      surname: user.surname,
      age: user.age,
      email: user.email,
      access_token: this.jwtService.sign(payload, {
        secret: `${process.env.JWT_SECRET}`,
        expiresIn: '1h',
      }),
    };
  }
  async verify(email: string) {
    const isAlreadyExist = await this.user.findOne({ email: email }).exec();
    isAlreadyExist.verified = true;
    await this.user.findByIdAndUpdate(isAlreadyExist.id, isAlreadyExist);
    return `Email address verified <a href='https://gencayinbarinagi.netlify.app/login'>click here</a> to return back`;
  }
}
