import express from 'express';
import multer from 'multer';
import { supabase } from '../config/supabase.js';
import path from 'path';

const router = express.Router();

// Use memory storage so we can upload directly to Supabase
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    const file = req.file;
    // Generate a unique filename using timestamp and original extension
    const ext = path.extname(file.originalname) || '.jpg';
    const filename = `${Date.now()}-${Math.round(Math.random() * 1E9)}${ext}`;

    // Upload to Supabase Storage bucket named 'menu-images'
    const { data, error } = await supabase.storage
      .from('menu-images')
      .upload(filename, file.buffer, {
        contentType: file.mimetype,
        upsert: false
      });

    if (error) {
      throw error;
    }

    // Get the public URL for the uploaded file
    const { data: { publicUrl } } = supabase.storage
      .from('menu-images')
      .getPublicUrl(filename);

    res.json({ url: publicUrl });
  } catch (error) {
    console.error('Upload Error:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
