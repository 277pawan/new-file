import { User } from "./users.models";

// user.dto.ts
export interface UserResponse {
    message: string;
    user: User;
    token:string;
}
export class LoginDto {
    useremail: string;
    userpassword: string;
}