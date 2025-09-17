import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
dotenv.config()
const transporter = nodemailer.createTransport({
    service:"gmail",
    auth:{
        user:process.env.USER,
        pass:process.env.PASS
    }
}) 
export default {
    sendEmail: async (to,subject,text)=>{
        const mailOptions = {
            from:process.env.USER,
            to,subject,text
        }
        try {
            const info = await transporter.sendMail(mailOptions)
            console.log("Email sent: " +info.response)
        } catch (error) {
           console.log("Error sending email: ", error)     
        }
    }
}