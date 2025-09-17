import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Document, Page, pdfjs } from 'react-pdf';
import api from '../services/api';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

type Rect = { xPct: number; yPct: number; wPct: number; hPct: number };
type Highlight = { _id: string; pageNumber: number; text: string; rects: Rect[] };

export default function Viewer() {
  const { uuid } = useParams();
  const [numPages, setNumPages] = useState<number>(0);
  const [scale, setScale] = useState(1.2);
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const fileUrl = `${import.meta.env.VITE_API_BASE || 'http://localhost:4000'}/api/pdfs/file/${uuid}`;

  useEffect(() => {
    if (!uuid) return;
    api.get(`/pdfs/${uuid}/highlights`).then(r => setHighlights(r.data)).catch(() => { });
  }, [uuid]);

  function onDocumentLoad({ numPages }: { numPages: number }) {
    setNumPages(numPages);
  }

  useEffect(() => {

    function onMouseUp() {
      const sel = window.getSelection();
      if (!sel || sel.isCollapsed) return;

      try {
        const range = sel.getRangeAt(0);
        let node: any = sel.anchorNode;
        while (node && node.dataset == null) node = node.parentElement;
        let el: HTMLElement | null = node instanceof HTMLElement ? node : (node ? node.parentElement : null);
        while (el && !el.dataset.page) el = el.parentElement;
        if (!el) { sel.removeAllRanges(); return; }
        const pageNumber = Number(el.dataset.page);
        if (!pageNumber) { sel.removeAllRanges(); return; }
        const clientRects = range.getClientRects();
        const pageRect = el.getBoundingClientRect();
        const rects: Rect[] = [];
        for (let i = 0; i < clientRects.length; i++) { const r = clientRects[i]; rects.push({ xPct: ((r.left - pageRect.left) / pageRect.width) * 100, yPct: ((r.top - pageRect.top) / pageRect.height) * 100, wPct: (r.width / pageRect.width) * 100, hPct: (r.height / pageRect.height) * 100 }); }
        const text = sel.toString();
        if (!text.trim() || rects.length === 0) { sel.removeAllRanges(); return; }
        api.post(`/pdfs/${uuid}/highlights`, { pageNumber, text, rects }).then(r => { setHighlights(prev => [...prev, r.data]); sel.removeAllRanges(); }).catch(() => sel.removeAllRanges());
      } catch (e) { }
    }
    window.addEventListener('mouseup', onMouseUp);
    return () => window.removeEventListener('mouseup', onMouseUp);
  }, [uuid]);

  function renderHighlights(page: number) {

    return highlights.filter(h => h.pageNumber === page).map(h => (
      <React.Fragment key={h._id}>
        {h.rects.map((r, i) => (
          <div key={i} className="absolute bg-yellow-300/50 pointer-events-none" style={{ left: `${r.xPct}%`, top: `${r.yPct}%`, width: `${r.wPct}%`, height: `${r.hPct}%` }} title={h.text} />
        ))}
      </React.Fragment>
    ));
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-2 mb-3">
        <button onClick={() => setScale(s => Math.max(0.6, s - 0.2))} className="p-1 border">-</button>
        <div>{Math.round(scale * 100)}%</div>
        <button onClick={() => setScale(s => s + 0.2)} className="p-1 border">+</button>
      </div>
      <Document file={fileUrl} onLoadSuccess={onDocumentLoad}>
        {Array.from({ length: numPages }).map((_, i) => (
          <div key={i} data-page={i + 1} className="relative mb-6">
            <Page pageNumber={i + 1} scale={scale} renderTextLayer />
            <div className="absolute inset-0">{renderHighlights(i + 1)}</div>
          </div>
        ))}
      </Document>
    </div>
  );
}
