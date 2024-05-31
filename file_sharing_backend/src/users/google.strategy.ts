import { PassportStrategy } from '@nestjs/passport';
import { Injectable, Redirect } from '@nestjs/common';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import * as dotenv from 'dotenv'
dotenv.config();
@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
    constructor() {
        super({
            clientID: process.env.clientID,
            clientSecret: process.env.clientSecret,
            callbackURL: 'http://localhost:4000/users/google/callback',
            scope: ['email', 'profile'],
        });
    }

    async validate(accessToken: string, refreshToken: string, profile: any, done: VerifyCallback): Promise<any> {
        const { displayName, emails, photos } = profile;
        const user = {
            username: displayName,
            useremail: emails[0].value,
            image: photos[0].value,
        };
        done(null, user);
    }
}