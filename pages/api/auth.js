import { CredentialAuth } from "service/CredentialAuth";

const handler = async (req, res) => {
    try {
      const { method, body } = req;
  
      if (method === 'POST') {
        const { email, appPassword } = body;
        console.log("emails is:",email);
        console.log("password is:",appPassword);
        try {
          // Call CredentialAuth to authenticate email and password
          const authResult = await CredentialAuth(email, appPassword);
          
          // If authentication is successful, you can proceed with other actions
          // ...
          
          // Send a success response
          res.status(200).json({ message: 'Authentication successful', authResult });
        } catch (error) {
          console.error('Authentication failed:', error);
          res.status(400).json({ message: 'Authentication failed', error });
        }
      } else {
        res.status(405).json({ message: `Method ${method} Not Allowed` });
      }
    } catch (err) {
      res.status(400).json({ error_code: "api_one", message: err.message });
    }
  };
  
  export default handler;