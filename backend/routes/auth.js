const express = require("express");
const nodemailer = require("nodemailer");
const { email: emailConfig } = require("../config");
const { admin, db } = require("../database/firebaseAdmin");

const router = express.Router();

// In-memory store for OTPs (you can replace this with a database)
const otpStore = {};

// Generate a 6-digit OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Set up Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: emailConfig.service,
  auth: emailConfig.auth,
});

// Route to handle OTP requests
router.post("/send-otp", async (req, res) => {
  const { email, address, avatar, isSignIn } = req.body;

  if (!email || (!isSignIn && (!address || !avatar))) {
    return res
      .status(400)
      .json({ message: "Email, wallet address, and avatar are required" });
  }

  // Generate OTP and store it
  const otp = generateOTP();
  otpStore[email] = {
    otp,
    address,
    avatar,
    isSignIn,
    expires: Date.now() + 10 * 60 * 1000,
  }; // OTP expires in 10 minutes

  // Send the OTP via email
  const mailOptions = {
    from: emailConfig.auth.user,
    to: email,
    subject: "Your OTP Code",
    html: `
        <html>
 <head>
  <link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap" rel="stylesheet">
 </head>
<body style="font-family: Inter, sans-serif;
  font-optical-sizing: auto;">

<div style="display: flex; flex-direction: column; align-items: center; justify-content: center; background-color: #f7fafc; padding: 16px;">
  <div style="background-color: #fff; padding: 24px; border-radius: 8px; box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1); max-width: 28rem; width: 100%;">
    <h2 style="font-size: 1.25rem; font-weight: bold; margin-bottom: 16px;">OTP Verification</h2>
    <p style="color: #4a5568; margin-bottom: 16px;">
      Please enter this confirmation code to continue:
    </p>
    <div style="background-color: #f7fafc; font-size: 2.5rem; font-weight: bold; text-align: center; padding: 24px 16px; margin-bottom: 16px;">${otp}</div>
    <p style="color: #4a5568; margin-bottom: 10px;">Use the code to confirm your email.</p>
    <p style="color: #4a5568; font-size: 0.875rem; margin-bottom: 16px;">If you didn't create an account in Miro, please ignore this message.</p>
  </div>
</div>
 </body>
</html>
      `,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "OTP sent to your email" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ message: "Error sending email" });
  }
});

// Route to verify OTP
router.post("/verify-otp", async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ message: "Email and OTP are required" });
  }

  const storedOtpData = otpStore[email];

  if (!storedOtpData) {
    return res.status(400).json({ message: "Invalid OTP or email" });
  }

  if (storedOtpData.expires < Date.now()) {
    delete otpStore[email];
    return res.status(400).json({ message: "OTP has expired" });
  }

  if (storedOtpData.otp !== otp) {
    return res.status(400).json({ message: "Invalid OTP" });
  }

  // OTP is valid
  const { address, avatar, isSignIn } = storedOtpData;

  try {
    let userRecord;

    if (isSignIn) {
      // Sign in the user
      userRecord = await admin.auth().getUserByEmail(email);
      if (!userRecord) {
        return res.status(400).json({ message: "User not found" });
      }
    } else {
      // Register user in Firebase Auth and Firestore
      userRecord = await admin.auth().createUser({
        email,
        emailVerified: true,
      });

      await db.collection("users").doc(userRecord.uid).set({
        email,
        address,
        avatar,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    }

    delete otpStore[email]; // Remove OTP after successful verification

    res.status(200).json({
      message: "OTP verified successfully",
      user: { email, address, avatar },
    });
  } catch (error) {
    console.error("Something went wrong:", error);
    return res
      .status(500)
      .json({ message: `Something went wrong: ${error.message}` });
  }
});

module.exports = router;
