module.exports = {
  apps: [
    {
      name: 'server',
      script: 'build/src/index.js', // Use ts-node as the script
      interpreter: 'node', // Important to specify interpreter as none
      env: {
        NODE_ENV: 'production', // Set environment to production,
        MONGODB_URI: process.env.MONGODB_URI,
        JWT_SECRET: process.env.JWT_SECRET,
        ADMIN_PASS: process.env.ADMIN_PASS,
        EXPRESS_SECRET: process.env.EXPRESS_SECRET,
        MAILCHIMP_API_KEY: process.env.MAILCHIMP_API_KEY,
      },
    },
  ],
};
