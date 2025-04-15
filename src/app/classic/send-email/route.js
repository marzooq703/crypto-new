const sgMail = require('@sendgrid/mail');

export async function POST(request) {
  try {
    const data = await request.json();
    console.log(data);
    const { otp, email } = data;
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    const msg = {
      to: email, // Change to your recipient
      from: 'tech@zuthod.com', // Change to your verified sender
      subject: 'Zuthod SignUp OTP',
      text: 'Use the below OTP to sign up to zuthod',
      html: `<div><h2>Signup OTP!</h2>Please enter the following OPT to complete your Profile at Zuthod
            <h2>OTP: ${otp}</h2></div>`,
    };
    sgMail
      .send(msg)
      .then(() => {
        console.log('Email sent');
      })
      .catch((error) => {
        console.error(error);
      });

    return Response.json({ data: 'email send' });
  } catch (error) {
    console.error('Error initiating telegram request:', error);
    return Response.error({ message: error.message });
  }
  //   return Response.json({ name: 'tariq' });
}
