import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: 'dpkkaacjk',
  api_key: '775987195199584',
  api_secret: 'uLSlA65oNFr-jqWLGYmPPVElLT0',
});

// Define a function to generate the filename
const generateFilename = (req, file, cb) => {
  const filename = `${Date.now()}-${file.originalname}`;
  req.generatedFilename = filename; // Store the generated filename in the request object
  cb(null, filename);
};

// Create a storage engine for multer to use with Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'uploads', // Define your folder name in Cloudinary
    resource_type: 'raw', // Set the resource type as 'raw' for non-image files
    public_id: (req, file) => req.generatedFilename, // Use custom public_id (filename)
  },
});

// Create multer instance using the Cloudinary storage engine
const upload = multer({ storage });

export const config = {
  api: {
    bodyParser: false, // Disable default body parser
  },
};

const uploadExcelMiddleware = upload.single('ExcelFile');

const uploadExcelAPI = (req, res) => {
  uploadExcelMiddleware(req, res, async (err) => {
    if (err) {
      console.error(err);  // Log the detailed error
      return res.status(500).json({ error: 'Internal Server Error', details: err.message });
    }
    const filename = req.generatedFilename;
    console.log(filename);
    res.status(200).json({ success: true, filename });
  });
};

export default uploadExcelAPI;

// res.status(200).json({ success: true, filename });