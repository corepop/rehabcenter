import type { APIRoute } from 'astro';

// Disable prerendering for API routes
export const prerender = true;

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.formData();

    const name = data.get('name')?.toString();
    const email = data.get('email')?.toString();
    const message = data.get('message')?.toString();

    // Validate required fields
    if (!name || !email || !message) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Alla fält är obligatoriska.'
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Ogiltig e-postadress.'
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Get EmailJS credentials from environment variables
    const publicKey = import.meta.env.EMAILJS_PUBLIC_KEY;
    const serviceId = import.meta.env.EMAILJS_SERVICE_ID;
    const templateId = import.meta.env.EMAILJS_TEMPLATE_ID;

    console.log('Environment variables check:', {
      hasPublicKey: !!publicKey,
      hasServiceId: !!serviceId,
      hasTemplateId: !!templateId,
      publicKey: publicKey ? '***' + publicKey.slice(-4) : 'undefined',
      serviceId: serviceId ? '***' + serviceId.slice(-4) : 'undefined',
      templateId: templateId ? '***' + templateId.slice(-4) : 'undefined'
    });

    if (!publicKey || !serviceId || !templateId) {
      console.error('EmailJS credentials not configured');
      return new Response(
        JSON.stringify({
          success: false,
          message: 'E-posttjänsten är inte korrekt konfigurerad.'
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // For now, simulate email sending (replace with actual email service)
    console.log('Email would be sent with:', {
      to: 'your-email@example.com', // Replace with your actual email
      from: email,
      subject: `Contact form message from ${name}`,
      body: message
    });

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // TODO: Replace with actual email service implementation
    // Options: Nodemailer, SendGrid, Mailgun, Resend, etc.

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Meddelande skickat!'
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Email sending error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Meddelandet kunde inte skickas. Var god försök igen.'
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
};
