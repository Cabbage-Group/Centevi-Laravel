// utils/CaptureElementAsImage.js
import html2canvas from "html2canvas";

export const captureElementAsImage = async (ref, options = {}) => {
  if (!ref || !ref.current) throw new Error("ref no válida");
  const defaults = {
    scale: 2,
    useCORS: true,
    backgroundColor: "#ffffff",
    // puedes añadir allowTaint, logging, etc
  };
  const opts = { ...defaults, ...options };
  const canvas = await html2canvas(ref.current, opts);
  return canvas.toDataURL("image/png");
};