import mongoose from 'mongoose';

const PdfSchema = new mongoose.Schema({
    uuid: { type: String, required: true, index: true },
    filename: { type: String, required: true },
    filepath: { type: String, required: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String }
}, { timestamps: true });

export default mongoose.model('Pdf', PdfSchema);