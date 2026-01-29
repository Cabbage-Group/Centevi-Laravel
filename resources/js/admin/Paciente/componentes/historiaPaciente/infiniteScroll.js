import React, { useEffect } from 'react';
import { List, Skeleton, Divider, Tag, Empty } from 'antd';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useDispatch, useSelector } from 'react-redux';
import { fectchDiagnosticosPorPaciente, resetDiagnosticosPorPaciente } from '../../../../redux/features/diagnosticos/DiagnosticosSlice';

const InfiniteScrollList = ({ pacienteId }) => {
    const dispatch = useDispatch();

    const {
        diagnosticoPorPaciente,
        meta,
        loadingDiagPorPaciente,
        currentPacienteId
    } = useSelector((state) => state.diagnosticos);

    useEffect(() => {
        if (currentPacienteId !== pacienteId) {
            dispatch(resetDiagnosticosPorPaciente());
        }


        dispatch(
            fectchDiagnosticosPorPaciente({
                pacienteId: pacienteId,
                page: 1,
                limit: 10
            })
        );

    }, [dispatch, pacienteId]);

    const loadMoreData = () => {
        if (loadingDiagPorPaciente) return;
        if (meta.currentPage >= meta.lastPage) return;

        dispatch(
            fectchDiagnosticosPorPaciente({
                pacienteId: pacienteId,
                page: meta.currentPage + 1,
                limit: 10
            })
        );
    };

    if (loadingDiagPorPaciente && (diagnosticoPorPaciente.length === 0 || currentPacienteId !== pacienteId)) {
        return (
            <div style={{ padding: 16 }}>
                <Skeleton
                    active
                    paragraph={{ rows: 4 }}
                />
            </div>
        );
    }

    if (currentPacienteId !== pacienteId) {
        return (
            <div style={{ padding: 16 }}>
                <Skeleton
                    active
                    paragraph={{ rows: 4 }}
                />
            </div>
        );
    }
    return (

        <div
            id="scrollableDiv"
            style={{
                height: 340,
                overflow: 'auto',
                padding: 0
            }}
        >

            <InfiniteScroll
                dataLength={diagnosticoPorPaciente.length}
                next={loadMoreData}
                hasMore={meta.currentPage < meta.lastPage}
                loader={
                    <div style={{ padding: '12px 16px' }}>
                        <Skeleton avatar={false} paragraph={{ rows: 2 }} active />
                    </div>
                }
                endMessage={
                    diagnosticoPorPaciente.length > 0 ? (
                        <Divider plain style={{ margin: '12px 0', fontSize: '12px', color: '#8c8c8c' }}>
                            No hay más diagnósticos
                        </Divider>
                    ) : null
                }
                scrollableTarget="scrollableDiv"
            >
                {diagnosticoPorPaciente.length === 0 && !loadingDiagPorPaciente ? (
                    <Empty
                        description="No hay diagnósticos registrados"
                        style={{ padding: '40px 0' }}
                        imageStyle={{ height: 60 }}
                    />
                ) : (
                    <List
                        dataSource={diagnosticoPorPaciente}
                        split={false}
                        renderItem={(item, index) => (
                            <List.Item
                                key={`${item.codigo}-${index}`}
                                style={{
                                    padding: '12px 16px',
                                    borderBottom: index < diagnosticoPorPaciente.length - 1
                                        ? '1px solid #f0f0f0'
                                        : 'none',
                                    transition: 'background 0.2s',
                                    cursor: 'default'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.background = '#fafafa'}
                                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                            >
                                <List.Item.Meta
                                    title={
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <Tag
                                                color="blue"
                                                style={{
                                                    margin: 0,
                                                    fontSize: '12px',
                                                    padding: '2px 8px',
                                                    fontWeight: 500
                                                }}
                                            >
                                                {item.codigo}
                                            </Tag>
                                            <span style={{
                                                fontSize: '13px',
                                                fontWeight: 500,
                                                color: '#262626',
                                                lineHeight: '1.4'
                                            }}>
                                                {item.diagnostico}
                                            </span>
                                        </div>
                                    }
                                    description={
                                        item.fecha_atencion ? (
                                            <span style={{
                                                fontSize: '12px',
                                                color: '#8c8c8c',
                                                marginLeft: '4px'
                                            }}>
                                                {item.fecha_atencion}
                                            </span>
                                        ) : null
                                    }
                                />
                            </List.Item>
                        )}
                    />
                )}
            </InfiniteScroll>
        </div>
    );
};

export default InfiniteScrollList;