import { useState, useEffect } from "react";
import { pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const PdfThumbnail = ({ fileToSend }) => {
    const [imageUrl, setImageUrl] = useState(null);

    useEffect(() => {
        const loadPdfAsImage = async () => {
            if (fileToSend.type === "application/pdf") {
                const file = fileToSend;
                const pdf = await pdfjs.getDocument(URL.createObjectURL(file)).promise;
                const page = await pdf.getPage(1); // Obtener la primera página

                const viewport = page.getViewport({ scale: 0.5 });
                const canvas = document.createElement("canvas");
                const context = canvas.getContext("2d");

                canvas.height = viewport.height;
                canvas.width = viewport.width;

                await page.render({
                    canvasContext: context,
                    viewport: viewport,
                }).promise;

                setImageUrl(canvas.toDataURL());
            }
        };

        loadPdfAsImage();
    }, [fileToSend]);

    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center", 
                alignItems: "center", 
                width: "700px", 
                height: "auto",
                overflow: "hidden",
            }}
        >
            {fileToSend.type.startsWith("image/") ? (
                <img
                    src={URL.createObjectURL(fileToSend)}
                    alt="preview"
                    style={{
                        maxWidth: "100%",
                        maxHeight: "100%",
                        objectFit: "contain",
                        borderRadius: "5px",
                    }}
                />
            ) : fileToSend.type === "application/pdf" && imageUrl ? (
                <img
                    src={imageUrl}
                    alt="PDF Thumbnail"
                    style={{
                        maxWidth: "100%",
                        maxHeight: "100%",
                        objectFit: "contain",
                        borderRadius: "5px",
                    }}
                />
            ) : (
                <p>Formato no compatible</p>
            )}
        </div>
    );
};

export default PdfThumbnail;
