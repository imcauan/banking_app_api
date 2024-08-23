import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { ParamId } from 'src/decorators/param-id.decorator';
import { UpdateUserDto } from './dtos/update-user.dto';
import { CreateTransactionDto } from '../transaction/dtos/create-transaction.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { CreateCardDto } from '../card/dtos/create-card-dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './storage',
        filename(req, file, callback) {
          callback(null, `${Date.now()}-${file.originalname}`);
        },
      }),
    }),
  )
  @Post()
  async create(
    @UploadedFile() image: Express.Multer.File,
    @Body() data: CreateUserDto,
  ) {
    return this.userService.create(image, data);
  }

  @Get(':id')
  async findOne(@ParamId() id: string) {
    return this.userService.findOne(id);
  }

  @Get()
  async findAll() {
    return this.userService.findAll();
  }

  @Patch(':id')
  async update(@ParamId() id: string, data: UpdateUserDto) {
    return this.userService.update(id, data);
  }

  @Delete(':id')
  async delete(@ParamId() id: string) {
    return this.userService.delete(id);
  }

  @UseGuards(AuthGuard)
  @Post('new_transaction')
  async newTransaction(@Body() data: CreateTransactionDto) {
    return this.userService.newTransaction(data);
  }

  @UseGuards(AuthGuard)
  @Post('new_card')
  async newCard(@Body() data: CreateCardDto) {
    return this.userService.newCard(data);
  }
}
