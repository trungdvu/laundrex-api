import * as nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

export const isUuid = (str: string) => {
  const regexExp =
    /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi;
  return regexExp.test(str);
};

export type SendMailOptions = {
  subject: string;
  text: string;
  to: string;
};

export const sendMail = (
  options: SendMailOptions,
  callback?: (err: Error, info: SMTPTransport.SentMessageInfo) => void,
) => {
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL_SENDER_USER,
      pass: process.env.EMAIL_SENDER_PASS,
    },
  });
  transporter.sendMail(
    {
      from: {
        name: 'Laundrex',
        address: 'laundrexservice@gmail.com',
      },
      ...options,
    },
    callback,
  );
};
