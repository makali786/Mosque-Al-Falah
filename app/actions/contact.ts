'use server'

interface ContactFormState {
  success?: boolean;
  message?: string;
  errors?: {
    name?: string;
    email?: string;
    topic?: string;
    message?: string;
  };
}

export async function submitContactForm(prevState: ContactFormState, formData: FormData): Promise<ContactFormState> {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const topic = formData.get('topic') as string;
  const message = formData.get('message') as string;
  const recipientEmail = formData.get('recipientEmail') as string;

  // Basic validation
  const errors: ContactFormState['errors'] = {};
  if (!name) errors.name = 'Name is required';
  if (!email) errors.email = 'Email is required';
  if (!message) errors.message = 'Message is required';
  
  if (Object.keys(errors).length > 0) {
    return { success: false, errors };
  }

  try {
    // In a real application, you would use a service like Resend, SendGrid, or Nodemailer here.
    // For now, we will log the email details to the console.
    
    console.log('--- Sending Email ---');
    console.log(`To: ${recipientEmail}`);
    console.log(`From: ${name} <${email}>`);
    console.log(`Topic: ${topic}`);
    console.log(`Message: ${message}`);
    console.log('---------------------');

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    return { success: true, message: 'Message sent successfully!' };
  } catch (error) {
    console.error('Failed to send email:', error);
    return { success: false, message: 'Failed to send message. Please try again.' };
  }
}
