import React from "react";
import {
  Document,
  View,
  Image,
  Text,
  StyleSheet
} from "@react-pdf/renderer";
import LayoutReportPdf from "../../LayoutReportPdf";

const styles = StyleSheet.create({
  itemContainer: { marginBottom: 16 },
  title: { marginBottom: 6, fontSize: 12, fontWeight: "bold" },

  // fila cuando hay filtros: izquierda = gráfico (3), derecha = filtros (1)
  rowWithFilters: {
    flexDirection: "row",
    width: "100%",
    alignItems: "flex-start"
  },
  chartWrapper: {
    flex: 3,
    paddingRight: 8 // separación entre gráfico y filtros
  },
  filtersWrapper: {
    flex: 1,
    paddingLeft: 8
  },

  // "card" para los filtros
  filtersCard: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 4,
    padding: 6,
    backgroundColor: "#f9f9f9"
  },

  // si no hay filtros, la imagen ocupa todo
  fullChart: {
    width: "100%"
  },

  chartImage: {
    width: "100%",
    height: 227,
    objectFit: "contain"
  },

  filterTitle: { fontSize: 10, fontWeight: "bold", marginBottom: 4 },
  filterSubtitle: {
    fontSize: 9,
    marginTop: 4,
    marginBottom: 2,
    textDecoration: "underline"
  },
  filterItem: { fontSize: 9, marginBottom: 2, marginLeft: 6 }
});

const ChartsConsultasYTerapias = ({ charts = [] }) => {
  return (
    <Document>
      <LayoutReportPdf HeaderTitle="Reporte KPIs Terapias y consultas">
        {charts.map((c, idx) => {
          const hasFilters =
            c.chartFilters &&
            ((Array.isArray(c.chartFilters.metricFilter) &&
              c.chartFilters.metricFilter.length > 0) ||
              (Array.isArray(c.chartFilters.categoryFilter) &&
                c.chartFilters.categoryFilter.length > 0));

          return (
            <View key={idx} style={styles.itemContainer}>
              <Text style={styles.title}>{c.chartTitle}</Text>

              {hasFilters ? (
                <View style={styles.rowWithFilters}>
                  {/* columna del gráfico (3/4) */}
                  <View style={styles.chartWrapper}>
                    <Image src={c.chartImage} style={styles.chartImage} />
                  </View>

                  {/* columna de filtros (1/4) */}
                  <View style={styles.filtersWrapper}>
                    <View style={styles.filtersCard}>
                      <Text style={styles.filterTitle}>Filtros aplicados</Text>

                      {/* Métricas */}
                      {Array.isArray(c.chartFilters.metricFilter) &&
                        c.chartFilters.metricFilter.length > 0 && (
                          <>
                            <Text style={styles.filterSubtitle}>Métricas</Text>
                            {c.chartFilters.metricFilter.map((item, index) => (
                              <Text key={index} style={styles.filterItem}>
                                • {item}
                              </Text>
                            ))}
                          </>
                        )}

                      {/* Categorías */}
                      {Array.isArray(c.chartFilters.categoryFilter) &&
                        c.chartFilters.categoryFilter.length > 0 && (
                          <>
                            <Text style={styles.filterSubtitle}>Categorías</Text>
                            {c.chartFilters.categoryFilter.map(
                              (item, index) => (
                                <Text key={index} style={styles.filterItem}>
                                  • {item}
                                </Text>
                              )
                            )}
                          </>
                        )}
                    </View>
                  </View>
                </View>
              ) : (
                // sin filtros: imagen ocupa todo el ancho
                <View style={styles.fullChart}>
                  <Image src={c.chartImage} style={styles.chartImage} />
                </View>
              )}
            </View>
          );
        })}
      </LayoutReportPdf>
    </Document>
  );
};

export default ChartsConsultasYTerapias;