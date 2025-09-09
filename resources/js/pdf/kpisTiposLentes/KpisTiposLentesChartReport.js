// src/pdf/KpisTiposLentesChartReport.js
import React from "react";
import { Document, Page, View, Text, Image, StyleSheet } from "@react-pdf/renderer";

const centeviLogo = "/img/centevi.png";

const styles = StyleSheet.create({

  page: {
    paddingHorizontal: 40,
    paddingVertical: 20,
    fontFamily: "Helvetica",
    fontSize: 12,
  },
  headerContainer: {
    flexDirection: "row",
    marginBottom: 20,
    width: '100%',
    height: 40,
  },
  logoBox: {
    border: "1 solid black",
    width: 200,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    height: 20,
    marginRight: 8,
  },
  titleBox: {
    width: '100%',
    height: '100%',
    border: "1 solid black",
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "black",
    textAlign: "center",
  },





  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  card: {
    width: "48%",
    marginBottom: 16,
    border: "1 solid #00B894",
  },
  cardHeader: {
    backgroundColor: "#00B894",
    padding: 4,
  },
  cardTitle: {
    color: "#fff",
    fontSize: 11,
    textAlign: "center",
  },
  cardContent: {
    padding: 6,
    textAlign: "center",
  },
});

export const KpisTiposLentesChartReport = () => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.headerContainer}>
          <View style={styles.logoBox}>
            <Image src={centeviLogo} style={styles.logo} />
          </View>
          <View style={styles.titleBox}>
            <Text style={styles.title}>Reporte KPI - Tipos de Lentes</Text>
          </View>
        </View>

        {/* Grid de 4 secciones */}
        <View style={styles.grid}>
          {[1, 2, 3, 4].map((num) => (
            <View key={num} style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>Sección {num}</Text>
              </View>
              <View style={styles.cardContent}>
                <Text>Contenido de ejemplo {num}</Text>
              </View>
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
};