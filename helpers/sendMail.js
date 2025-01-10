import nodemailer from "nodemailer";

export const sendMail = (data) => {
  const smtpHost = process.env.STMP_HOST;
  const smtpPort = process.env.STMP_PORT;
  const smtpUser = process.env.STMP_USER;
  const smtpPassword = process.env.STMP_PASSWORD;

  try {
    const smtpTransport = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: true, // uses SSL for PORT 465 SES
      auth: {
        user: smtpUser,
        pass: smtpPassword,
      },
    });

    const updatedData = {
      to: data.to,
      from: `<${data.from}>`,
      subject: data.subject,
      text: data.text,
    };

   return smtpTransport.sendMail(updatedData)

  } catch (e) {
    console.log("ERRRR", e);
  }
};
