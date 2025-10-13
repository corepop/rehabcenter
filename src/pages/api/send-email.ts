import type { APIRoute } from 'astro';

// Enable prerendering for API routes using Netlify Forms
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

    // Log form submission for Netlify Forms - will be captured automatically
    console.log('Contact form submission:', {
      name,
      email,
      message,
      timestamp: new Date().toISOString()
    });

    // For Netlify Forms, we don't need to manually send emails
    // Netlify will handle form submissions automatically
    // Just return success and let Netlify Forms process the data

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
    console.error('Form submission error:', error);
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
