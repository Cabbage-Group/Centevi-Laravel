import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('es-ES');
};

export const generatePdfPreview = (quoteDetails) => {
  const previewHTML = `
    <div id="pdf-content" style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; background: white;">
      <!-- Encabezado -->
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px;">
        <h1 style="font-size: 34px; color: #333; margin: 0; font-weight: 400;">COTIZACIÓN</h1>
        <div style="text-align: right;">
          <img src="/img/centevi.png" alt="CENTEVI Logo" style="height: 64px;" />
        </div>
      </div>

      <!-- Información principal en formato de 2 columnas y compañía a la derecha -->
      <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px; margin-bottom: 30px;">
       <div>
          <p style="font-size: 15px; color: #333; margin-bottom: 10px; font-weight: bold;">Para:</p>
          <p style="margin: 5px 0;">${quoteDetails?.paciente?.nombres && quoteDetails?.paciente?.apellidos ? 
            `${quoteDetails.paciente.nombres.trim()} ${quoteDetails.paciente.apellidos.trim()}` : 
            quoteDetails?.Cliente || ''}</p>
          <p style="font-size: 13px; margin: 5px 1px;">${quoteDetails?.paciente?.direccion || quoteDetails?.Direccion || ''}</p>
          <p style="margin: 5px 0;">T: ${quoteDetails?.paciente?.telefono || quoteDetails?.Telefono || ''}</p>
          <p style="margin: 5px 0;">C: ${quoteDetails?.paciente?.celular || quoteDetails?.Celular || ''}</p>
        </div>
        
        <div>
          <p style="font-size: 15px; color: #333; margin-bottom: 10px; font-weight: bold;">Cotización:</p>
          <p style="margin: 5px 0;"><strong># ${quoteDetails?.id || ''}</strong></p>
          <p style="margin: 5px 0;"><strong>Tipo:</strong> ${quoteDetails?.Type || ''}</p>
          <p style="margin: 5px 0;"><strong>Fecha:</strong> ${formatDate(quoteDetails?.Date) || ''}</p>
          <p style="margin: 5px 0;"><strong>Expira:</strong> ${formatDate(quoteDetails?.Expira) || ''}</p>
          <p style="margin: 5px 0;"><strong>Bodega:</strong> ${quoteDetails?.Bodega || ''}</p>
          <p style="margin: 5px 0;"><strong>Vendedor:</strong> ${quoteDetails?.Vendedor || ''}</p>
          <p style="margin: 5px 0;"><strong>Contacto:</strong> ${quoteDetails?.Contacto || ''}</p>
        </div>
        
        <div style="">
          <p style="font-size: 18px; color: #333; margin-bottom: 10px; font-weight: bold;">CENTEVI PANAMA, S.A.</p>
          <p style="margin: 5px 0;">155659660-2-2017 DV0</p>
          <p style="margin: 5px 0;">Tel.: 310-8222</p>
          <p style="margin: 5px 0;">centevipanama@email.com</p>
        </div>
      </div>

      <!-- Tabla de productos -->
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
        <thead>
          <tr style="background-color: #e6e6e6;">
            <th style="border: 1px solid #ccc; padding: 10px; text-align: left; font-weight: normal;">Código</th>
            <th style="border: 1px solid #ccc; padding: 10px; text-align: left; font-weight: normal;">Descripción</th>
            <th style="border: 1px solid #ccc; padding: 10px; text-align: center; font-weight: normal;">Unidades</th>
            <th style="border: 1px solid #ccc; padding: 10px; text-align: right; font-weight: normal;">Precio</th>
            <th style="border: 1px solid #ccc; padding: 10px; text-align: right; font-weight: normal;">Total</th>
          </tr>
        </thead>
        <tbody>
          ${quoteDetails?.lines?.map(line => `
            <tr>
              <td style="border: 1px solid #ccc; padding: 8px;">${line.Codigo || 'N/A'}</td>
              <td style="border: 1px solid #ccc; padding: 8px;">${line.Nombre || 'N/A'}</td>
              <td style="border: 1px solid #ccc; padding: 8px; text-align: center;">${Number(line.Unidades || 0).toFixed(2)}</td>
              <td style="border: 1px solid #ccc; padding: 8px; text-align: right;">${Number(line.Precio_Unitario || 0).toFixed(2)}</td>
              <td style="border: 1px solid #ccc; padding: 8px; text-align: right;">${Number(line.Total || 0).toFixed(2)}</td>
            </tr>
          `).join('') || `
            <tr>
              <td style="border: 1px solid #ccc; padding: 8px;">MP01</td>
              <td style="border: 1px solid #ccc; padding: 8px;"></td>
              <td style="border: 1px solid #ccc; padding: 8px; text-align: center;">2.00</td>
              <td style="border: 1px solid #ccc; padding: 8px; text-align: right;">62.50</td>
              <td style="border: 1px solid #ccc; padding: 8px; text-align: right;">120.38</td>
            </tr>
            <tr>
              <td style="border: 1px solid #ccc; padding: 8px;">DM18.191</td>
              <td style="border: 1px solid #ccc; padding: 8px;"></td>
              <td style="border: 1px solid #ccc; padding: 8px; text-align: center;">1.00</td>
              <td style="border: 1px solid #ccc; padding: 8px; text-align: right;">130.00</td>
              <td style="border: 1px solid #ccc; padding: 8px; text-align: right;">125.19</td>
            </tr>
          `}
        </tbody>
      </table>

      <!-- Notas y totales -->
      <div style="display: grid; grid-template-columns: 1fr 300px; gap: 30px;">
        <div>
          <p style="font-size: 15px; color: #333; margin-bottom: 10px; font-weight: bold;">Notas adicionales:</p>
          <p>${quoteDetails?.Comentario || '-- No hay notas adicionales --'}</p>
        </div>
        
        <div>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 5px 0; border-bottom: 1px solid #eee;">Sub-Total:</td>
              <td style="padding: 5px 0; border-bottom: 1px solid #eee; text-align: right;">${Number(quoteDetails?.SubTotal || 0.00).toFixed(2)}</td>
            </tr>
            <tr>
              <td style="padding: 5px 0; border-bottom: 1px solid #eee;">Descuento:</td>
              <td style="padding: 5px 0; border-bottom: 1px solid #eee; text-align: right;">${Number(quoteDetails?.Discount || 0.00).toFixed(2)}</td>
            </tr>
            <tr>
              <td style="padding: 5px 0; border-bottom: 1px solid #eee;">Sub-Total:</td>
              <td style="padding: 5px 0; border-bottom: 1px solid #eee; text-align: right;">${Number((quoteDetails?.SubTotal || 0.00) - (quoteDetails?.Discount || 0.00)).toFixed(2)}</td>
            </tr>
            <tr>
              <td style="padding: 5px 0; border-bottom: 1px solid #eee;">Otros:</td>
              <td style="padding: 5px 0; border-bottom: 1px solid #eee; text-align: right;">${Number(quoteDetails?.Otros || 0.00).toFixed(2)}</td>
            </tr>
            <tr>
              <td style="padding: 5px 0; border-bottom: 1px solid #eee;">Impuestos (%):</td>
              <td style="padding: 5px 0; border-bottom: 1px solid #eee; text-align: right;">${Number(quoteDetails?.Taxes || 0.00).toFixed(2)}</td>
            </tr>
            <tr style="background-color: #e6e6e6; font-weight: bold;">
              <td style="padding: 10px 5px;">Total:</td>
              <td style="padding: 10px 5px; text-align: right;">${Number(quoteDetails?.Total || 0.00).toFixed(2)}</td>
            </tr>
            <tr>
              <td style="padding: 5px 0; border-bottom: 1px solid #eee;">Abono:</td>
              <td style="padding: 5px 0; border-bottom: 1px solid #eee; text-align: right;">${Number(quoteDetails?.Abono || 0.00).toFixed(2)}</td>
            </tr>
            <tr>
              <td style="padding: 5px 0; border-bottom: 1px solid #eee;">Saldo Pendiente:</td>
              <td style="padding: 5px 0; border-bottom: 1px solid #eee; text-align: right;">${Number(quoteDetails?.SaldoPendiente || 0.00).toFixed(2)}</td>
            </tr>
          </table>
        </div>
      </div>

      <!-- Pie de página -->
      <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; display: flex; justify-content: space-between; font-size: 12px; color: #666;">
        <div style="display: flex; align-items: center;">
          <span style="margin-right: 5px;">📍</span> CENTEVI PANAMA, S.A. - PANAMA
        </div>
        <div style="display: flex; align-items: center;">
          <span style="margin-right: 5px;">📧</span> centevipanama@email.com
        </div>
        <div style="display: flex; align-items: center;">
          <span style="margin-right: 5px;">📞</span> 310-8222 /
        </div>
      </div>
    </div>
  `;
  
  return previewHTML;
};

const createTempElement = (htmlContent) => {
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = htmlContent;
  tempDiv.style.position = 'absolute';
  tempDiv.style.left = '-9999px';
  tempDiv.style.top = '-9999px';
  tempDiv.style.width = '800px';
  tempDiv.style.backgroundColor = 'white';
  document.body.appendChild(tempDiv);
  return tempDiv;
};

export const generatePDF = async (quoteDetails) => {
  try {
    const htmlContent = generatePdfPreview(quoteDetails);
    const tempElement = createTempElement(htmlContent);
    const canvas = await html2canvas(tempElement, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      width: 800,
      height: tempElement.scrollHeight
    });

    document.body.removeChild(tempElement);
  
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgWidth = 210;
    const pageHeight = 295; 
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;
    
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
    
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }
    
    return pdf;
  } catch (error) {
    console.error('Error generando PDF:', error);
    throw error;
  }
};

export const downloadPDF = async (quoteDetails) => {
  try {
    const doc = await generatePDF(quoteDetails);
    const fileName = `cotizacion_${quoteDetails?.id || 'sin_id'}_${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(fileName);
    return { success: true, fileName };
  } catch (error) {
    console.error('Error generando PDF:', error);
    return { success: false, error };
  }
};