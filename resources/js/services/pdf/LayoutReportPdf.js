import React from "react";
import { Document, Page, View, Text, Image, StyleSheet } from "@react-pdf/renderer";

const centeviLogo = "/img/centevi.png";

// pagina a4 tiene height: 841.89 y width: 595.28
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    paddingTop: 110,   // espacio para el header (igual a header.height)
    paddingBottom: 60, // espacio para el footer (igual a footer.height)
    fontSize: 10,
  },
  header: {
    flexDirection: 'row',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 100,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#E0F0EF',
    paddingHorizontal: 40,
  },
  footer: {
    flexDirection: 'row',
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 50,
    paddingHorizontal: 40,
    backgroundColor: '#E0F0EF',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  body: {
    flex: 1,
    paddingHorizontal: 40,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginRight: 130,
    color: '#1ABC9C'
  },
  logo: {
    width: 140,
    // añade height si quieres forzar la proporción y evitar reflows:
    // height: 60,
  },
  pageNumber: {
    fontSize: 10,
    color: "grey",
  }
});

const LayoutReportPdf = ({ HeaderTitle, children }) => {
  return (
    <Page size="A4" style={styles.page}>
      {/* Header fijo en todas las páginas */}
      <View style={styles.header} fixed>
        <Text style={styles.headerTitle}>{HeaderTitle}</Text>
        <Image src={centeviLogo} style={styles.logo} />
      </View>

      {/* Body dinámico (se paginará automáticamente) */}
      <View style={styles.body}>
        {children}
      </View>

      {/* Footer fijo en todas las páginas */}
      <View style={styles.footer} fixed>
        <Text>CENTEVI 2025 - todos los derechos reservados©</Text>
        <Text
          style={styles.pageNumber}
          render={({ pageNumber, totalPages }) =>
            `Página ${pageNumber} de ${totalPages}`
          }
        />
      </View>
    </Page>
  );
};

export default LayoutReportPdf;