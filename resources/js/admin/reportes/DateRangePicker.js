import React, { useState, useEffect } from 'react';
import { DatePicker } from 'antd';
import moment from 'moment';
import 'antd/dist/reset.css';
import { useLocation } from 'react-router-dom';
import { DeleteOutlined } from '@ant-design/icons';

const { RangePicker } = DatePicker;

const DateRangePicker = ({ startDate, endDate, onChange, onApply, onReset,limitToLast30Days = false }) => {
    const currentDate = moment().format('YYYY-MM-DD');
    const location = useLocation();
    const [dates, setDates] = useState([
        startDate ? moment(startDate, 'YYYY-MM-DD') : null,
        endDate ? moment(endDate, 'YYYY-MM-DD') : null,
    ]);

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

    const handleClear = () => {
        setDates([null, null]);
        if (onReset) {
            onReset();
        }
    };

    const disabledDate = (current) => {
        if (limitToLast30Days) {
            const last30Days = moment().subtract(30, 'days');
            return current && (current.isBefore(last30Days, 'day') || current.isAfter(moment(), 'day'));
        }
        return false; // No limitar fechas si el booleano está inactivo
    };

    return (
        <div className="date-range-picker" style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ position: 'relative', display: 'inline-block' }}>
                <RangePicker
                    value={dates}
                    onChange={handleChange}
                    format="YYYY-MM-DD"
                    allowClear={false}
                    disabledDate={disabledDate} 
                    style={{ width: 328, height: 40 }}
                />
                <button
                    onClick={handleClear}
                    style={{
                        position: 'absolute',
                        right: '40px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        border: 'none',
                        background: 'none',
                        cursor: 'pointer',
                        padding: '10px',
                        fontSize: '24px',
                        color: '#ff4d4f',
                        transition: 'color 0.3s'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.color = '#ff7875'}
                    onMouseOut={(e) => e.currentTarget.style.color = '#ff4d4f'}
                >
                    ×
                </button>
            </div>
            <button
                className="btn btn-success mt-3"
                id="buscar"
                type="button"
                onClick={onApply}
                style={{ marginLeft: '10px' }}
            >
                BUSCAR
            </button>
        </div>
    );
};

export default DateRangePicker;
