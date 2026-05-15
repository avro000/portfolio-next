import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
    try {
        const { name, email, message } = await req.json();

        if (!name || !email || !message) {
            return NextResponse.json(
                { error: "All fields required" },
                { status: 400 }
            );
        }

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.SMTP_EMAIL,
                pass: process.env.SMTP_PASSWORD,
            },
        });

        await transporter.sendMail({
            from: `"Portfolio Contact" <${process.env.SMTP_EMAIL}>`,
            to: process.env.SMTP_EMAIL,
            replyTo: email,
            subject: `Portfolio Contact — ${name}`,
            text: message,
            html: `
<div style="background:#D2C8BC;padding:24px 12px;font-family:'Helvetica Neue',Arial,sans-serif;">
  <div style="max-width:480px;margin:0 auto;background:#EDE8E2;border:1px solid #B0A89E;">

    <!-- Header -->
    <div style="padding:28px 24px 20px;border-bottom:1px solid #B0A89E;text-align:center;">
      <p style="margin:0 0 6px;font-size:11px;font-weight:600;letter-spacing:3px;text-transform:uppercase;color:#5A5550;">Portfolio — Contact</p>
      <h1 style="margin:0;font-size:24px;font-weight:700;color:#1A1A1A;font-family:Georgia,'Times New Roman',serif;">New Message</h1>
    </div>

    <!-- Body -->
    <div style="padding:24px;">

      <!-- Sender info -->
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-bottom:20px;">
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid #D2C8BC;">
            <p style="margin:0 0 2px;font-size:10px;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:#5A5550;">From</p>
            <p style="margin:0;font-size:15px;font-weight:600;color:#1A1A1A;">${name}</p>
          </td>
        </tr>
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid #D2C8BC;">
            <p style="margin:0 0 2px;font-size:10px;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:#5A5550;">Email</p>
            <a href="mailto:${email}" style="font-size:14px;color:#1A1A1A;text-decoration:none;">${email}</a>
          </td>
        </tr>
      </table>

      <!-- Message -->
      <div style="padding:16px 18px;background:#D2C8BC;border:1px solid #B0A89E;">
        <p style="margin:0 0 6px;font-size:10px;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:#5A5550;">Message</p>
        <p style="margin:0;font-size:14px;line-height:1.7;color:#1A1A1A;white-space:pre-wrap;">${message}</p>
      </div>
    </div>

    <!-- Footer -->
    <div style="padding:16px 24px;border-top:1px solid #B0A89E;text-align:center;">
      <p style="margin:0;font-size:11px;color:#5A5550;line-height:1.6;">
        Sent from your portfolio contact form.<br/>
        <strong>You can reply directly to respond.</strong>
      </p>
    </div>

  </div>
</div>
`,
        });


        return NextResponse.json({ success: true });
    } catch (err) {
        return NextResponse.json(
            { error: "Failed to send message" },
            { status: 500 }
        );
    }
}