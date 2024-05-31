import { Injectable, ConflictException, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { Model } from 'mongoose';
import { User, UserDocument } from './users.models';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcryptjs'
import { LoginDto, UserResponse } from './users.dto';  
import { validationSchema } from './users.validation';
import { JwtService } from '@nestjs/jwt'
import { Upload } from 'src/imgupload/imgupload.models';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
        private jwtService: JwtService,
    ){}

    async CheckerEmail(useremail: string): Promise<any> {
        return this.userModel.findOne({ useremail }).exec();
    }
    async verifyToken(token: string): Promise<User | null> {
        try {
          const decoded = this.jwtService.verify(token, { secret: process.env.JWT_SECRET });
    
          const user = await this.userModel.findById(decoded.userId);
          if (!user) {
            console.log('User not found');
            return null;
          } else {
            return user;
          }
        } catch (error) {
          return null;
        }
      }
    
    async CreateUser(user: User): Promise<UserResponse> {
        const { error } = validationSchema.validate(user);
        if (error) {
            throw new BadRequestException(error.message);
        }

        const existingUser = await this.CheckerEmail(user.useremail);
        if (existingUser) {
            throw new ConflictException('User email already exists');
        }

        const hashedPassword = await bcrypt.hash(user.userpassword, 10);
        const newUser = new this.userModel({ ...user, userpassword: hashedPassword });
        await newUser.save();
        const token = this.jwtService.sign({ userId: newUser._id });
        return { message: 'Account created successfully', user: newUser.toObject(), token };
    }

    async validateUser(useremail: string, userpassword: string): Promise<any> {
        const user = await this.CheckerEmail(useremail);
        if (user && await bcrypt.compare(userpassword, user.userpassword)) {
            return user;
        }
        return null;
    }

    async login(loginDto: LoginDto): Promise<UserResponse> {
        const user = await this.validateUser(loginDto.useremail, loginDto.userpassword);
        if (!user) {
            throw new UnauthorizedException('Invalid credentials(Email and Password)');
        }
        const token = this.jwtService.sign({ userId: user._id });
        return { message: "Login Successful", user: user.toObject(), token };
    }

    async googlelogin(user: any): Promise<UserResponse> {
        const token = this.jwtService.sign({ userId: user._id });
        return { message: "Login Successful", user: user.toObject(), token };
    }
    async getUserById(id: string): Promise<User | null> {
        return this.userModel.findById(id).exec();
    }
    async searchUsers(query: string): Promise<User[] | { message: string }> {
        if (!query) {
            return [];
        }
        const regex = new RegExp(query, 'i');
        const users = await this.userModel.find({ username: regex }).exec();    
        return users  
    }
    
    
}