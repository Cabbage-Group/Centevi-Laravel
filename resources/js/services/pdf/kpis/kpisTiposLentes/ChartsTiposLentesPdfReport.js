import React from 'react'
import { Document, Text } from "@react-pdf/renderer";
import LayoutReportPdf from '../../LayoutReportPdf';


/**
 * - charts: [{chart, title}] (graficos y sus titulos)
 * 
 * @returns 
 */
const ChartsTiposLentesPdfReport = ({charts}) => {
  return (
    <Document>
      <LayoutReportPdf HeaderTitle="REPORTES KPIS TIPOS DE LENTES">
        <Text>Hola mundo</Text>

      </LayoutReportPdf>
    </Document>
  );
}

export default ChartsTiposLentesPdfReport;