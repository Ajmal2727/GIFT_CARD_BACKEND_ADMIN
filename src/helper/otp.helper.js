import pkg from 'twilio';
const { Twilio } = pkg;

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

const client = new Twilio(accountSid, authToken);

const sendMobileOTP = async (mobileNumber, otp) => {
    try {
        const message = await client.messages.create({
            body: `Your password reset OTP is: ${otp}. It is valid for 5 minutes.`,
            from: twilioPhoneNumber,
            to: mobileNumber,
        });

        console.log("Twilio response:", message);
        console.log(`OTP sent to ${mobileNumber}`);
    } catch (error) {
        console.error("Error sending OTP:", error);
    }
};


export default sendMobileOTP;
