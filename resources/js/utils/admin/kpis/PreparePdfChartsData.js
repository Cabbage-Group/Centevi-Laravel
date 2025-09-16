// utils/generateChartImages.js
import { captureElementAsImage } from "../../CaptureElementAsImage";

/**
 * generateChartsImages(items, options)
 *
 * items: Array<RefObject | { 
 *    ref: RefObject, 
 *    title?: string, 
 *    filters?: {rangeDate?: {start, end}, metrics?: [{label, value, color, active}], categories: [], dateFilter: []...} 
 *    description?: string, 
 *    notes?: string }>
 * 
 * options:
 *   - scale (number) - default 2
 *   - useCORS (boolean) - default true
 *   - backgroundColor (string) - default '#ffffff'
 *   - delay (ms) - wait before capturar (useful if layout necesita tiempo)
 *   - captureFn (async function) - función alternativa (ref, opts) => dataUrl (e.g. dom-to-image-more)
 *
 * Retorna: Promise<Array<{ chartImage, chartTitle?, chartFilters?, chartDescription?, chartNotes? }>>
 */
export async function preparePdfChartsData(pdfRawData = [], options = {}) {
  const {
    scale = 2,
    useCORS = true,
    backgroundColor = "#ffffff",
    delay = 0,
    captureFn = captureElementAsImage, // por defecto usa tu html2canvas wrapper
    // Propiedades específicas que no queremos pasar a captureFn
    ...rest
  } = options;

  // util sleep si se quiere esperar
  const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

  if (!Array.isArray(pdfRawData) || pdfRawData.length === 0) return [];

  // espera opcional para permitir layout/animaciones terminen
  if (delay > 0) await sleep(delay);

  const promises = pdfRawData.map(async (item) => {
    // item puede ser un ref o un objeto con meta
    const meta = item && item.ref ? item : { ref: item };
    const { ref, title = null, filters = null, description = null, notes = null } = meta;

    if (!ref || !ref.current) {
      console.warn("[generateChartsImages] ref no disponible para:", title || meta);
      return null;
    }

    try {
      // opciones que se pasan al captureFn
      const captureOptions = { scale, useCORS, backgroundColor, ...rest };
      const dataUrl = await captureFn(ref, captureOptions);
      return {
        chartImage: dataUrl,
        chartTitle: title,
        chartFilters: filters,
        chartDescription: description,
        chartNotes: notes,
      };
    } catch (err) {
      console.error("[generateChartsImages] error capturando:", title, err);
      return null;
    }
  });

  const results = await Promise.all(promises);
  return results.filter(Boolean);
}