import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
  
  // Destinazione File
  destination: (_req, _file, cb) => { cb(null, 'uploads/'); },

  // Nome File
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, uniqueSuffix + ext);
  }
});

const fileFilter = (_req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {

  //Tipi Permessi
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  if (allowedTypes.includes(file.mimetype)) cb(null, true);
    else cb(new Error('Tipo di file non supportato. Usa JPEG, PNG, GIF o WebP'));
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }
});

export default upload;