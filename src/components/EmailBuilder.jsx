import { useState, useRef } from "react";
import JSZip from "jszip";
import { C, ff, hd, rad } from "./shared";
import ImageCropper from "./ImageCropper";

const bff = "'Athletics',Arial,Helvetica,sans-serif";
const CANVAS_W = 640;

// Served from /public/logos — relative path works fine inside the app;
// exported HTML needs an absolute URL since it'll be opened outside
// this app (Ometria, a downloaded file, etc).
const LOGO_PATH = "/logos/speedo-logo-red.png";
const SITE_ORIGIN = "https://chaos-lab-project-hub-v2.vercel.app";
const LOGO_URL_ABSOLUTE = SITE_ORIGIN + LOGO_PATH;

const DEFAULT_HERO_HEIGHT = 700;
const MIN_HERO_HEIGHT = 500;
const MAX_HERO_HEIGHT = 1000;

// ============================================================
// TEMPLATE REGISTRY
// One entry per template. Add new brands/layouts here as they're
// built — the picker and canvas both read off this list, nothing
// else needs to change.
// ============================================================
export const EMAIL_TEMPLATES = [
  { id: "speedo-qnd", brand: "Speedo", name: "QND Template", tiles: 6, live: true },
  { id: "vortexswim-promo", brand: "VortexSwim", name: "Promo", live: false },
  { id: "apextrail-qnd", brand: "Apex Trail", name: "QND Template", live: false },
];

const TILE_IDS = ["contentTile1", "contentTile2", "contentTile3", "contentTile4", "contentTile5", "contentTile6"];

// Convert any uploaded image file to a JPEG data URL, so whatever
// gets stored (and later exported) is a consistent, predictable format.
function fileToJpegDataUrl(file) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      URL.revokeObjectURL(objectUrl);
      resolve(canvas.toDataURL("image/jpeg", 0.9));
    };
    img.onerror = reject;
    img.src = objectUrl;
  });
}

function dataUrlToBlob(dataUrl) {
  const [meta, b64] = dataUrl.split(",");
  const mime = meta.match(/data:(.*);base64/)[1];
  const bin = atob(b64);
  const arr = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
  return new Blob([arr], { type: mime });
}

function slotSrc(src, forZip, slotId) {
  if (!src) return "";
  return forZip ? `images/${slotId}.jpg` : src;
}

