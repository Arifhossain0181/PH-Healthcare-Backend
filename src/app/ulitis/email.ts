
import nodemailer from "nodemailer";
import { envVars } from "../config/env";
import path from "path";
import ejs from "ejs";  
export const transport = nodemailer.createTransport({
    host :envVars.EMAIL_SENDER_SMTP_HOST,
    secure: envVars.EMAIL_SENDER_SMTP_SECURE,
    auth: {
        user: envVars.EMAIL_SENDER_SMTP_USER,
        pass: envVars.EMAIL_SENDER_SMTP_PASSWORD
    },
    port : Number(envVars.EMAIL_SENDER_SMTP_PORT)

})
interface EmailAttachment {
    filename: string;
    content: string | Buffer;
    contentType: string;
}

interface SendEmailOptions {
    to: string;
    templateName: string;
    templateData: Record<string, unknown>;
    attachments?: EmailAttachment[];
    subject: string;
    // if html is provided, template will be ignored
    html?: string;
}

export const sendEmail = async (
    options: SendEmailOptions
): Promise<void> => {
    const { subject, to, html: rawHtml, templateName, templateData, attachments } = options;

    try {
        let htmlContent: string;
        if (rawHtml) {
            htmlContent = rawHtml;
        } else {
            const templatePath = path.resolve(
                process.cwd(),
                `src/app/temPlete/${templateName}.ejs`
            );
            htmlContent = await ejs.renderFile(templatePath, templateData);
        }

        const info = await transport.sendMail({
            from: envVars.EMAIL_SENDER_SMTP_USER,
            to,
            subject,
            html: htmlContent,
            attachments: attachments?.map((att: EmailAttachment) => ({
                filename: att.filename,
                content: att.content,
                contentType: att.contentType,
            })),
        });
        console.log(`email send to ${to} :${info.messageId}`);
    } catch (error) {
        console.error("Error sending email:", error);
        throw error;
    }
}