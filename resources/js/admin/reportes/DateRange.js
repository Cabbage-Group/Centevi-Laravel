import React, { useState } from "react";
import { DatePicker, Button } from "antd";
import moment from "moment";
import "antd/dist/reset.css";

const DateRangeSeparate = ({ onApply, onReset }) => {
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
    if (!startDate || !current) return false;
    // Solo deshabilitar fechas después de 30 días a partir de la fecha inicial
    console.log('startDate:',startDate)
    const maxDate = moment(startDate).add(20, 'days');
    console.log('maxDate:',maxDate)
    return current.isAfter(maxDate);
  };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
      <DatePicker
        value={startDate}
        onChange={(date) => {
          setStartDate(date);
          // Reset end date if it would be invalid with new start date
          if (endDate && moment(date).add(30, 'days').isBefore(endDate)) {
            setEndDate(null);
          }
        }}
        placeholder="Select Start Date"
        format="YYYY-MM-DD"
      />
      <DatePicker
        value={endDate}
        onChange={(date) => setEndDate(date)}
        placeholder="Select End Date"
        format="YYYY-MM-DD"
        disabled={!startDate}
        disabledDate={disabledEndDate}
      />
      <Button onClick={handleClear}>Clear</Button>
      <Button onClick={handleApply} type="primary" disabled={!startDate || !endDate}>
        Apply
      </Button>
    </div>
  );
};

export default DateRangeSeparate;