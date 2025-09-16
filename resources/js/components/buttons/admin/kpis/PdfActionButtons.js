// components/PdfActionButtons.jsx
import React from "react";
import { Space, Button, Tooltip, Grid } from "antd";
import { EyeOutlined, DownloadOutlined } from "@ant-design/icons";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { filenameFactory } from "../../../../utils/FilenameFactory";
/**
 * Props:
 * - onPreview: () => void                // acción al pulsar "Ver PDF"
 * - isGenerating: boolean               // muestra loading en el botón de preview
 * - ready: boolean                      // si true habilita el botón Descargar
 * - downloadDocument: ReactElement      // element <Document> para pasar a PDFDownloadLink (cuando ready)
 * - fileName: string (default 'document.pdf')
 * - previewTooltip?: string
 * - downloadTooltip?: string
 * - size?: "small" | "middle" | "large" (default 'middle')
 */
const PdfActionButtons = ({
  onPreview,
  isGenerating = false,
  ready = false,
  downloadDocument = null,
  titleFilename = "document.pdf",
  userFilename,
  previewTooltip = "Ver PDF",
  downloadTooltip = "Descargar PDF",
  size = "middle",
}) => {
  const { useBreakpoint } = Grid;
  const screens = useBreakpoint();

  // mostrar texto en botones según ancho: preview -> xs+, download -> md+
  const showPreviewText = !!screens.sm;
  const showDownloadText = !!screens.md;

  const newFilenameRefactorized = filenameFactory(titleFilename, "pdf", {user: userFilename})


  return (
    <Space size="small" align="center">
      <Tooltip title={isGenerating ? "Preparando preview..." : previewTooltip}>
        <Button
          type="primary"
          icon={<EyeOutlined />}
          onClick={onPreview}
          loading={isGenerating}
          size={size}
        >
          {showPreviewText ? "Ver PDF" : null}
        </Button>
      </Tooltip>

      {ready && downloadDocument ? (
        <PDFDownloadLink document={downloadDocument} fileName={newFilenameRefactorized} style={{ textDecoration: "none" }}>
          {({ loading }) => (
            <Tooltip title={loading ? "Generando archivo..." : downloadTooltip}>
              <Button icon={<DownloadOutlined />} loading={loading} size={size}>
                {showDownloadText ? "Descargar" : null}
              </Button>
            </Tooltip>
          )}
        </PDFDownloadLink>
      ) : (
        <Tooltip title="Previsualiza el PDF primero para poder descargar">
          <Button icon={<DownloadOutlined />} disabled size={size}>
            {showDownloadText ? "Descargar" : null}
          </Button>
        </Tooltip>
      )}
    </Space>
  );
};

export default PdfActionButtons;