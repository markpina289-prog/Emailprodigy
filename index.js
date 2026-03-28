// index.js
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const email = url.searchParams.get('email');
    const firstName = url.searchParams.get('name');

    if (!email || !firstName) {
      return new Response('Usage: ?email=address@example.com&name=FirstName', {
        status: 400,
        headers: { 'Content-Type': 'text/plain' }
      });
    }

    const RESEND_API_KEY = env.RESEND_API_KEY;

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Google Security Alert</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Roboto', Arial, sans-serif; background-color: #f5f5f5;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
        <tr>
            <td align="center" style="padding: 20px 0;">
                <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.12);">
                    <tr>
                        <td style="padding: 24px 24px 16px 24px; border-bottom: 1px solid #e0e0e0;">
                            <table width="100%" cellspacing="0" cellpadding="0" border="0">
                                <tr>
                                    <td>
                                        <img src="https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_74x24dp.png" alt="Google" width="74" height="24" style="display: block;">
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 24px;">
                            <p style="margin: 0 0 16px 0; font-size: 14px; line-height: 20px; color: #202124;">Hi ${firstName},</p>
                            <p style="margin: 0 0 16px 0; font-size: 14px; line-height: 20px; color: #202124;">We noticed a sign-in attempt to your Google Account from a device we do not recognize. To protect you, we have temporarily limited some account features.</p>
                            <table width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #f8f9fa; border-radius: 4px; margin: 16px 0;">
                                <tr>
                                    <td style="padding: 16px;">
                                        <table width="100%" cellspacing="0" cellpadding="0" border="0">
                                            <tr>
                                                <td style="padding-bottom: 12px;">
                                                    <span style="display: inline-block; width: 20px; height: 20px; vertical-align: middle; margin-right: 8px;">
                                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <rect x="2" y="3" width="20" height="14" rx="2" stroke="#5f6368" stroke-width="2"/>
                                                            <line x1="2" y1="10" x2="22" y2="10" stroke="#5f6368" stroke-width="2"/>
                                                            <line x1="8" y1="17" x2="8" y2="21" stroke="#5f6368" stroke-width="2"/>
                                                            <line x1="16" y1="17" x2="16" y2="21" stroke="#5f6368" stroke-width="2"/>
                                                            <line x1="6" y1="21" x2="18" y2="21" stroke="#5f6368" stroke-width="2"/>
                                                        </svg>
                                                    </span>
                                                    <span style="font-size: 14px; color: #202124; vertical-align: middle;">Device</span>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="padding-left: 28px; padding-bottom: 12px;">
                                                    <p style="margin: 0; font-size: 14px; color: #202124;">Windows PC — Chrome Browser</p>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="padding-bottom: 8px;">
                                                    <span style="display: inline-block; width: 8px; height: 8px; background-color: #ea4335; border-radius: 50%; margin-right: 8px; vertical-align: middle;"></span>
                                                    <span style="font-size: 14px; color: #202124; vertical-align: middle;">Status</span>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="padding-left: 16px;">
                                                    <p style="margin: 0; font-size: 14px; color: #202124;">Blocked — Suspicious Activity</p>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                            <p style="margin: 16px 0; font-size: 14px; line-height: 20px; color: #202124;">If this was you, no action is needed. If you do not recognize this activity, your account may be at risk. Please review and secure your account immediately.</p>
                            <p style="margin: 16px 0; font-size: 14px; line-height: 20px; color: #202124;">This secure link will expire in 24 hours for your protection.</p>
                            <p style="margin: 24px 0 8px 0; font-size: 14px; font-weight: 500; color: #202124;">How to keep your account secure</p>
                            <ul style="margin: 0; padding-left: 20px; font-size: 14px; line-height: 20px; color: #202124;">
                                <li style="margin-bottom: 4px;">Review your recent account activity regularly at myaccount.google.com</li>
                                <li style="margin-bottom: 4px;">Never share your password or verification codes with anyone — including Google support</li>
                                <li>Enable 2-Step Verification to add an extra layer of protection</li>
                            </ul>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 24px; border-top: 1px solid #e0e0e0;">
                            <p style="margin: 0 0 8px 0; font-size: 12px; line-height: 16px; color: #5f6368;">Google LLC · 1600 Amphitheatre Parkway · Mountain View, CA 94043</p>
                            <p style="margin: 0; font-size: 12px; line-height: 16px; color: #5f6368;">This email was sent to ${email} because you have a Google Account.</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`;

    const payload = {
      from: 'Google Security <security@jesusgeneration.vip>',
      to: [email],
      subject: 'We noticed unusual activity in your account',
      text: 'A sign-in attempt was blocked. Review now to confirm it was you.',
      html: html
    };

    const curl = `curl -X POST https://api.resend.com/emails \\
  -H "Authorization: Bearer ${RESEND_API_KEY}" \\
  -H "Content-Type: application/json" \\
  -d '${JSON.stringify(payload)}'`;

    return new Response(curl, {
      headers: { 'Content-Type': 'text/plain' }
    });
  }
};