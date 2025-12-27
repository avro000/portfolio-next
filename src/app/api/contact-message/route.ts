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
  <div style="background:#0f172a;padding:30px;font-family:Arial,Helvetica,sans-serif;">
    <div style="max-width:600px;margin:0 auto;background:#020617;border-radius:14px;border:1px solid #1e293b;">
      
      <div style="padding:22px 26px;border-bottom:1px solid #1e293b;">
        <h2 style="margin:0;font-size:22px;color:#e2e8f0;">
          📩 New Contact Message
        </h2>
        <p style="margin-top:4px;color:#94a3b8;">
          Someone reached out from your portfolio website
        </p>
      </div>

      <div style="padding:26px;color:#e5e7eb;">
        
        <p style="font-size:15px;line-height:1.7;margin:0 0 16px;">
          <b style="color:#38bdf8;">Name:</b> ${name}
        </p>

        <p style="font-size:15px;line-height:1.7;margin:0 0 16px;">
          <b style="color:#38bdf8;">Email:</b> 
          <a href="mailto:${email}" style="color:#93c5fd;text-decoration:none;">
            ${email}
          </a>
        </p>

        <div style="
          background:#020617;
          border:1px solid #1e293b;
          border-radius:10px;
          padding:16px;
          margin-top:10px;
          ">
          <p style="margin:0;font-size:15px;line-height:1.8;color:#cbd5f5;">
            ${message}
          </p>
        </div>
      </div>

      <div style="padding:18px 26px;border-top:1px solid #1e293b;color:#94a3b8;font-size:12px;text-align:center;">
        This email was sent from your portfolio contact form.<br/>
        <span style="color:#38bdf8;">You can reply directly to respond.</span>
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