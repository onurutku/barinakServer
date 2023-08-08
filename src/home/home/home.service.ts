import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/auth/auth.model';

@Injectable()
export class HomeService {
  constructor(@InjectModel('users') private readonly user: Model<User>) {}
  async addProfilePhoto(file: string, userId: string) {
    const findUser = await this.user.findById(userId).exec();
    findUser.profilePicture = file;
    await this.user.findByIdAndUpdate(findUser.id, findUser);
    return {
      id: findUser.id,
      name: findUser.name,
      surname: findUser.surname,
      age: findUser.age,
      email: findUser.email,
      profilePicture: findUser.profilePicture,
    };
  }
}
