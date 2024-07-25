import React, { useState } from 'react';
import { DatePicker, Button } from 'antd';
import moment from 'moment';
import 'antd/dist/reset.css'; // Importa el CSS de Ant Design

const { RangePicker } = DatePicker;

const DateRangePicker = ({ startDate, endDate, onChange, onApply }) => {
    const [dates, setDates] = useState([
        startDate ? moment(startDate, 'YYYY-MM-DD') : null,
        endDate ? moment(endDate, 'YYYY-MM-DD') : null
    ]);

    const handleChange = (dates) => {
        if (dates && dates.length === 2) {
            setDates(dates); // Actualiza el estado con las fechas seleccionadas
            onChange(dates[0].format('YYYY-MM-DD'), dates[1].format('YYYY-MM-DD'));
        } else {
            setDates([null, null]); // Limpia el estado si no hay fechas seleccionadas
            onChange('', '');
        }
    };

    const handleApply = () => {
        onApply();
        setDates([null, null]); // Limpia el estado después de aplicar
    };

    return (
        <div className="date-range-picker">
            <RangePicker
                value={dates}
                onChange={handleChange}
                format="YYYY-MM-DD"
                allowClear={false} // Evita que el picker sea limpiado automáticamente
                showToday={false} // No muestra el botón de "Hoy"
            />
            <Button type="primary" onClick={handleApply} style={{ marginLeft: '10px' }}>
                Aplicar
            </Button>
        </div>
    );
};

export default DateRangePicker;
