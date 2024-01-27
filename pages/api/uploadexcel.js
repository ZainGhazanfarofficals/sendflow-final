import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

cloudinary.config({
  cloud_name: 'dpkkaacjk',
  api_key: '775987195199584',
  api_secret: 'uLSlA65oNFr-jqWLGYmPPVElLT0',
});

const generateFilename = (req, file, cb) => {
  const filename = `${Date.now()}-${file.originalname}`;
  req.generatedFilename = filename;
  cb(null, filename);
};

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'uploads',
    resource_type: 'raw',
    public_id: (req, file) => req.generatedFilename,
  },
});

const upload = multer({ storage });
const uploadExcelMiddleware = upload.single('ExcelFile');

export default async (req, res) => {
  uploadExcelMiddleware(req, res, async (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Internal Server Error', details: err.message });
    }
    const filename = req.generatedFilename;
    res.status(200).json({ success: true, filename });
  });
};
