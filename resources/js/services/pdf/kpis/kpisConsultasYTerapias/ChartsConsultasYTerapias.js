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
    height:280,
    objectFit: "contain"
  },

  filterTitle: { fontSize: 10, fontWeight: "bold", marginBottom: 2 },
  filterSubtitle: {
    fontSize: 9,
    marginTop: 2,
    marginBottom: 1,
    fontWeight: "bold"
  },
  filterItem: { fontSize: 9, marginBottom: 2, marginLeft: 6 }
});

const ChartsConsultasYTerapias = ({ chartsData = [] }) => {
  return (
    <Document>
      <LayoutReportPdf HeaderTitle="Reporte KPIs Terapias y consultas">
        {chartsData.map((c, idx) => {
          const hasFilters =
            c.chartFilters &&
            ((Array.isArray(c.chartFilters.metrics) &&
              c.chartFilters.metrics.length > 0) ||
              (Array.isArray(c.chartFilters.categories) &&
                c.chartFilters.categories.length > 0));

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
                      {Array.isArray(c.chartFilters.metrics) &&
                        c.chartFilters.metrics.filter(item => item.active).length > 0 && (
                          <>
                            <Text style={styles.filterSubtitle}>Métricas</Text>
                            <View style={{ flexDirection: "column", paddingLeft: 4 }}>
                              {c.chartFilters.metrics
                                .filter(item => item.active)
                                .map((item, index) => (
                                  <View
                                    key={index}
                                    style={{ flexDirection: "row", alignItems: "center", marginBottom: 1, }}
                                  >
                                    <View
                                      style={{
                                        width:7,
                                        height: 7,
                                        borderRadius: 2,
                                        marginRight: 2,
                                        backgroundColor: item.color || "#000",
                                      }}
                                    />
                                    <Text style={{fontSize: 9}}>{item.label}</Text>
                                  </View>
                                ))}
                            </View>
                          </>
                        )}

                      {/* Categorías */}
                      {Array.isArray(c.chartFilters.categories) &&
                        c.chartFilters.categories.length > 0 && (
                          <>
                            <Text style={styles.filterSubtitle}>Categorías</Text>
                            <View>
                              {c.chartFilters.categories.map((item, index) => (
                                <View
                                  key={index}
                                  style={{
                                    flexDirection: "row",
                                    alignItems: "flex-start",
                                    marginBottom: 2,
                                    paddingLeft: 4
                                  }}
                                >
                                  {/* viñeta */}
                                  <Text style={{ width: 8, fontSize: 9 }}>•</Text>
                                  {/* texto de la categoría */}
                                  <Text style={{ flex: 1, fontSize: 9 }}>{item}</Text>
                                </View>
                              ))}
                            </View>
                          </>
                        )}

                        {/* fecha */}
                        {c.chartFilters.rangeDate?.start && c.chartFilters.rangeDate?.end && (
                          <>
                            <Text style={styles.filterSubtitle}>Rango de fechas</Text>
                            <Text style={{ fontSize: 9, marginLeft: 4 }}>De: {c.chartFilters.rangeDate.start}</Text>
                            <Text style={{ fontSize: 9, marginLeft: 4 }}>A : {c.chartFilters.rangeDate.end}</Text>
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