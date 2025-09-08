// import React from 'react';
// import { Checkbox, Col, Row, Select, Divider } from "antd";
// import DateRangeSeparate from '../../../../admin/reportes/DateRange';


// const HorizontalBarChart = (
//   onDateApply,
//   onDateReset,
//   isDateMonthPicker,
//   height = "600px",
//   tag = false,
//   tagTitle,

// ) => {
//   return (
//       <div
//         style={{
//           background: "white",
//           padding: "15px",
//           height: height,
//           borderRadius: "15px",
//           display: "flex",
//           flexDirection: "column",
//           marginTop: "15px",
//           position: "relative",
//         }}
//       >
//         {tag ? 
//           <div
//             style={{
//               position: "absolute",
//               background: "orange",
//               paddingLeft: "10px",
//               paddingRight: "10px",
//               paddingTop: "2px",
//               paddingBottom: "2px",
//               bottom: "10px",
//               right: "20px",
//               fontSize: "10px",
//               color: "white",
//               borderRadius: "8px",
//             }}
//           >
//             {tagTitle ?? "tagTitle"}
//           </div> :
//           <></>
//         }
  
//         <Row gutter={[32, 12]}>
//           <Col xs={24} sm={12} md={24} lg={12} xl={12} xxl={12}>
//             <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
//               <DateRangeSeparate
//                 onApply={onDateApply}
//                 onReset={onDateReset}
//                 isMonthPicker={isDateMonthPicker}
//               />
//             </div>
//           </Col>
  
//           <Col xs={24} sm={12} md={24} lg={12} xl={12} xxl={12}>
//             <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
//               <label style={{ marginBottom: 8 }}>Filtrar por Sucursal:</label>
//               <Select
//                 mode="multiple"
//                 style={{ width: "100%" }}
//                 placeholder="Selecciona la sucursal"
//                 onChange={handleChangeCYTSucursales}
//                 value={cytsucursalFilter || undefined}
//                 allowClear
//                 showSearch
//                 optionFilterProp="children"
//                 filterOption={(input, option) =>
//                   (option?.children || "").toString().toLowerCase().includes(input.toLowerCase())
//                 }
//               >
//                 {sucursales.map((sucursal) => (
//                   <Select.Option key={sucursal.id_sucursal} value={sucursal.id_sucursal}>
//                     {sucursal.nombre}
//                   </Select.Option>
//                 ))}
//               </Select>
//             </div>
//           </Col>
//         </Row>
  
//         {/* Nuevo control de series (Select) */}
//         <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 12, marginBottom: 6 }}>
//           <Select
//             mode="multiple"
//             placeholder="Series"
//             value={activeLinesCYTSucursales}
//             onChange={onLegendChangeCYTSucursales}
//             style={{ minWidth: 160 }}
//             tagRender={tagRender}
//             aria-label="Seleccionar series"
//           >
//             {SERIES_OPTIONS.map((opt) => (
//               <Select.Option key={opt.value} value={opt.value}>
//                 <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
//                   <span style={{ width: 10, height: 10, background: opt.color, borderRadius: 3 }} />
//                   {opt.label}
//                 </span>
//               </Select.Option>
//             ))}
//           </Select>
//         </div>
  
//         {/* ---------------------- Grafico de Barras ---------------------- */}
//         <div style={{ flex: 1 }}>
//           <ResponsiveContainer width="100%" height="100%">
//             <BarChart
//               data={kpisTerapiasConsultasSucursales}
//               margin={{ top: 20, right: 50, left: 20, bottom: 80 }}
//               isAnimationActive={false}
//               barCategoryGap="50%"
//               barGap={0}
//             >
//               <CartesianGrid strokeDasharray="3 3" vertical={false} />
//               <XAxis
//                 dataKey="name"
//                 tick={{ fontSize: 10, angle: -45, textAnchor: "end" }}
//                 interval={0}
//                 tickFormatter={truncateXAxisCYTSucursales}
//               />
//               <YAxis tick={{ fontSize: 10 }} />
//               <Tooltip content={<CustomTooltipBarras />} cursor={{ fill: "transparent" }} />
//               {renderLinesCYTSucursales()}
//             </BarChart>
//           </ResponsiveContainer>
//         </div>
//       </div>

//   );
// }

// export default HorizontalBarChart;