import React, { useState } from "react";
import { DatePicker, Button, ConfigProvider, Col, Row, Tooltip } from "antd";
import dayjs from "dayjs";
import "dayjs/locale/es";
import locale from "antd/es/locale/es_ES";

import { ClearOutlined } from "@ant-design/icons";

dayjs.locale("es");

const { RangePicker } = DatePicker;

const DateRangeSeparate = ({
  onApply,
  onReset,
  disableDateRangeLimit,
  isMonthPicker,
  showOneLine = true,
}) => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [hovered, setHovered] = useState(false);

  const handleStartDateChange = (date) => {
    if (!date) {
      setStartDate(null);
      setEndDate(null);
      return;
    }
    const newStartDate = date.startOf("month");
    setStartDate(newStartDate);
    setEndDate(null);
  };

  const handleEndDateChange = (date) => {
    if (!date) {
      setEndDate(null);
      return;
    }
    const newEndDate = date.endOf("month");
    setEndDate(newEndDate);
    onApply?.(startDate.format("YYYY-MM-DD"), newEndDate.format("YYYY-MM-DD"));
  };

  const disabledEndDate = (current) => {
    if (!startDate || !current || disableDateRangeLimit) return false;
    const minDate = startDate.startOf("day");
    const maxDate = startDate.add(30, "day").endOf("day");
    return current.isBefore(minDate) || current.isAfter(maxDate);
  };

  /**
   * Nuevos cambios
   */

  // controla el comportamiento de qué fechas se pueden seleccionar (usa startDate actual)
  const disabledRangeDate = (current) => {
    if (disableDateRangeLimit) return false;
    if (!startDate || !current) return false;
    // ...tu lógica si quieres límite...
  };

  // se llama mientras el usuario navega/selecciona en el calendario.
  // nos permite capturar el `start` tan pronto lo elija para que disabledDate funcione.
  const handleCalendarChange = (dates) => {
    if (!dates || !dates[0]) {
      setStartDate(null);
      return;
    }
    const s = dates[0];
    setStartDate(isMonthPicker ? s.startOf("month") : s.startOf("day"));
  };

  // se llama cuando el usuario confirma el rango (o lo limpia)
  const handleRangeChange = (dates) => {
    if (!dates || !dates.length) {
      // limpia
      setStartDate(null);
      setEndDate(null);
      onReset?.();
      return;
    }

    const [s, e] = dates;
    if (!s) {
      setStartDate(null);
      setEndDate(null);
      return;
    }

    const start = isMonthPicker ? s.startOf("month") : s.startOf("day");
    setStartDate(start);

    if (e) {
      const end = isMonthPicker ? e.endOf("month") : e.endOf("day");
      setEndDate(end);
      // notifica al padre con el mismo formato que tenías
      onApply?.(start.format("YYYY-MM-DD"), end.format("YYYY-MM-DD"));
    } else {
      setEndDate(null);
    }
  };

  return (
    <div style={{ width: "100%" }}>
      <label>Buscar por Fecha:</label>
      <Row>
        <Col span={24}>
          <ConfigProvider locale={locale}>
            <Row gutter={[8, 8]}>
              {/* Columna del RangePicker */}
              <Col
                xxl={showOneLine ? 24 : 24}
                xl={showOneLine ? 24 : 24}
                lg={showOneLine ? 24 : 24}
                md={showOneLine ? 24 : 24}
                sm={showOneLine ? 24 : 24}
                xs={24}
              >
                <RangePicker
                  value={startDate || endDate ? [startDate, endDate] : undefined}
                  onChange={handleRangeChange}
                  onCalendarChange={handleCalendarChange}
                  disabledDate={disabledRangeDate}
                  picker={isMonthPicker ? "month" : undefined}
                  format={isMonthPicker ? "YYYY-MM" : "YYYY-MM-DD"}
                  locale="es"
                  style={{ width: "100%" }}
                  allowClear
                />
              </Col>

              {/* Columna del botón */}
              {/* <Col
                xxl={showOneLine ? 4 : 24}
                xl={showOneLine ? 4 : 24}
                lg={showOneLine ? 4 : 24}
                md={showOneLine ? 4 : 24}
                sm={showOneLine ? 4 : 24}
                xs={24}
              >
                <Tooltip title='Limpiar fecha'>
                  <Button
                  type="default"
                    style={{
                      width: "32px",
                      borderColor: hovered ? "#00ab9b" : "#006b61",
                      color: hovered ? "#00ab9b" : "#006b61",
                      borderRadius: "12px",
                    }}
                    icon={<ClearOutlined />}
                    onMouseEnter={() => setHovered(true)}
                    onMouseLeave={() => setHovered(false)}
                    onClick={() => {
                      setStartDate(null);
                      setEndDate(null);
                      onReset?.();
                    }}
                  />
                </Tooltip>
              </Col> */}
            </Row>
          </ConfigProvider>
        </Col>
      </Row>
    </div>
  );
};

export default DateRangeSeparate;