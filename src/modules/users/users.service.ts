import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from 'src/core/database/prisma.service';
import { S3Service } from 'src/core/storage/s3/s3.service';
import bcrypt from "bcrypt";
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService,
    private s3: S3Service,
    private Jwt: JwtService
  ){}
  async create(createUserDto: CreateUserDto, file: Express.Multer.File) {
    const findUser = await this.prisma.user.findUnique({ where: { username: createUserDto.username } });
    if (findUser) throw new ConflictException('User already exists');
    const url = await this.s3.uploadFile(file, 'images');
    const hashedPassword = await bcrypt.hash(createUserDto.password, 12);
    const user = await this.prisma.user.create({ data: { ...createUserDto, image_url: url as string, password: hashedPassword } });
    const token = await this.Jwt.signAsync({ id: user.id });
    return { user, token };
  }
}
