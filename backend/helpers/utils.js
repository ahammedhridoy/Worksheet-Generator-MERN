const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");
const prisma = require("../utils/prismaClient");
dotenv.config();

// Generate unique token
function generateToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });
}

// Store token in database
async function storeTokenInDatabase(email, token) {
  try {
    await prisma.resetToken.create({
      data: {
        email,
        token,
      },
    });
    console.log("Token stored in database");
  } catch (error) {
    console.error("Error storing token in database:", error);
  }
}

// Send password reset email
async function sendPasswordResetEmail(email, token) {
  // Create Nodemailer transporter
  let transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.SMTP_AUTH_USER,
      pass: process.env.SMTP_AUTH_PASSWORD,
    },
  });

  // Send email with password reset link
  await transporter.sendMail({
    from: process.env.SENDER_EMAIL,
    to: email,
    subject: `Want to contact from (WorkSheet)`,
    priority: "high",
    html: `
      <div style="width: 100%; height: auto; padding: 15px 10px; text-align: center;">
      <h1 style="font-size: 25px;">Hi ${email}</h1>
      <div>
        <p>You have requested to reset your password. Please click on the button below to continue.<br>The link will expire within 2 minutes.</p>
        <a href="${process.env.CLIENT_DOMAIN_NAME}/reset-password/${token}}" style="background: green; color: white; font-weight: 500; font-size: 17px; padding: 7px 15px; text-decoration: none; border-radius: 6px; margin-top: 7px">Reset Password</a>
      </div>
    <div>
    `,
  });
}

// Validate token and get email
async function validateTokenAndGetEmail(token) {
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  try {
    const resetToken = await prisma.resetToken.findFirst({
      where: {
        email: decoded.email,
        token,
      },
    });
    if (!resetToken) {
      throw new Error("Invalid token");
    }
    return resetToken.email;
  } catch (error) {
    console.error("Error validating token and getting email:", error);
    throw error;
  }
}

// Update password
async function updatePassword(email, newPassword) {
  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { email },
      data: { password: hashedPassword },
    });
    console.log("Password updated successfully");
  } catch (error) {
    console.error("Error updating password:", error);
    throw error;
  }
}

// Invalidate token
async function invalidateToken(token) {
  try {
    // Delete the single token with the specified token value
    await prisma.resetToken.deleteMany({
      where: {
        token: { equals: token },
      },
    });

    console.log("Token invalidated successfully");
  } catch (error) {
    console.error("Error invalidating token:", error);
    throw error;
  }
}

module.exports = {
  generateToken,
  storeTokenInDatabase,
  sendPasswordResetEmail,
  validateTokenAndGetEmail,
  updatePassword,
  invalidateToken,
};
