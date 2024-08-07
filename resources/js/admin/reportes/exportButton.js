import React from 'react';
import * as XLSX from 'xlsx';
import Papa from 'papaparse';

const ExportButton = ({ dataexport, transformData, fileName }) => {
    const exportToExcel = () => {
        if (dataexport.length === 0) {
            alert('No hay datos para exportar.');
            return;
        }

        const transformedData = transformData(dataexport);
        const ws = XLSX.utils.json_to_sheet(transformedData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Datos');
        XLSX.writeFile(wb, fileName);
    };

    const exportToCSV = () => {
        if (dataexport.length === 0) {
            alert('No hay datos para exportar.');
            return;
        }

        const transformedData = transformData(dataexport);
        const csv = Papa.unparse(transformedData);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', fileName.replace('.xlsx', '.csv'));
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const printData = () => {
        if (dataexport.length === 0) {
            alert('No hay datos para imprimir.');
            return;
        }

        const transformedData = transformData(dataexport);
        const printWindow = window.open('', '', 'height=600,width=800');
        printWindow.document.write('<html><head><title>Imprimir Datos</title>');
        printWindow.document.write('<style>table { width: 100%; border-collapse: collapse; } th, td { border: 1px solid black; padding: 8px; text-align: left; }</style>');
        printWindow.document.write('</head><body >');
        printWindow.document.write('<h2>Reporte</h2>');
        printWindow.document.write('<table>');
        printWindow.document.write('<thead><tr><th>' + Object.keys(transformedData[0]).join('</th><th>') + '</th></tr></thead><tbody>');

        transformedData.forEach(item => {
            printWindow.document.write(
                `<tr>${Object.values(item).map(val => `<td>${val}</td>`).join('')}</tr>`
            );
        });

        printWindow.document.write('</tbody></table>');
        printWindow.document.write('</body></html>');
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
    };

    const copyData = () => {
        if (dataexport.length === 0) {
            alert('No hay datos para copiar.');
            return;
        }

        const transformedData = transformData(dataexport);
        const textToCopy = transformedData.map(item => 
            Object.values(item).join(', ')
        ).join('\n');

        navigator.clipboard.writeText(textToCopy)
            .then(() => alert('Datos copiados al portapapeles.'))
            .catch(err => alert('Error al copiar: ' + err));
    };
    return (
        <div>
            {' '}
            <button
                aria-controls="html5-extension"
                className="dt-button buttons-excel buttons-html5 btn btn-sm"
                onClick={exportToExcel}
                disabled={dataexport.length === 0}
            >
                <span>Excel</span>
            </button>
            {' '}
            <button
                aria-controls="html5-extension"
                className="dt-button buttons-csv buttons-html5 btn btn-sm"
                onClick={exportToCSV}
                disabled={dataexport.length === 0}
            >
                <span>CSV</span>
            </button>
            {' '}
            <button
                className="dt-button buttons-print buttons-html5 btn btn-sm"
                onClick={printData}
                disabled={dataexport.length === 0}
            >
                <span>Print</span>
            </button>
            {' '}
            <button
                className="dt-button buttons-copy buttons-html5 btn btn-sm"
                onClick={copyData}
                disabled={dataexport.length === 0}
            >
                <span>Copy</span>
            </button>
            {' '}
        </div>
    );
};

export default ExportButton;
