import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import SendGrid from "@sendgrid/mail";

@Injectable()
export class SendgridService {
  constructor(private readonly configService: ConfigService) {
    SendGrid.setApiKey(this.configService.get<string>("SEND_GRID_KEY"));
  }

  async send(email: string) {
    var mgs = {
      from: "ibrargill1998@gmail.com",
      templateId: "d-c196e45346834bcba3e164b523affa5f",
      personalizations: [
        {
          to: [
            {
              email: email,
            },
          ],
          subject: "Email Confirmation",
        },
      ],
      dynamicTemplateData: {
        Sender_Name: email,
      },
    };

    const transport = await SendGrid.send(mgs);

    console.log(`Email successfully dispatched to ${email}`);
    return transport;
  }

  async sendEmailWithBody(email: string, body: string) {
    var mgs = {
      from: "ibrargill1998@gmail.com",
      to: email, // Change to your recipient
      subject: "Welcome to 2Rare",
      text: "and easy to do anywhere, even with Node.js",
      html: body,
    };

    const transport = await SendGrid.send(mgs);

    console.log(`Email successfully dispatched to ${email}`);
    return transport;
  }
}
