import {
  Controller,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { HomeService } from './home/home.service';

@Controller('home')
export class HomeController {
  constructor(private homeService: HomeService) {}
  @Post('file')
  @UseInterceptors(FileInterceptor('file'))
  fileReader(
    @Query() userId: { id: string },
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (file) {
      console.log(file);
      if (file.size > 250000) {
        throw new HttpException(
          'File size is too big, it should be less than 250000bytes.',
          HttpStatus.EXPECTATION_FAILED,
        );
      }
      return this.homeService.addProfilePhoto(
        file.buffer.toString('base64'),
        userId.id,
      );
    }
  }
}
