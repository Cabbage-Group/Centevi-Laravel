import React from "react";
import { Document } from "@react-pdf/renderer";
import LayoutReportPdf from "../../LayoutReportPdf";
import { Page, View, Image, Text, StyleSheet } from "@react-pdf/renderer";

/**
 * Devuelve un pdf con graficas y sus titulos haciendo uso del layout para reportes
 * - charts = [{chartImage: imageBase64, chartTitle: string}] (array ded objetos imagen con su titutlo en texto)
 * - timeAverage = string
 */
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
    height: 260,
    objectFit: "contain"
  },

  filterTitle: { fontSize: 10, fontWeight: "bold", marginBottom: 2 },
  filterSubtitle: {
    fontSize: 9,
    marginTop: 2,
    marginBottom: 1,
    fontWeight: "bold"
  },
  filterItem: { fontSize: 9, marginBottom: 2, marginLeft: 6 },

  // ----- Estilos nuevos para "Tiempo Promedio" y su bloque de filtros ----
  timeLeft: {
    flex: 0.85,
    paddingRight: 8,
    justifyContent: "center"
  },
  timeLabel: { fontSize: 12, fontWeight: "bold", marginBottom: 6 },
  timeValue: { fontSize: 16, fontWeight: "bold", color: "#009688", marginBottom: 4 },
  timeSmallNote: { fontSize: 8, color: "#666", marginTop: 2 },

  // derecha: filtros en fila (horizontal) dentro de una card
  timeRight: {
    flex: 1.15,
    paddingLeft: 8
  },
  filtersRow: {
    flexDirection: "row",
    width: "100%",
    alignItems: "flex-start",
    justifyContent: "space-between"
  },
  filterCol: {
    flex: 1,
    paddingRight: 6
  },
  tinyLabel: { fontSize: 9, fontWeight: "bold", marginBottom: 4 },
  tinyValue: { fontSize: 9, marginBottom: 4 },

  badgeRow: { flexDirection: "row", flexWrap: "wrap" },
  badge: {
    borderRadius: 12,
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderWidth: 1,
    borderColor: "#ddd",
    fontSize: 8,
    marginRight: 4,
    marginBottom: 4
  }
});

const ChartsTiposLentesPdfReport = ({ chartsData = [], timeAverageData = {} }) => {
  // timeAverageData puede venir null = no mostrar la card de filtros
  const hasFiltersApplied = timeAverageData &&
    (
      (timeAverageData?.rangeDate?.start && timeAverageData?.rangeDate?.end) ||
      (timeAverageData?.rangePhase?.start || timeAverageData?.rangePhase?.end) ||
      (Array.isArray(timeAverageData?.type) && timeAverageData.type.length > 0)
    );

  return (
    <Document>
      <LayoutReportPdf HeaderTitle="Reporte KPIs Tipos de lentes">
        {/* BLOQUE TIEMPO PROMEDIO: Izquierda (info ~ la mitad menos) - Derecha (card de filtros en fila) */}
        <View style={{flexDirection: "row",width: "100%",alignItems: "flex-start", marginBottom: 8}}>
          {/* Izquierda: info (sin card) */}
          <View style={styles.timeLeft}>
            <Text style={styles.timeLabel}>Tiempo Promedio</Text>
            <Text style={styles.timeValue}>
              {timeAverageData?.info ?? "No definido"}
            </Text>
            <Text style={styles.timeSmallNote}>
              {hasFiltersApplied
                ? "Mostrado con los filtros aplicados a la derecha."
                : "Sin filtros aplicados — rango total."}
            </Text>
          </View>

          {/* Derecha: solo si timeAverageData existe */}
          {timeAverageData ? (
            <View style={styles.timeRight}>
              <View style={styles.filtersCard}>
                <Text style={{textAlign:'center', fontSize: 10, fontWeight: "bold", marginBottom: 2}}>
                  Filtros aplicados
                </Text>

                <View style={styles.filtersRow}>
                  {/* Columna 1: Fechas (renderiza líneas solo si existen) */}
                  <View style={styles.filterCol}>
                    <Text style={styles.tinyLabel}>Fechas</Text>
                    {timeAverageData?.rangeDate?.start != null && (
                      <Text style={styles.tinyValue}>De: {timeAverageData.rangeDate.start}</Text>
                    )}
                    {timeAverageData?.rangeDate?.end != null && (
                      <Text style={styles.tinyValue}>A : {timeAverageData.rangeDate.end}</Text>
                    )}
                    {/* Si ninguna existe, muestra 'No definido' */}
                    {timeAverageData?.rangeDate?.start == null && timeAverageData?.rangeDate?.end == null && (
                      <Text style={styles.tinyValue}>No definido</Text>
                    )}
                  </View>

                  {/* Columna 2: Fases (renderiza líneas solo si existen) */}
                  <View style={styles.filterCol}>
                    <Text style={styles.tinyLabel}>Fases</Text>
                    {timeAverageData?.rangePhase?.start != null && (
                      <Text style={styles.tinyValue}>De: {timeAverageData.rangePhase.start}</Text>
                    )}
                    {timeAverageData?.rangePhase?.end != null && (
                      <Text style={styles.tinyValue}>A: {timeAverageData.rangePhase.end}</Text>
                    )}
                    {timeAverageData?.rangePhase?.start == null && timeAverageData?.rangePhase?.end == null && (
                      <Text style={styles.tinyValue}>No definido</Text>
                    )}
                  </View>

                  {/* Columna 3: Tipos (renderiza badges solo si array tiene items) */}
                  <View style={styles.filterCol}>
                    <Text style={styles.tinyLabel}>Tipo(s) de lente</Text>
                    {Array.isArray(timeAverageData?.type) && timeAverageData.type.length > 0 ? (
                      <View >
                        {timeAverageData.type.map((t, i) => (
                          <Text key={i} style={styles.tinyValue}>{String(t)}</Text>
                        ))}
                      </View>
                    ) : (
                      <Text style={styles.tinyValue}>No seleccionado</Text>
                    )}
                  </View>
                </View>
              </View>
            </View>
          ) : null}
        </View>


        {/* GRÁFICOS */}
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

export default ChartsTiposLentesPdfReport;