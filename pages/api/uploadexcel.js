import multer from 'multer';

// Define a function to generate the filename
const generateFilename = (req, file, cb) => {
  const filename = `${Date.now()}-${file.originalname}`;
  req.generatedFilename = filename; // Store the generated filename in the request object
  cb(null, filename);
};

// Create a storage engine for multer to use
const storage = multer.diskStorage({
  destination: 'public/uploads', // Define your upload folder path
  filename: generateFilename, // Use the custom filename generator
});

// Create multer instance using the storage engine
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
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      const filename = req.generatedFilename; // Retrieve the generated filename from the request object
      console.log(filename);
      res.status(200).json({ success: true, filename });
    }
  });
};

export default uploadExcelAPI;
