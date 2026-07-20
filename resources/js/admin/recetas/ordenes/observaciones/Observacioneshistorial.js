import React, { useRef, useEffect } from "react";
import { Button, Spin, Empty } from "antd";
import { DeleteOutlined, EditOutlined, MessageOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";

const ITEM_HEIGHT = 72;
const VISIBLE_ITEMS = 3;

const ObservacionesHistorial = ({
  ordenes_id,
  usuariosData = [],
  idUsuarioActual,
  loading = false,
  editandoId = null,
  onEditarClick,
  onEliminarClick,
}) => {
  const { observaciones } = useSelector((state) => state.ordenObservaciones);
  const listRef = useRef(null);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [observaciones]);

  const getNombre = (id) =>
    usuariosData.find((u) => u.id_usuario === id)?.nombre ?? "Desconocido";

  const formatFecha = (fecha) => {
    if (!fecha) return "";
    return String(fecha).split(" ")[0];
  };

  const maxScrollHeight = ITEM_HEIGHT * VISIBLE_ITEMS + 16;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>

      <span style={{
        fontWeight: 600, fontSize: 14, color: "#262626",
        display: "flex", alignItems: "center", gap: 6,
      }}>
        <MessageOutlined style={{ color: "#1677ff" }} />
        Historial de observaciones
        {(observaciones?.length ?? 0) > 0 && (
          <span style={{
            background: "#1677ff", color: "#fff",
            borderRadius: 999, fontSize: 11,
            padding: "0 7px", lineHeight: "18px",
          }}>
            {observaciones?.length ?? 0}
          </span>
        )}
      </span>
      {loading ? (
        <div style={{ textAlign: "center", padding: 24 }}><Spin /></div>
      ) : (observaciones?.length ?? 0) === 0 ? (
        <Empty
          description="Sin observaciones aún"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          style={{ padding: "12px 0" }}
        />
      ) : (
        <div
          ref={listRef}
          style={{
            maxHeight: maxScrollHeight,
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            gap: 1,
            borderRadius: 8,
            border: "1px solid #e8e8e8",
            background: "#fafafa"
          }}
        >
          {observaciones.map((obs, idx) => {
            const enEdicion = editandoId === obs.id;
            return (
              <div
                key={obs.id}
                style={{
                  padding: "10px 14px",
                  background: enEdicion
                    ? "#fffbe6"
                    : idx % 2 === 0 ? "#fff" : "#fafafa",
                  borderBottom: idx < (observaciones?.length ?? 0) - 1 ? "1px solid #f0f0f0" : "none",
                  borderLeft: enEdicion ? "3px solid #faad14" : "3px solid transparent",
                  transition: "background 0.2s, border-left 0.2s",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
                  {/* Contenido */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                      <span style={{
                        width: 8, height: 8, borderRadius: "50%",
                        background: "#52c41a", flexShrink: 0, display: "inline-block",
                      }} />
                      <span style={{ fontWeight: 600, fontSize: 13, color: "#262626" }}>
                        {getNombre(obs.elaborado_por)}
                      </span>
                      <span style={{ fontSize: 12, color: "#8c8c8c" }}>
                        {formatFecha(obs.created_at)}
                      </span>
                      {obs.updated_at && obs.updated_at !== obs.created_at && (
                        <span style={{ fontSize: 11, color: "#bfbfbf", fontStyle: "italic" }}>
                          (editado)
                        </span>
                      )}
                      {enEdicion && (
                        <span style={{
                          fontSize: 11, color: "#faad14",
                          fontWeight: 600, marginLeft: 4,
                        }}>
                          Editando
                        </span>
                      )}
                    </div>
                    <p style={{
                      margin: 0, fontSize: 13, color: "#595959",
                      lineHeight: "1.5", wordBreak: "break-word",
                    }}>
                      {obs.observacion}
                    </p>
                  </div>
                  <div style={{ flexShrink: 0, alignSelf: "center", display: "flex", gap: 6 }}>
                    <Button
                      size="small"
                      icon={<EditOutlined />}
                      type={enEdicion ? "primary" : "default"}
                      onClick={() =>
                        onEditarClick?.({ id: obs.id, observacion: obs.observacion, elaborado_por: obs.elaborado_por })
                      }
                    >
                      Editar
                    </Button>
                    <Button
                      size="small"
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => onEliminarClick?.(obs.id)}
                    >
                      Eliminar
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ObservacionesHistorial;