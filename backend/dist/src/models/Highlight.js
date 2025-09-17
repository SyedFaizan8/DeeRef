import mongoose from 'mongoose';
const RectSchema = new mongoose.Schema({
    xPct: Number,
    yPct: Number,
    wPct: Number,
    hPct: Number
}, { _id: false });
const HighlightSchema = new mongoose.Schema({
    pdfUuid: { type: String, required: true, index: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    pageNumber: { type: Number, required: true },
    text: { type: String },
    rects: { type: [RectSchema], required: true }
}, { timestamps: true });
export default mongoose.model('Highlight', HighlightSchema);
