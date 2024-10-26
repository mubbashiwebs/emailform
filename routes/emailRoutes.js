import express from 'express';
import { addAuth, submitCareerForm, submitContactForm, test } from '../controllers/emailController.js';
import multer from 'multer';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

// Define routes
router.post('/addAuth', addAuth);
router.post('/submitCareerForm', upload.single('cv'), submitCareerForm);
router.post('/submitContactForm', submitContactForm);
router.get('/test', test);

export default router;
