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
    constructor(@InjectModel('users') private readonly user:Model<User>,private jwtService:JwtService){

    }
    async register(userRegisterInfo:User){
            const hashedPassword= await bcrypt.hash(userRegisterInfo.password,12);
            userRegisterInfo.password = hashedPassword
            const isAlreadyExist= await this.user.findOne({email:userRegisterInfo.email}).exec();
            const newUser = new this.user(userRegisterInfo);
            if(isAlreadyExist){
                throw new HttpException('This email address has already exist', HttpStatus.BAD_REQUEST);   
            }
            await newUser.save();
                const userResponse={
                    name:userRegisterInfo.name,
                    surname:userRegisterInfo.surname,
                    age:userRegisterInfo.age,
                    email:userRegisterInfo.email
                }
            return userResponse; 
    }
    async login(userLoginInfo:User){
        const user= await this.user.findOne({ email:userLoginInfo.email})
        const payload = { username: user.email, sub: user.id}
        
        if (!user) {
            throw new HttpException('User not found', HttpStatus.UNAUTHORIZED);    
        }
        if(!await bcrypt.compare(userLoginInfo.password,user.password)){
            throw new HttpException("Invalid credentials", HttpStatus.UNAUTHORIZED);
        }
        return {
            id:user.id,
            name:user.name,
            surname:user.surname,
            age:user.age,
            email:user.email,
            access_token: this.jwtService.sign(payload,{secret:`${process.env.JWT_SECRET}`,expiresIn:'1h'}),
        };
    }
}
