const nodemailer = require("nodemailer");
const pug = require("pug");
const htmlToText = require("html-to-text");

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstname = user.name.split(" ")[0];
    this.url = url;
    this.from = `littleFootDev <${process.env.EMAIL_FROM}>`;
  }

  newTransport() {
    if (process.env.NODE_ENV === "production") {
      return nodemailer.createTransport({
        service: "SendGrid",
        auth: {
          user: process.env.SENGRID_USERNAME,
          pass: process.env.SENGRID_PASSWORD,
        },
      });
    }
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }
  async send(template, subject) {
    //send the actual email
    //1) render HTML  based on a pug template
    const html = pug.renderFile(
      `${$__dirname}/../views/emails/${template}.pug`,
      {
        firstname: this.firstname,
        url: this.url,
        subject,
      }
    );
    //2) Define email option options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: htmlToText.fromString(html),
    };
    // 3) create a transport and send email
    await this.newTransport().transporter.sendMail(mailOptions);
  }

  async sendWelcome() {
    await this.send("welcome", "Welcome to the LittleFootTours Family!");
  }
  async sendPasswordReset() {
    await this.send(
      "passwordReset",
      "Your password reset token (valid for only 1à minutes"
    );
  }
};
