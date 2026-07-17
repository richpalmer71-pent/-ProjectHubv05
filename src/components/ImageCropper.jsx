import { useState, useRef, useEffect, useCallback } from "react";
import { C, ff, hd } from "./shared";

// Renders whatever's currently framed (image + scale + offset) onto a
// canvas sized to `w`x`h`. Used for both the live preview canvas and,
// at a higher target resolution, for the final baked export.
function paint(canvas, img, w, h, scale, offsetX, offsetY) {
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, w, h);
  const drawW = img.naturalWidth * scale;
  const drawH = img.naturalHeight * scale;
  const x = w / 2 - drawW / 2 + offsetX;
  const y = h / 2 - drawH / 2 + offsetY;
  ctx.drawImage(img, x, y, drawW, drawH);
}

export default function ImageCropper({ source, previewW, previewH, targetW, targetH, onConfirm, onCancel, onReplace }) {
  const canvasRef = useRef(null);
  const [img, setImg] = useState(null);
  const [scale, setScale] = useState(1);
  const [minScale, setMinScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const dragRef = useRef(null);

  useEffect(() => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.onload = () => {
      const fit = Math.max(previewW / image.naturalWidth, previewH / image.naturalHeight);
      setImg(image);
      setMinScale(fit);
      setScale(fit);
      setOffset({ x: 0, y: 0 });
    };
    image.src = source;
  }, [source]);

  const clampOffset = useCallback(
    (o, s) => {
      if (!img) return o;
      const drawW = img.naturalWidth * s;
      const drawH = img.naturalHeight * s;
      const maxX = Math.max(0, (drawW - previewW) / 2);
      const maxY = Math.max(0, (drawH - previewH) / 2);
      return { x: Math.max(-maxX, Math.min(maxX, o.x)), y: Math.max(-maxY, Math.min(maxY, o.y)) };
    },
    [img, previewW, previewH]
  );

  useEffect(() => {
    if (!img || !canvasRef.current) return;
    paint(canvasRef.current, img, previewW, previewH, scale, offset.x, offset.y);
  }, [img, scale, offset, previewW, previewH]);

  const startDrag = (e) => {
    dragRef.current = { startX: e.clientX, startY: e.clientY, origin: offset };
  };
  const onDrag = (e) => {
    if (!dragRef.current) return;
    const dx = e.clientX - dragRef.current.startX;
    const dy = e.clientY - dragRef.current.startY;
    setOffset(clampOffset({ x: dragRef.current.origin.x + dx, y: dragRef.current.origin.y + dy }, scale));
  };
  const endDrag = () => {
    dragRef.current = null;
  };

  const onZoom = (e) => {
    const s = parseFloat(e.target.value);
    setScale(s);
    setOffset((o) => clampOffset(o, s));
  };

  const [error, setError] = useState("");

  const handleConfirm = () => {
    if (!img) return;
    try {
      const ratio = targetW / previewW;
      const temp = document.createElement("canvas");
      paint(temp, img, targetW, targetH, scale * ratio, offset.x * ratio, offset.y * ratio);
      onConfirm(temp.toDataURL("image/jpeg", 0.92));
    } catch {
      setError("Can't crop this image — it's loaded from an external link that doesn't allow it. Use Replace and upload the file directly instead.");
    }
  };

  return (
    <div
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}
      onMouseMove={onDrag}
      onMouseUp={endDrag}
      onMouseLeave={endDrag}
    >
      <div style={{ background: C.card, borderRadius: 14, padding: 20, width: previewW + 40, maxWidth: "92vw" }}>
        <div style={{ fontSize: 11, ...hd, color: C.g50, fontFamily: ff, marginBottom: 12 }}>POSITION &amp; CROP</div>

        <div
          style={{
            width: previewW,
            maxWidth: "100%",
            aspectRatio: `${previewW} / ${previewH}`,
            overflow: "hidden",
            borderRadius: 8,
            background: "#111",
            cursor: dragRef.current ? "grabbing" : "grab",
            userSelect: "none",
          }}
          onMouseDown={startDrag}
        >
          <canvas ref={canvasRef} style={{ width: "100%", height: "100%", display: "block" }} />
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 14 }}>
          <span style={{ fontSize: 14, color: C.g50 }}>−</span>
          <input
            type="range"
            min={minScale}
            max={minScale * 3}
            step={(minScale * 3 - minScale) / 100 || 0.001}
            value={scale}
            onChange={onZoom}
            style={{ flex: 1, accentColor: C.blue }}
          />
          <span style={{ fontSize: 14, color: C.g50 }}>+</span>
        </div>
        <div style={{ fontSize: 10, color: C.g70, fontFamily: ff, textAlign: "center", marginTop: 4 }}>Drag to reposition · slide to zoom</div>
        {error && <div style={{ fontSize: 11, color: C.red, fontFamily: ff, marginTop: 10, lineHeight: 1.4 }}>{error}</div>}

        <div style={{ display: "flex", gap: 8, marginTop: 18 }}>
          <button
            onClick={onReplace}
            style={{ padding: "10px 14px", borderRadius: 10, border: `1px solid ${C.g88}`, background: C.panel, color: C.g50, fontSize: 10, ...hd, fontFamily: ff, cursor: "pointer" }}
          >
            Replace Image
          </button>
          <button
            onClick={onCancel}
            style={{ padding: "10px 14px", borderRadius: 10, border: `1px solid ${C.g88}`, background: C.panel, color: C.g50, fontSize: 10, ...hd, fontFamily: ff, cursor: "pointer" }}
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            style={{ flex: 1, padding: "10px 14px", borderRadius: 10, border: "none", background: C.black, color: C.card, fontSize: 10, ...hd, fontFamily: ff, cursor: "pointer" }}
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}
