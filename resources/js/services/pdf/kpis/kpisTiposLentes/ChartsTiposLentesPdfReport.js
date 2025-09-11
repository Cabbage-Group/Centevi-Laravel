import React from "react";
import { Document } from "@react-pdf/renderer";
import LayoutReportPdf from "../../LayoutReportPdf";
import { Page, View, Image, Text } from "@react-pdf/renderer";

/**
 * Devuelve un pdf con graficas y sus titulos haciendo uso del layout para reportes
 * - charts = [{chartImage: imageBase64, chartTitle: string}] (array ded objetos imagen con su titutlo en texto)
 * 
 */
const ChartsTiposLentesPdfReport = ({ charts = [] }) => {
  return (
    <Document>
      <LayoutReportPdf HeaderTitle="Reporte KPIs Tipos de lentes">
        {charts.map((c, idx) => (
          <View key={idx} style={{ marginBottom: 12 }}>
            <Text style={{ marginBottom: 6, fontSize: 12, fontWeight: "bold" }}>
              {c.chartTitle}
            </Text>
            {/* ajustar la altura según la resolución deseada */}
            <Image src={c.chartImage} style={{ height: 300 }} />
          </View>
        ))}
      </LayoutReportPdf>
    </Document>
  );
};

export default ChartsTiposLentesPdfReport;