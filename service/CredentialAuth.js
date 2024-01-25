const nodemailer = require("nodemailer");


export async function CredentialAuth(email, appPassword) {
  return new Promise(async (resolve, reject) => {
    try {
      // Step 1: Create a transporter
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: email,
          pass: appPassword,
        },
      });

      // Step 2: Verify email and password authentication
      await transporter.verify();
      console.log("Email and password authentication succeeded.");

      // You can now proceed with other requests or actions here

      resolve("Authentication successful"); // Resolve the promise to indicate success
    } catch (error) {
      console.log("Email and password authentication failed:", error);
      reject(error); // Reject the promise with the error
    }
  });
}
