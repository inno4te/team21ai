import { FileText, Scissors, Layers, RotateCw, ScanText, Search } from "lucide-react";

const tools = [
  { icon: Search,   name: "Read & search",   note: "pdf.js" },
  { icon: Layers,   name: "Merge PDFs",      note: "pdf-lib" },
  { icon: Scissors, name: "Split pages",     note: "pdf-lib" },
  { icon: RotateCw, name: "Rotate",          note: "pdf-lib" },
  { icon: ScanText, name: "OCR scanned PDF", note: "Tesseract.js" },
  { icon: FileText, name: "Summarize",       note: "local text → LLM" }
];

// Week 5–6 module. The tool rail is laid out now so the shell, routing and
// lazy-loading are proven; each card becomes live as its engine lands.
export default function PdfTools() {
  return (
    <div className="max-w-3xl mx-auto px-4 md:px-6 py-8">
      <div className="border border-dashed border-edge rounded-2xl p-8 text-center bg-surface/40">
        <FileText className="mx-auto text-orange" size={28} />
        <p className="font-display font-bold text-xl mt-4">PDF tools land in weeks 5–6</p>
        <p className="text-muted text-sm mt-2 max-w-md mx-auto">
          Everything below will run in your browser — your PDF never leaves this device.
        </p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-6">
        {tools.map(t => (
          <div key={t.name} className="border border-edge bg-surface rounded-xl p-4">
            <t.icon size={18} className="text-orange" />
            <p className="text-sm font-medium mt-2.5">{t.name}</p>
            <p className="font-mono text-[10px] text-muted mt-1">{t.note}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
