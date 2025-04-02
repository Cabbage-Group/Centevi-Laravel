import React, { useState } from "react";
import { 
  FileOutlined, 
  DownloadOutlined, 
  PictureOutlined, 
  FilePdfOutlined, 
  FileWordOutlined, 
  FileExcelOutlined, 
  FilePptOutlined 
} from "@ant-design/icons";
import axios from 'axios';

const FilePreview = ({ msg }) => {
  const [downloading, setDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const [error, setError] = useState(null);

  const renderFileIcon = () => {
    switch (msg.tipoArchivo) {
      case "application/pdf":
        return <FilePdfOutlined style={{ fontSize: "30px", color: "white" }} />;
      case "image/jpeg":
      case "image/png":
        return <PictureOutlined style={{ fontSize: "30px", color: "white" }} />;
      case "application/msword":
        return <FileWordOutlined style={{ fontSize: "30px", color: "white" }} />;
      case "application/vnd.ms-excel":
        return <FileExcelOutlined style={{ fontSize: "30px", color: "white" }} />;
      case "application/vnd.ms-powerpoint":
        return <FilePptOutlined style={{ fontSize: "30px", color: "white" }} />;
      default:
        return <FileOutlined style={{ fontSize: "30px", color: "white" }} />;
    }
  };

  const downloadFile = async () => {
    setDownloading(true);
    setError(null);
    try {
      const response = await axios({
        url: msg.archivoUrl, // URL del archivo a descargar
        method: "GET",
        responseType: "blob", // Especificamos que la respuesta es un archivo binario
      });
      
      const fileURL = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = fileURL;
      link.setAttribute("download", msg.nombreArchivo); // El nombre del archivo será el nombre que se pasa desde msg
      document.body.appendChild(link);
      link.click(); // Simula un click para descargar
      link.remove();

      setDownloading(false);
      setDownloaded(true); // Indica que el archivo se descargó correctamente
    } catch (err) {
      setDownloading(false);
      setError("Error al descargar el archivo");
      console.error(err);
    }
  };

  return (
    <div style={{ wordBreak: "break-word" }}>
      <div
        style={{
          background: "#025E4D",
          padding: "10px",
          borderRadius: "10px",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          maxWidth: "300px",
          color: "white",
        }}
      >
        {renderFileIcon()}
        <div>
          <div style={{ fontWeight: "bold" }}>{msg.nombreArchivo}</div>
          <div style={{ fontSize: "12px", opacity: 0.8 }}>{msg.fileSize}</div>
        </div>

        {/* Aquí hemos integrado el botón de descarga */}
        <button
          onClick={downloadFile}
          style={{
            background: "none",
            border: "none",
            color: "white",
            fontSize: "20px",
            cursor: downloading ? "not-allowed" : "pointer",
            opacity: downloading ? 0.6 : 1,
          }}
          disabled={downloading}
        >
          <DownloadOutlined />
        </button>
      </div>

      {/* Mostrar mensajes según el estado */}
      {downloading && <p>Descargando...</p>}
      {downloaded && !downloading && <p>¡Archivo descargado correctamente!</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default FilePreview;
