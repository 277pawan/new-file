import { Body, Controller, Get, Param, Post, Query, Req, Res, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './users.models';
import { LoginDto, UserResponse } from './users.dto'; // Import UserResponse interface
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import * as crypto from 'crypto';
import { Upload } from 'src/imgupload/imgupload.models';

@Controller('users')
export class UsersController {
    constructor(private readonly userService: UsersService) {}

    @Post()
    async CreateUser(@Body() userDto: User): Promise<UserResponse> {
        return this.userService.CreateUser(userDto);
    }

    @Post('login')
    async login(@Body() loginDto: LoginDto): Promise<any> {
        return this.userService.login(loginDto);
    }
    @Get('token')
    async userinfo(@Req() req: Request): Promise<User | null> {
        const user = (req as any).user;
      return user ? user : null;
    }
    @Get('google')
    @UseGuards(AuthGuard('google'))
    async googleAuth() {
        // This route should not have any logic,
        // as the actual authentication is handled by Passport.js middleware.
    }
    
    @Get('google/callback')
    @UseGuards(AuthGuard('google'))
    async googleAuthRedirect(@Req() req, @Res() res: Response): Promise<any> {
        const user = req.user;
        if (!user) {
            return res.status(404).json({ message: "Error user not exist" });
        }
    
        const existingUser = await this.userService.CheckerEmail(user.useremail);
        let finaluser;
    
        if (existingUser) {
            // Existing user, proceed to login
            finaluser = await this.userService.googlelogin(existingUser);
        } else {
            // New user, create account with a random password
            user.userpassword = crypto.randomBytes(6).toString('hex'); // Generate a random password
            finaluser = await this.userService.CreateUser(user);
        }
    
        // Return the user data
        return res.redirect(`http://localhost:3000/user?id=${finaluser.token}`)
    }
    @Get('user-search')
    async searchUsers(@Query('q') query: string): Promise<User[] | { message: string }>  {
        const ans=await this.userService.searchUsers(query);
        return ans;
    }
   
    
}