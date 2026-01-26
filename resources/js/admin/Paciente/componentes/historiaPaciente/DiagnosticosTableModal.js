import React, { useEffect } from 'react';
import { Modal, Table, Tag } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import {
    fectchDiagnosticosPorPacienteDetalle,
    resetDiagnosticosPorPacienteDetalle
} from '../../../../redux/features/diagnosticos/DiagnosticosSlice';

const DiagnosticosTableModal = ({
    open,
    onClose,
    pacienteId
}) => {
    const dispatch = useDispatch();

    const {
        diagnosticosPorPacienteDetalle,
        metaDetalle,
        loadingDiagPorPacienteDetalle,
        currentPacienteIdDetalle
    } = useSelector((state) => state.diagnosticos);

    useEffect(() => {
        if (open && pacienteId) {

            if (currentPacienteIdDetalle !== pacienteId) {
                dispatch(resetDiagnosticosPorPacienteDetalle());
            }

            dispatch(
                fectchDiagnosticosPorPacienteDetalle({
                    pacienteId,
                    page: 1,
                    limit: 7
                })
            );
        }
    }, [open, dispatch, pacienteId, currentPacienteIdDetalle]);

    const handleTableChange = (pagination) => {
        dispatch(
            fectchDiagnosticosPorPacienteDetalle({
                pacienteId,
                page: pagination.current,
                limit: pagination.pageSize
            })
        );
    };

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            width: 80
        },
        {
            title: 'Código',
            dataIndex: 'codigo',
            key: 'codigo',
            width: 120,
            render: (text) => (
                <Tag color="blue" style={{ fontWeight: 500 }}>
                    {text}
                </Tag>
            )
        },
        {
            title: 'Diagnóstico',
            dataIndex: 'diagnostico',
            key: 'diagnostico',
            ellipsis: true
        },
        {
            title: 'Consulta',
            dataIndex: 'consulta',
            key: 'consulta',
            width: 200
        },
        {
            title: 'Doctor',
            dataIndex: 'doctor',
            key: 'doctor',
            width: 160
        },
        {
            title: 'Fecha',
            dataIndex: 'fecha_diagnostico',
            key: 'fecha_diagnostico',
            width: 160,
            render: (value) =>
                value
                    ? new Date(value).toLocaleDateString('es-PE')
                    : '—'
        }

    ];
    const dataSource = currentPacienteIdDetalle === pacienteId
        ? diagnosticosPorPacienteDetalle
        : [];

    return (
        <Modal
            title="Historial de Diagnósticos"
            open={open}
            onCancel={onClose}
            footer={null}
            width={1200}
            destroyOnClose
        >
            <Table
                rowKey={(record, index) => `${record.codigo}-${index}`}
                columns={columns}
                dataSource={dataSource}
                loading={loadingDiagPorPacienteDetalle}
                pagination={{
                    current: metaDetalle?.currentPage || 1,
                    pageSize: metaDetalle?.perPage || 7,
                    total: metaDetalle?.total || 0,
                    showSizeChanger: false
                }}
                onChange={handleTableChange}
            />
        </Modal>
    );
};

export default DiagnosticosTableModal;