export default ({ env }) => ({
  // Default config for NodeMailer Email Provider
  email: {
    config: {
      provider: 'nodemailer',
      providerOptions: {
        host: env('SMTP_HOST', 'smtp.magnificent.ae'),
        port: env('SMTP_PORT', 587),
        auth: {
          user: env('SMTP_USERNAME'),
          pass: env('SMTP_PASSWORD'),
        },
        // ... any custom nodemailer options
      },
      settings: {
        defaultFrom: env('EMAIL_DEFAULT_FROM'),
        defaultReplyTo: env('EMAIL_DEFAULT_FROM'),
      },
    },
  },
});
