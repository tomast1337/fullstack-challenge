import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PagingDto } from '@server/dto/paging.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';
import { User } from '@prisma/client';
import { GetRequestToken } from '@server/GetRequestUser';
import { FileInterceptor } from '@nestjs/platform-express';
import { PageDto } from '@server/dto/page.dto';

@Controller('user')
@ApiTags('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiOperation({
    summary: 'Get a page of users',
  })
  findAll(@Query() query: PagingDto): Promise<PageDto<User>> {
    return this.userService.findPage(query);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Find a user by ID',
  })
  findOne(@Param('id') id: string): Promise<User> {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt-refresh'))
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update a user by ID',
  })
  update(
    @GetRequestToken() user: User | null,
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    if (+id !== user.id) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: 'You cannot delete another user',
        },
        HttpStatus.FORBIDDEN,
      );
    }
    return this.userService.update(+id, updateUserDto);
  }
  @Patch(':id/picture')
  @UseGuards(AuthGuard('jwt-refresh'))
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update a user picture',
  })
  @UseInterceptors(FileInterceptor('file'))
  updatePicture(
    @GetRequestToken() user: User | null,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<User> {
    return this.userService.updatePicture(user.id, file);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt-refresh'))
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Remove a user by ID',
  })
  remove(
    @GetRequestToken() user: User | null,
    @Param('id') id: string,
  ): Promise<User> {
    if (+id !== user.id) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: 'You cannot delete another user',
        },
        HttpStatus.FORBIDDEN,
      );
    }
    return this.userService.remove(+id);
  }
}
