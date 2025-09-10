# Email Form Setup Instructions

This project now includes an email contact form using EmailJS for client-side email sending.

## Setup Steps

### 1. Create EmailJS Account
1. Go to [https://www.emailjs.com/](https://www.emailjs.com/)
2. Create a free account
3. Verify your email

### 2. Set up Email Service
1. In your EmailJS dashboard, go to "Email Services"
2. Add a new service (Gmail, Outlook, etc.)
3. Follow the setup wizard to connect your email account
4. Note down your **Service ID**

### 3. Create Email Template
1. Go to "Email Templates" in your dashboard
2. Create a new template with these variables:
   - `{{from_name}}` - Sender's name
   - `{{from_email}}` - Sender's email
   - `{{message}}` - Message content
3. Note down your **Template ID**

### 4. Get Your Public Key
1. Go to "Account" → "General"
2. Copy your **Public Key**

### 5. Configure the Form
Edit `src/components/ui/Form.astro` and replace the placeholder values:

```javascript
// Replace these lines in the script section:
emailjs.init('YOUR_PUBLIC_KEY'); // ← Replace with your actual public key

// And in the sendForm call:
emailjs.sendForm('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', form) // ← Replace with your actual IDs
```

## Usage

The form is already integrated into the Contact page (`/contact`). Users can:
- Fill out the name, email, and message fields
- Submit the form to send an email directly to your configured email service
- See success/error messages after submission

## Features

- ✅ Client-side validation
- ✅ Email sending via EmailJS
- ✅ Success/error message display
- ✅ Form reset after successful submission
- ✅ Responsive design with Tailwind CSS

## Security Note

✅ **Security has been improved!** The email service now uses server-side processing, so credentials are no longer visible in the browser.

### What Changed:
- Email sending moved to server-side API endpoint (`/api/send-email`)
- Credentials stored securely in environment variables (`.env` file)
- Client-side code no longer contains sensitive information
- Added proper input validation and error handling
- Switched to server-side rendering (SSR) mode

### Current Status:
🟡 **Working with simulation** - The form works but currently simulates email sending. See below for production setup.

### Environment Variables Required:
Make sure your `.env` file contains:
```
EMAILJS_PUBLIC_KEY=your_public_key_here
EMAILJS_SERVICE_ID=your_service_id_here
EMAILJS_TEMPLATE_ID=your_template_id_here
```

### Security Benefits:
- ✅ Credentials not exposed in browser
- ✅ Server-side validation
- ✅ Proper error handling
- ✅ No client-side API keys visible

## Production Email Setup

The current implementation simulates email sending. For production, choose one of these options:

### Option 1: EmailJS Server-Side (Recommended)
Install the proper EmailJS server package:
```bash
npm uninstall @emailjs/nodejs @emailjs/browser
npm install @emailjs/server
```

Then update `src/pages/api/send-email.ts` to use the server package.

### Option 2: Nodemailer (Free & Customizable)
```bash
npm install nodemailer
```

Replace the simulation code with actual SMTP sending.

### Option 3: Third-Party Services
- **SendGrid**: `npm install @sendgrid/mail`
- **Mailgun**: `npm install mailgun-js`
- **Resend**: `npm install resend`
- **Postmark**: `npm install postmark`

Each service requires API keys in your `.env` file.
