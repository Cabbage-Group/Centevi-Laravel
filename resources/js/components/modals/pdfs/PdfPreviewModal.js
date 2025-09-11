import React from "react";
import { Modal, Spin, Button, Space } from "antd";
import { BlobProvider } from "@react-pdf/renderer";
import { DownloadOutlined, ExportOutlined, CloseOutlined } from "@ant-design/icons";

/**
 * Props:
 * - open: boolean
 * - onClose: () => void
 * - document: ReactElement (react-pdf <Document> or any react element accepted by BlobProvider)
 * - loading: boolean (si true muestra spinner en lugar de generar blob)
 * - width: number|string (ej: '90%')
 * - height: string (ej: '80vh')
 * - title?: string (opcional, se muestra en toolbar)
 * - downloadFileName?: string (por defecto "document.pdf")
 * - loader?: ReactElement (opcional, reemplaza el Spin)
 */
const PdfPreviewModal = ({
  open,
  onClose,
  document,
  loading = false,
  width = "90%",
  height = "80vh",
  title = "",
  downloadFileName = "document.pdf",
  loader = null,

}) => {
  // Spinner por defecto
  const Loader = loader || (
    <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Spin tip="Generando vista previa..." size="large" />
    </div>
  );

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      centered
      width={width}
      // styles={{
      //   // controla el padding del body (antes bodyStyle)
      //   body: { padding: 0 },

      //   // controla la capa de contenido / contenedor general del modal
      //   // aquí metes la altura y el layout flex que antes ponías en bodyStyle
      //   content: { height: height, display: "flex", flexDirection: "column" },
      // }}

      // bodyStyle={{ padding: 0, height: "80vh", display: "flex", flexDirection: "column" }}

    styles={{body: { padding: 0, height: "80vh", display: "flex", flexDirection: "column" }}}

      // reemplaza destroyOnClose
      destroyOnHidden={true}
      closable={false}
    >
      {/* Si nos indican que aún estamos en proceso (por ejemplo: generando imágenes),
          mostramos loader inmediatamente */}
      {loading || !document ? (
        Loader
      ) : (
        // BlobProvider genera el blob/url del Document
        <BlobProvider document={document}>
          {({ url, loading: blobLoading, error }) => {
            if (blobLoading) {
              return Loader;
            }
            if (error) {
              return (
                <div style={{ padding: 20 }}>
                  <p style={{ color: "red" }}>Error generando PDF: {String(error)}</p>
                </div>
              );
            }
            // toolbar y iframe
            return (
              <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
                {/* toolbar */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "8px 12px",
                    borderBottom: "1px solid #eee",
                    background: "#fff",
                    zIndex: 2,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    {title ? <strong>{title}</strong> : null}
                  </div>

                  <Space>
                    <Button
                      icon={<ExportOutlined />}
                      onClick={() => {
                        // abrir nueva pestaña
                        if (url) window.open(url, "_blank");
                      }}
                    >
                      Abrir en nueva pestaña
                    </Button>

                    <a href={url} download={downloadFileName} style={{ display: "inline-block" }}>
                      <Button icon={<DownloadOutlined />}>Descargar</Button>
                    </a>

                    <Button icon={<CloseOutlined />} onClick={onClose} />
                  </Space>
                </div>

                {/* iframe con el PDF */}
                <div style={{ flex: 1 }}>
                  <iframe
                    src={url}
                    style={{ width: "100%", height: "100%", border: "none" }}
                    title="Vista previa PDF"
                  />
                </div>
              </div>
            );
          }}
        </BlobProvider>
      )}
    </Modal>
  );
};

export default PdfPreviewModal;