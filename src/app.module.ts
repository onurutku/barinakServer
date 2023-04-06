import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [MongooseModule.forRoot('mongodb+srv://<username>:<password>@barinakcluster.zvra6qi.mongodb.net/barinak?retryWrites=true&w=majority'), AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
