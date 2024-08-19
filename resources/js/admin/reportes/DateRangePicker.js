import React, { useState, useEffect } from 'react';
import { DatePicker } from 'antd';
import moment from 'moment';
import 'antd/dist/reset.css'; 
import { useLocation } from 'react-router-dom';

const { RangePicker } = DatePicker;

const DateRangePicker = ({ startDate, endDate, onChange, onApply }) => {
    const currentDate = moment().format('YYYY-MM-DD');
    const location = useLocation();
    const [dates, setDates] = useState([
        startDate ? moment(startDate, 'YYYY-MM-DD') : null,
        endDate ? moment(endDate, 'YYYY-MM-DD') : null,
    ]);
    console.log('fecha:', startDate)
    console.log('fechaEnd:', endDate)

    useEffect(() => {
        if (startDate === currentDate && endDate === currentDate) {
            setDates([null, null]);
        }
    }, [startDate, endDate, currentDate]);

    useEffect(() => {
        setDates([null, null]);
    }, [location.pathname]);

    
    const handleChange = (dates) => {
        if (dates && dates.length === 2) {
            setDates(dates); 
            onChange(dates[0].format('YYYY-MM-DD'), dates[1].format('YYYY-MM-DD'));
        } else {
            
            onChange('', '');
        }
    };

    const handleApply = () => {
        onApply();
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
