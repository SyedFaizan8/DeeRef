import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import Pdf from '../models/Pdf.js';
import Highlight from '../models/Highlight.js';
import { UPLOAD_DIR } from '../config.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { auth } from '../middlewares/auth.js';
const router = Router();
if (!fs.existsSync(UPLOAD_DIR))
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, UPLOAD_DIR),
    filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({
    storage, fileFilter: (req, file, cb) => {
        if (!file.mimetype.includes('pdf'))
            cb(new Error('Only PDF allowed'));
        else
            cb(null, true);
    }
});
// Upload
router.post('/upload', auth, upload.single('file'), asyncHandler(async (req, res) => {
    if (!req.file)
        return res.status(400).json({ message: 'file required' });
    const fileUuid = uuidv4();
    const pdf = await Pdf.create({ uuid: fileUuid, filename: req.file.originalname, filepath: path.resolve(req.file.path), owner: req.userId, title: req.body.title || req.file.originalname });
    res.json(pdf);
}));
// List user's PDFs
router.get('/', auth, asyncHandler(async (req, res) => {
    const list = await Pdf.find({ owner: req.userId }).sort({ createdAt: -1 });
    res.json(list);
}));
// Get metadata
router.get('/:uuid', auth, asyncHandler(async (req, res) => {
    const pdf = await Pdf.findOne({ uuid: req.params.uuid, owner: req.userId });
    if (!pdf)
        return res.status(404).json({ message: 'not found' });
    res.json(pdf);
}));
// Serve file (optional auth check: here public but path is unguessable via uuid)
router.get('/file/:uuid', asyncHandler(async (req, res) => {
    const pdf = await Pdf.findOne({ uuid: req.params.uuid });
    if (!pdf)
        return res.status(404).send('not found');
    res.sendFile(pdf.filepath);
}));
// Highlights
router.get('/:uuid/highlights', auth, asyncHandler(async (req, res) => {
    const items = await Highlight.find({ pdfUuid: req.params.uuid, user: req.userId });
    res.json(items);
}));
router.post('/:uuid/highlights', auth, asyncHandler(async (req, res) => {
    const { pageNumber, text, rects } = req.body;
    if (!pageNumber || !rects)
        return res.status(400).json({ message: 'pageNumber + rects required' });
    const h = await Highlight.create({ pdfUuid: req.params.uuid, user: req.userId, pageNumber, text, rects });
    res.json(h);
}));
router.put('/:uuid/highlights/:id', auth, asyncHandler(async (req, res) => {
    const h = await Highlight.findOneAndUpdate({ _id: req.params.id, user: req.userId }, req.body, { new: true });
    if (!h)
        return res.status(404).json({ message: 'not found' });
    res.json(h);
}));
router.delete('/:uuid/highlights/:id', auth, asyncHandler(async (req, res) => {
    const h = await Highlight.findOneAndDelete({ _id: req.params.id, user: req.userId });
    if (!h)
        return res.status(404).json({ message: 'not found' });
    res.json({ success: true });
}));
// Delete PDF (also remove file)
router.delete('/:uuid', auth, asyncHandler(async (req, res) => {
    const pdf = await Pdf.findOneAndDelete({ uuid: req.params.uuid, owner: req.userId });
    if (!pdf)
        return res.status(404).json({ message: 'not found' });
    try {
        fs.unlinkSync(pdf.filepath);
    }
    catch (e) { /* ignore */ }
    await Highlight.deleteMany({ pdfUuid: req.params.uuid, user: req.userId });
    res.json({ success: true });
}));
export default router;
