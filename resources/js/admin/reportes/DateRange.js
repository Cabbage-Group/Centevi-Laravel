import React, { useState } from "react";
import { DatePicker, Button, ConfigProvider, Col, Row } from "antd";
import dayjs from "dayjs";
import "dayjs/locale/es";
import locale from "antd/es/locale/es_ES";

dayjs.locale("es");

const DateRangeSeparate = ({
  onApply,
  onReset,
  disableDateRangeLimit,
  isMonthPicker,
  showOneLine = true,
}) => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

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

  return (
    <div>
      <label>Buscar por Fecha:</label>
      <Row gutter={[16, 16]}>
        <Col xxl={16} xl={16} md={16}>
          <ConfigProvider locale={locale}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <Row gutter={[16, 16]}>
                <Col xxl={showOneLine ? 24 : 12} xl={showOneLine ? 24 : 12} md={showOneLine ? 24 : 12}>
                  {isMonthPicker ? (
                    <DatePicker.MonthPicker
                      value={startDate}
                      onChange={handleStartDateChange}
                      placeholder="Seleccionar mes de inicio"
                      format="YYYY-MM"
                      locale="es"
                    />
                  ) : (
                    <DatePicker
                      value={startDate}
                      onChange={handleStartDateChange}
                      placeholder="Seleccionar fecha de inicio"
                      format="YYYY-MM-DD"
                      locale="es"
                    />
                  )}
                </Col>
                <Col xxl={showOneLine ? 24 : 12} xl={showOneLine ? 24 : 12} md={showOneLine ? 24 : 12}>
                  {isMonthPicker ? (
                    <DatePicker.MonthPicker
                      value={endDate}
                      onChange={handleEndDateChange}
                      placeholder="Seleccionar mes de fin"
                      format="YYYY-MM"
                      locale="es"
                      disabled={!startDate}
                    />
                  ) : (
                    <DatePicker
                      value={endDate}
                      onChange={handleEndDateChange}
                      placeholder="Seleccionar fecha de fin"
                      format="YYYY-MM-DD"
                      locale="es"
                      disabled={!startDate}
                      disabledDate={disabledEndDate}
                    />
                  )}
                </Col>
              </Row>
            </div>
          </ConfigProvider>
        </Col>

        <Button onClick={() => {
          setStartDate(null);
          setEndDate(null);
          onReset?.();
        }}>Limpiar</Button>

      </Row>
    </div>
  );
};

export default DateRangeSeparate;