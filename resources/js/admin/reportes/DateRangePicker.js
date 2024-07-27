import React, { useState, useEffect } from 'react';
import { DatePicker, Button } from 'antd';
import moment from 'moment';
import 'antd/dist/reset.css'; // Importa el CSS de Ant Design

const { RangePicker } = DatePicker;

const DateRangePicker = ({ startDate, endDate, onChange, onApply }) => {
    const currentDate = moment().format('YYYY-MM-DD');
    const [dates, setDates] = useState([
        startDate ? moment(startDate, 'YYYY-MM-DD') : null,
        endDate ? moment(endDate, 'YYYY-MM-DD') : null,
    ]);

    useEffect(() => {
        if (startDate === currentDate && endDate === currentDate) {
            setDates([null, null]);
        }
    }, [startDate, endDate, currentDate]);

    const handleChange = (dates) => {
        if (dates && dates.length === 2) {
            setDates(dates); 
            onChange(dates[0].format('YYYY-MM-DD'), dates[1].format('YYYY-MM-DD'));
        } else {
            setDates([null, null]); 
            onChange('', '');
        }
    };

    const handleApply = () => {
        onApply();
        setDates([null, null]); 
    };

    return (
        <div className="date-range-picker">
            <RangePicker
                value={dates}
                onChange={handleChange}
                format="YYYY-MM-DD"
                allowClear={false}
            />
            <button
                className="btn btn-success mt-3"
                id="buscar"
                type="button"
                onClick={handleApply}
                style={{ marginLeft: '10px' }}
            >
                BUSCAR
            </button>
        </div>
    );
};

export default DateRangePicker;
