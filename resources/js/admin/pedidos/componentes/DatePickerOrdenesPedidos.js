import React, { useState, useEffect } from 'react';
import { DatePicker } from 'antd';
import moment from 'moment';
import 'antd/dist/reset.css';
import { useLocation } from 'react-router-dom';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;

const DateRangePickerOrdenesCentilab = ({
    startDate,
    endDate,
    onChange,
    onApply,
    onReset,
    limitToLast30Days = false,
    skipReset = false
}) => {
    const currentDate = moment().format('YYYY-MM-DD');
    const location = useLocation();
    const [dates, setDates] = useState([
        startDate ? dayjs(startDate, 'YYYY-MM-DD') : null,
        endDate ? dayjs(endDate, 'YYYY-MM-DD') : null,
    ]);

    useEffect(() => {
        if (!skipReset) {
            setDates([null, null]);
        }
    }, [location.pathname, skipReset]);

    const handleChange = (dates) => {
        setDates(dates);
        if (dates && dates.length === 2 && dates[0] && dates[1]) {
            onChange(dates[0].format('YYYY-MM-DD'), dates[1].format('YYYY-MM-DD'));
        }
    };

    const handleClear = (e) => {
        e.stopPropagation();
        setDates([null, null]);
        onChange('', '');
        if (onReset) {
            onReset();
        }
    };

    const disabledDate = (current) => {
        if (limitToLast30Days) {
            const last30Days = moment().subtract(30, 'days');
            return current && (current.isBefore(last30Days, 'day') || current.isAfter(moment(), 'day'));
        }
        return false;
    };

    return (
        <div style={{ position: 'relative', display: 'inline-block' }}>
            <RangePicker
                value={dates}
                onChange={handleChange}
                format="YYYY-MM-DD"
                allowClear={false}
                disabledDate={disabledDate}
                style={{ width: 328, height: 32 }}
            />
            {(dates[0] || dates[1]) && (
                <button
                    onClick={handleClear}
                    title="Limpiar fechas"
                    style={{
                        position: 'absolute',
                        right: '35px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        border: 'none',
                        background: 'none',
                        cursor: 'pointer',
                        padding: '4px 8px',
                        fontSize: '18px',
                        color: '#d9d9d9',
                        transition: 'color 0.2s ease',
                        lineHeight: '1',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 1
                    }}
                    onMouseOver={(e) => e.currentTarget.style.color = '#ff4d4f'}
                    onMouseOut={(e) => e.currentTarget.style.color = '#d9d9d9'}
                >
                    ×
                </button>
            )}
        </div>
    );
};

export default DateRangePickerOrdenesCentilab;