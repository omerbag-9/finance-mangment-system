import nodemailer from 'nodemailer'

export const sendEmail = async ({ to = '', subject = '', html = '' }) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "omerbag2002@gmail.com",
      pass: "mgzsycjhskkndqsy",
    },
  });

  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: '"financial managment system" <omerbag2002@gmail.com>', // sender address
    to, // list of receivers
    subject, // Subject line
    text: "Hello world?", // plain text body
    html, // html body
  });
}

