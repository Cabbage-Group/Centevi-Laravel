import React, { useState } from "react";
import { DatePicker, Button, ConfigProvider, Col, Row } from "antd";
import dayjs from "dayjs";
import "dayjs/locale/es";
import locale from "antd/es/locale/es_ES";

dayjs.locale("es");

const DateRangeSeparate = ({
  onApply, onReset, disableDateRangeLimit, isMonthPicker,
  showOneLine = true
}) => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const handleApply = () => {
    if (startDate && endDate) {
      const formattedStartDate = startDate.format("YYYY-MM-DD");
      const formattedEndDate = endDate.format("YYYY-MM-DD");
      onApply?.(formattedStartDate, formattedEndDate);
    }
  };

  const handleClear = () => {
    setStartDate(null);
    setEndDate(null);
    onReset?.();
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
      <Row
        gutter={[16, 16]}
      >
        <Col
          xxl={16} xl={16} md={16}
        >
          <ConfigProvider locale={locale}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>

              <Row
                gutter={[16, 16]}
              >
                <Col
                  xxl={showOneLine ? 24 : 12} xl={showOneLine ? 24 : 12} md={showOneLine ? 24 : 12}
                >
                  {isMonthPicker ? (
                    <DatePicker.MonthPicker
                      value={startDate}
                      onChange={(date) => {
                        setStartDate(date);
                        if (endDate && (date.add(1, "month").isBefore(endDate) || endDate.isBefore(date))) {
                          setEndDate(null);
                        }
                      }}
                      placeholder="Seleccionar mes de inicio"
                      format="YYYY-MM"
                      locale="es"
                    />
                  ) : (
                    <DatePicker
                      value={startDate}
                      onChange={(date) => {
                        setStartDate(date);
                        if (endDate && (date.add(30, "day").isBefore(endDate) || endDate.isBefore(date))) {
                          setEndDate(null);
                        }
                      }}
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
                      onChange={(date) => setEndDate(date)}
                      placeholder="Seleccionar mes de fin"
                      format="YYYY-MM"
                      locale="es"
                      disabled={!startDate}
                    />
                  ) : (
                    <DatePicker
                      value={endDate}
                      onChange={(date) => setEndDate(date)}
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
        <Col xxl={8} xl={8} md={8}>
          <Button onClick={handleClear}>Limpiar</Button>
          <Button onClick={handleApply} type="primary" disabled={!startDate || !endDate}>
            Aplicar
          </Button>
        </Col>
      </Row>
    </div>


  );
};

export default DateRangeSeparate;
