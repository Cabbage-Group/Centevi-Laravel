/** Devuelve un nuevo array donde solo los metrics cuyos value estén en selectedValues quedan active: true */
export const setMetricsActiveByValues = (metrics = [], selectedValues = []) =>
  metrics.map((m) => ({ ...m, active: selectedValues.includes(m.value) }));

