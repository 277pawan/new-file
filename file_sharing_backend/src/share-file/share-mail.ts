import * as nodemailer from 'nodemailer'
import * as dotenv from 'dotenv';
dotenv.config();
export const transporter=nodemailer.createTransport({
service:'Gmail',
auth:{
    user:process.env.EmailUser,
    pass:process.env.EmailPass,
},
});
export const mailOptions={
    from:process.env.Email_User,
    subject:"User Invitation Request"
}