// ============================================================
// EXPORT — reproduces the real Speedo "Template QND" markup
// (source: Figma node 1-6337) with brief data merged in. MSO/VML
// conditionals are kept intact for Outlook desktop compatibility.
// ============================================================
function buildSpeedoQndHtml({ heading, subheading, cta, secondaryCta, heroImage, gridImages, subjectLine, preHeader, heroHeight }, forZip) {
  const heroH = heroHeight || DEFAULT_HERO_HEIGHT;
  const hero = slotSrc(heroImage, forZip, "hero");

  const tileImg = (id) => {
    const src = slotSrc(gridImages[id], forZip, id);
    if (!src) return `<div style="width:100%;padding-bottom:100%;background:#C9C9C9;"></div>`;
    return `<a href="#" target="_blank"><img src="${src}" width="310" height="310" alt="" class="fluid-img" style="display:block;width:100%;height:auto;" /></a>`;
  };
  const tileRow = (a, b) => `
      <tr>
        <td style="padding-top:32px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td width="50%" valign="top" class="tile-cell" style="padding-right:10px;">
                ${tileImg(a)}
              </td>
              <td width="50%" valign="top" class="tile-cell" style="padding-left:10px;">
                ${tileImg(b)}
              </td>
            </tr>
          </table>
        </td>
      </tr>`;

  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<meta http-equiv="X-UA-Compatible" content="IE=edge" />
<title>${subjectLine || "Speedo"}</title>
<!--[if mso]>
<noscript>
<xml>
<o:OfficeDocumentSettings>
<o:PixelsPerInch>96</o:PixelsPerInch>
</o:OfficeDocumentSettings>
</xml>
</noscript>
<style>
  table {border-collapse:collapse;}
  td,th,div,p,a {font-family:Helvetica, Arial, sans-serif;}
</style>
<![endif]-->
<style>
  html, body { margin:0 !important; padding:0 !important; height:100% !important; width:100% !important; }
  * { -ms-text-size-adjust:100%; -webkit-text-size-adjust:100%; }
  table, td { mso-table-lspace:0pt; mso-table-rspace:0pt; }
  img { -ms-interpolation-mode:bicubic; border:0; height:auto; line-height:100%; outline:none; text-decoration:none; }
  a[x-apple-data-detectors] { color:inherit !important; text-decoration:none !important; }
  span.MsoHyperlink { color:inherit !important; }

  body { background-color:#FFFFFF; }
  .email-container { width:640px; max-width:640px; }
  .copy-pad { padding:0 50px; }
  .footer-text a { color:#1C1C1C; }

  @media only screen and (max-width:640px) {
    .email-container { width:100% !important; }
    .fluid-img { width:100% !important; height:auto !important; }
    .copy-pad { padding:0 24px !important; }
    .tile-cell { padding-bottom:16px !important; }
  }
</style>
</head>
<body style="margin:0; padding:0; background-color:#FFFFFF;">

  <div style="display:none; font-size:1px; line-height:1px; max-height:0; max-width:0; opacity:0; overflow:hidden; mso-hide:all;">
    ${preHeader || ""}
  </div>

  <center style="width:100%; background-color:#FFFFFF;">
  <!--[if mso]>
  <table role="presentation" align="center" width="640" cellpadding="0" cellspacing="0" border="0">
  <tr><td>
  <![endif]-->
  <table role="presentation" class="email-container" align="center" width="640" cellpadding="0" cellspacing="0" border="0" style="width:640px; max-width:640px; margin:0 auto;">

    <tr>
      <td align="center" valign="middle" height="120" style="height:120px; background-color:#FFFFFF;">
        <img src="${LOGO_URL_ABSOLUTE}" width="260" height="42" alt="Speedo" class="fluid-img" style="display:block; width:260px; height:42px; max-width:260px;" />
      </td>
    </tr>

    <tr>
      <td align="center" style="padding-top:32px; background-color:#FFFFFF;">
        ${hero ? `<img src="${hero}" width="640" height="${heroH}" alt="" class="fluid-img" style="display:block; width:100%; max-width:640px; height:auto;" />` : `<div style="width:640px;max-width:100%;height:${heroH}px;background:#C4C4C4;"></div>`}
      </td>
    </tr>

    <tr>
      <td align="center" class="copy-pad" style="padding-top:32px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td align="center" style="font-family:'Athletics', Helvetica, Arial, sans-serif; font-weight:700; font-size:28px; line-height:32px; color:#0B1A1E;">
              ${heading || ""}
            </td>
          </tr>
          <tr>
            <td align="center" style="padding-top:24px; font-family:'Athletics', Helvetica, Arial, sans-serif; font-weight:400; font-size:18px; line-height:26px; color:#0B1A1E;">
              ${subheading || ""}
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <tr>
      <td align="center" style="padding-top:32px;">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td align="center">
              <!--[if mso]>
              <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="#" style="height:48px;v-text-anchor:middle;width:160px;" arcsize="60%" strokecolor="#0B1A1E" fillcolor="#0B1A1E">
              <w:anchorlock/>
              <center style="color:#FFFFFF;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:bold;">${cta || ""}</center>
              </v:roundrect>
              <![endif]-->
              <!--[if !mso]><!-- -->
              <a href="#" target="_blank" style="background-color:#0B1A1E; border-radius:64px; color:#FFFFFF; display:inline-block; font-family:'Athletics', Helvetica, Arial, sans-serif; font-size:16px; font-weight:700; line-height:48px; text-align:center; text-decoration:none; text-transform:capitalize; padding:0 24px; -webkit-text-size-adjust:none;">${cta || ""}</a>
              <!--<![endif]-->
            </td>
            <td width="32" style="font-size:1px; line-height:1px;">&nbsp;</td>
            <td align="center">
              <!--[if mso]>
              <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="#" style="height:48px;v-text-anchor:middle;width:160px;" arcsize="60%" strokecolor="#0B1A1E" fillcolor="#0B1A1E">
              <w:anchorlock/>
              <center style="color:#FFFFFF;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:bold;">${secondaryCta || ""}</center>
              </v:roundrect>
              <![endif]-->
              <!--[if !mso]><!-- -->
              <a href="#" target="_blank" style="background-color:#0B1A1E; border-radius:64px; color:#FFFFFF; display:inline-block; font-family:'Athletics', Helvetica, Arial, sans-serif; font-size:16px; font-weight:700; line-height:48px; text-align:center; text-decoration:none; text-transform:capitalize; padding:0 24px; -webkit-text-size-adjust:none;">${secondaryCta || ""}</a>
              <!--<![endif]-->
            </td>
          </tr>
        </table>
      </td>
    </tr>
${tileRow(TILE_IDS[0], TILE_IDS[1])}${tileRow(TILE_IDS[2], TILE_IDS[3])}${tileRow(TILE_IDS[4], TILE_IDS[5])}

    <tr>
      <td align="center" style="padding-top:32px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td align="center" class="footer-text" style="font-family:'Athletics', Helvetica, Arial, sans-serif; font-size:12px; line-height:15px; color:#1C1C1C;">
              <a href="#" style="color:#1C1C1C; text-decoration:underline;">Update Preferences</a>
              &nbsp;&nbsp;&nbsp;
              <a href="#" style="color:#1C1C1C; text-decoration:underline;">Privacy Policy</a>
              &nbsp;&nbsp;&nbsp;
              <a href="#" style="color:#1C1C1C; text-decoration:underline;">Unsubscribe</a>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding-top:20px; font-family:'Athletics', Helvetica, Arial, sans-serif; font-size:12px; line-height:19px; color:#1C1C1C;">
              <strong>Speedo International Ltd.</strong><br />
              8 Manchester Square, London, United Kingdom, W1U 3PH
            </td>
          </tr>
          <tr>
            <td align="center" style="padding-top:20px; padding-bottom:32px; font-family:'Athletics', Helvetica, Arial, sans-serif; font-size:12px; line-height:15px; color:#1C1C1C;">
              All rights reserved. All trademarks acknowledged. For full terms and conditions click <a href="#" style="color:#1C1C1C; text-decoration:underline;">here</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>

  </table>
  <!--[if mso]>
  </td></tr>
  </table>
  <![endif]-->
  </center>

</body>
</html>`;
}

// ============================================================
// COMPONENT
// ============================================================
export default function EmailBuilder({
  templateId,
  onTemplateChange,
  heading,
  subheading,
  cta,
  secondaryCta,
  heroImage,
  onHeroImage,
  heroHeight,
  onHeroHeightChange,
  gridImages,
  onGridImagesChange,
  subjectLine,
  preHeader,
}) {
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  const [cropSlot, setCropSlot] = useState(null); // { slotId, source } while the crop modal is open
  const fileInputRef = useRef(null);
  const activeSlotRef = useRef(null);
  const tpl = EMAIL_TEMPLATES.find((t) => t.id === templateId) || EMAIL_TEMPLATES[0];
  const gi = gridImages || {};
  const hh = Math.max(MIN_HERO_HEIGHT, Math.min(MAX_HERO_HEIGHT, heroHeight || DEFAULT_HERO_HEIGHT));

  const flash = (msg) => {
    setStatus(msg);
    setTimeout(() => setStatus((s) => (s === msg ? "" : s)), 2500);
  };

  const clampHeight = (v) => Math.max(MIN_HERO_HEIGHT, Math.min(MAX_HERO_HEIGHT, v));

  const dragStateRef = useRef(null);
  const startDrag = (e) => {
    e.preventDefault();
    dragStateRef.current = { startY: e.clientY, startHeight: hh };
    window.addEventListener("mousemove", onDrag);
    window.addEventListener("mouseup", endDrag);
  };
  const onDrag = (e) => {
    if (!dragStateRef.current) return;
    const delta = e.clientY - dragStateRef.current.startY;
    onHeroHeightChange(clampHeight(Math.round(dragStateRef.current.startHeight + delta)));
  };
  const endDrag = () => {
    dragStateRef.current = null;
    window.removeEventListener("mousemove", onDrag);
    window.removeEventListener("mouseup", endDrag);
  };

  // Crop/export dimensions per slot. Preview is what you see while
  // dragging/zooming; target is the actual pixel size baked into the
  // final JPEG (2x the display size, for crisp export).
  const getSlotDims = (slotId) => {
    if (slotId === "hero") {
      const targetW = CANVAS_W * 2;
      const targetH = hh * 2;
      let previewW = 300;
      let previewH = previewW * (hh / CANVAS_W);
      if (previewH > 420) {
        previewH = 420;
        previewW = previewH * (CANVAS_W / hh);
      }
      return { previewW, previewH, targetW, targetH };
    }
    return { previewW: 260, previewH: 260, targetW: 620, targetH: 620 };
  };

  const currentSlotSrc = (slotId) => (slotId === "hero" ? heroImage : gi[slotId]);

  // Empty slot → pick a file. Filled slot → jump straight into
  // reposition/crop on the image that's already there.
  const openPicker = (slotId) => {
    const existing = currentSlotSrc(slotId);
    if (existing) {
      setCropSlot({ slotId, source: existing });
    } else {
      triggerFilePicker(slotId);
    }
  };

  const triggerFilePicker = (slotId) => {
    activeSlotRef.current = slotId;
    fileInputRef.current?.click();
  };

  const handleFile = async (e) => {
    const file = e.target.files[0];
    const slotId = activeSlotRef.current;
    e.target.value = "";
    if (!file || !slotId) return;
    try {
      const dataUrl = await fileToJpegDataUrl(file);
      setCropSlot({ slotId, source: dataUrl });
    } catch {
      flash("Couldn't read that image — try another file.");
    }
  };

  const handleCropConfirm = (dataUrl) => {
    if (!cropSlot) return;
    if (cropSlot.slotId === "hero") onHeroImage(dataUrl);
    else onGridImagesChange({ ...gi, [cropSlot.slotId]: dataUrl });
    setCropSlot(null);
    flash("Image updated.");
  };

  const handleCropCancel = () => setCropSlot(null);
  const handleCropReplace = () => {
    const slotId = cropSlot?.slotId;
    setCropSlot(null);
    if (slotId) triggerFilePicker(slotId);
  };

  const exportData = { heading, subheading, cta, secondaryCta, heroImage, gridImages: gi, subjectLine, preHeader, heroHeight: hh };

  const downloadFile = (filename, content, type) => {
    const blob = content instanceof Blob ? content : new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const handleExportHtml = () => {
    if (tpl.id !== "speedo-qnd") return flash("This template isn't wired up yet.");
    downloadFile(`${tpl.id}-email.html`, buildSpeedoQndHtml(exportData, false), "text/html");
    flash("HTML exported.");
  };

  const handleExportZip = async () => {
    if (tpl.id !== "speedo-qnd") return flash("This template isn't wired up yet.");
    const slotIds = ["hero", ...TILE_IDS].filter((id) => (id === "hero" ? heroImage : gi[id]));
    if (slotIds.length === 0) return flash("Add at least one image first.");
    setBusy(true);
    try {
      const zip = new JSZip();
      const imgFolder = zip.folder("images");
      slotIds.forEach((id) => {
        const src = id === "hero" ? heroImage : gi[id];
        imgFolder.file(`${id}.jpg`, dataUrlToBlob(src));
      });
      zip.file("email.html", buildSpeedoQndHtml(exportData, true));
      const content = await zip.generateAsync({ type: "blob" });
      downloadFile(`${tpl.id}-email-package.zip`, content, "application/zip");
      flash("Package downloaded.");
    } finally {
      setBusy(false);
    }
  };

  const handleSendToOmetria = () => {
    // Stub — real send needs Ometria's API or a Zapier webhook, same
    // pattern as the Dropbox folder creation already wired up in App.js.
    flash("Stubbed — needs Ometria API/Zapier hook.");
  };

  return (
    <div style={{ width: CANVAS_W, minWidth: CANVAS_W }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <span style={{ fontSize: 10, ...hd, color: C.g50, fontFamily: ff }}>EMAIL BUILDER</span>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <label style={{ fontSize: 9, ...hd, color: C.g50, fontFamily: ff }}>TEMPLATE</label>
          <select
            value={templateId}
            onChange={(e) => onTemplateChange(e.target.value)}
            style={{
              padding: "7px 10px",
              border: `1px solid ${C.g88}`,
              borderRadius: 8,
              fontSize: 11,
              fontWeight: 600,
              fontFamily: ff,
              background: C.bg,
              color: C.black,
              outline: "none",
              cursor: "pointer",
            }}
          >
            {Object.entries(
              EMAIL_TEMPLATES.reduce((acc, t) => {
                (acc[t.brand] = acc[t.brand] || []).push(t);
                return acc;
              }, {})
            ).map(([brand, tpls]) => (
              <optgroup key={brand} label={brand}>
                {tpls.map((t) => (
                  <option key={t.id} value={t.id} disabled={!t.live}>
                    {t.name}
                    {!t.live ? " (coming soon)" : ""}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>
      </div>

      {/* ---------- CANVAS ---------- */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 8, marginBottom: 8 }}>
        <label style={{ fontSize: 9, fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase", color: C.g50, fontFamily: ff }}>
          Hero height
        </label>
        <input
          type="number"
          value={hh}
          onChange={(e) => {
            const v = parseInt(e.target.value, 10);
            if (!isNaN(v)) onHeroHeightChange(clampHeight(v));
          }}
          min={MIN_HERO_HEIGHT}
          max={MAX_HERO_HEIGHT}
          style={{ width: 60, padding: "5px 8px", border: `1px solid ${C.g88}`, borderRadius: 6, fontSize: 11, fontFamily: ff, textAlign: "center", background: C.bg, color: C.black }}
        />
        <span style={{ fontSize: 9, color: C.g50, fontFamily: ff }}>px — or drag the handle on the hero</span>
      </div>

      <div style={{ width: CANVAS_W, background: "#fff", boxShadow: "0 8px 40px rgba(0,0,0,.5)" }}>
        {/* Header — fixed 120px cell, logo centered */}
        <div style={{ height: 120, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <img src={LOGO_PATH} alt="Speedo" width="260" height="42" style={{ display: "block", width: 260, height: 42 }} />
        </div>

        {/* Hero — resizable crop box */}
        <div style={{ position: "relative", width: CANVAS_W }}>
          <ImageSlot
            src={heroImage}
            onClick={() => openPicker("hero")}
            style={{ width: CANVAS_W, height: hh }}
            label={heroImage ? "Click to reposition or crop" : "Click to add hero image"}
          />
          <div
            onMouseDown={startDrag}
            title="Drag to resize"
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: -4,
              height: 10,
              cursor: "ns-resize",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 2,
            }}
          >
            <div style={{ width: 44, height: 5, borderRadius: 3, background: C.black, opacity: 0.65, boxShadow: "0 1px 3px rgba(0,0,0,.4)" }} />
          </div>
        </div>

        {/* Headline / body copy */}
        <div style={{ padding: "32px 50px 0", textAlign: "center" }}>
          <div style={{ fontFamily: bff, fontWeight: 700, fontSize: 28, lineHeight: "32px", color: "#0B1A1E", minHeight: "1em" }}>
            {heading || "Heading"}
          </div>
          <div style={{ fontFamily: bff, marginTop: 24, fontWeight: 400, fontSize: 18, lineHeight: "26px", color: "#0B1A1E", minHeight: "1em" }}>
            {subheading || "Body copy"}
          </div>
        </div>

        {/* CTAs */}
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 32, padding: "32px 24px 0" }}>
          <span
            style={{
              fontFamily: bff,
              display: "inline-block",
              fontWeight: 700,
              fontSize: 16,
              lineHeight: "48px",
              color: "#fff",
              background: "#0B1A1E",
              borderRadius: 64,
              padding: "0 24px",
              textAlign: "center",
              textTransform: "capitalize",
              whiteSpace: "nowrap",
            }}
          >
            {cta || "CTA"}
          </span>
          <span
            style={{
              fontFamily: bff,
              display: "inline-block",
              fontWeight: 700,
              fontSize: 16,
              lineHeight: "48px",
              color: "#fff",
              background: "#0B1A1E",
              borderRadius: 64,
              padding: "0 24px",
              textAlign: "center",
              textTransform: "capitalize",
              whiteSpace: "nowrap",
            }}
          >
            {secondaryCta || "Secondary CTA"}
          </span>
        </div>

        {/* Content tiles — 3 rows x 2 */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", columnGap: 20, rowGap: 32, padding: "32px 0 0" }}>
          {TILE_IDS.map((id) => (
            <ImageSlot key={id} src={gi[id]} onClick={() => openPicker(id)} tile label={gi[id] ? "Reposition" : "Add product"} />
          ))}
        </div>

        {/* Footer */}
        <div style={{ padding: "32px 0 32px", textAlign: "center" }}>
          <div style={{ display: "flex", justifyContent: "center", gap: 10, flexWrap: "wrap" }}>
            {["Update Preferences", "Privacy Policy", "Unsubscribe"].map((t) => (
              <span key={t} style={{ fontFamily: bff, fontSize: 12, lineHeight: "15px", color: "#1C1C1C", textDecoration: "underline" }}>
                {t}
              </span>
            ))}
          </div>
          <p style={{ fontFamily: bff, fontSize: 12, lineHeight: "19px", color: "#1C1C1C", margin: "20px 0 0" }}>
            <strong>Speedo International Ltd.</strong>
            <br />
            8 Manchester Square, London, United Kingdom, W1U 3PH
          </p>
          <p style={{ fontFamily: bff, fontSize: 12, lineHeight: "15px", color: "#1C1C1C", margin: "20px 32px 0" }}>
            All rights reserved. All trademarks acknowledged. For full terms and conditions click{" "}
            <span style={{ textDecoration: "underline" }}>here</span>
          </p>
        </div>
      </div>

      <div style={{ fontSize: 10, color: C.g70, marginTop: 10, lineHeight: 1.5, fontFamily: ff }}>
        Product grid images live here only — click a tile to add one, or click again to reposition/crop it.
      </div>

      {/* ---------- EXPORT ---------- */}
      <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
        <ExportBtn label="Export HTML" onClick={handleExportHtml} kind="primary" />
        <ExportBtn label="Download .zip" onClick={handleExportZip} kind="secondary" disabled={busy} />
      </div>
      <div style={{ marginTop: 8 }}>
        <ExportBtn label="Send to Ometria" onClick={handleSendToOmetria} kind="ometria" full />
      </div>
      <div style={{ fontSize: 10, color: C.g50, textAlign: "center", marginTop: 8, minHeight: 14, fontFamily: ff }}>{status}</div>

      <input ref={fileInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleFile} />

      {cropSlot &&
        (() => {
          const dims = getSlotDims(cropSlot.slotId);
          return (
            <ImageCropper
              source={cropSlot.source}
              previewW={dims.previewW}
              previewH={dims.previewH}
              targetW={dims.targetW}
              targetH={dims.targetH}
              onConfirm={handleCropConfirm}
              onCancel={handleCropCancel}
              onReplace={handleCropReplace}
            />
          );
        })()}
    </div>
  );
}

function ImageSlot({ src, onClick, style, tile, label }) {
  const [hover, setHover] = useState(false);
  const outer = tile
    ? { position: "relative", width: "100%", paddingBottom: "100%", cursor: "pointer", background: "#C4C4C4", overflow: "hidden" }
    : { position: "relative", cursor: "pointer", background: "#C4C4C4", overflow: "hidden", ...style };
  const inner = { position: "absolute", inset: 0 };
  return (
    <div style={outer} onClick={onClick} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
      <div style={inner}>
        {src && <img src={src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />}
        {(hover || !src) && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
              color: "#fff",
              background: !src ? "rgba(11,26,30,.55)" : "rgba(11,26,30,.45)",
              fontSize: tile ? 10 : 11,
              fontWeight: 600,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              textAlign: "center",
              padding: "0 12px",
            }}
          >
            <svg width={tile ? 14 : 20} height={tile ? 14 : 20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <path d="M21 15l-5-5L5 21" />
            </svg>
            {label}
          </div>
        )}
      </div>
    </div>
  );
}

function ExportBtn({ label, onClick, kind, disabled, full }) {
  const bg = kind === "primary" ? C.black : kind === "ometria" ? C.green : C.card;
  const color = kind === "primary" ? C.card : kind === "ometria" ? "#08331f" : C.black;
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        flex: full ? "1 1 100%" : 1,
        padding: "11px 10px",
        borderRadius: 10,
        border: kind === "secondary" ? `1px solid ${C.g88}` : "none",
        fontSize: 10,
        fontWeight: 600,
        letterSpacing: "0.03em",
        textTransform: "uppercase",
        fontFamily: ff,
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : 1,
        background: bg,
        color,
      }}
    >
      {label}
    </button>
  );
}
