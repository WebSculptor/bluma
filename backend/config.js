// config.js
module.exports = {
  email: {
    service: "gmail", // or your preferred email service
    auth: {
      user: process.env.ADMIN_EMAIL,
      pass: process.env.ADMIN_PASSWORD,
    },
  },
  jwtSecret: process.env.JWT_SECRET, // Replace with a strong secret
  frontendUrl: process.env.FRONTEND_URL, // URL where users will verify their email
};
