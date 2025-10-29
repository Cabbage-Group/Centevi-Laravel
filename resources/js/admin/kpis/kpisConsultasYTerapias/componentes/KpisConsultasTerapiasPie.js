import React, { useMemo, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { FaClinicMedical } from "react-icons/fa";
import { GiHealing } from "react-icons/gi";
import "./CardPie.css";

const COLORS = [
  "#6366F1",
  "#8B5CF6",
  "#06B6D4",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#F97316",
  "#60A5FA",
];

export default function CardPieChart({
  data,
  title = "Distribución por Sucursal",
  subtitle = "Consultas + Terapias",
}) {
  // transformar datos: name + valor = consultas + terapia
  const pieData = useMemo(() => {
    let dat = data.map((item) => {
      // extraer name
      const { name, ...rest } = item;

      // sumar todos los valores restantes
      const total = Object.values(rest).reduce(
        (acc, val) => acc + (typeof val === "number" ? val : 0),
        0
      );

      return { name, total };
    });

    return dat
      .map((d) => ({
        name: d.name,
        // value: (d.consultas || 0) + (d.terapia || 0),
        value: d.total,
      }))
      .filter((d) => d.value > 0); // opcional: quitar valores 0 para limpiar la gráfica
  }, [data]);

  // total
  const total = useMemo(() => pieData.reduce((acc, cur) => acc + cur.value, 0), [pieData]);

  // active slice index para "expandir" al hover
  const [activeIndex, setActiveIndex] = useState(null);

  return (
    <div className="card-pie">
      {/* <div className="card-pie__header">
        <div className="card-pie__icon">
          <FaClinicMedical />
        </div>
        <div className="card-pie__texts">
          <h3 className="card-pie__title">{title}</h3>
          <p className="card-pie__subtitle">{subtitle}</p>
        </div>
        <div className="card-pie__right">
          <div className="card-pie__total" title="Total consultas + terapias">
            <div className="card-pie__total-icon">
              <GiHealing />
            </div>
            <div className="card-pie__total-number">{total.toLocaleString("es-PE")}</div>
            <div className="card-pie__total-label">Total</div>
          </div>
        </div>
      </div> */}

      <div className="card-pie__body">
        {pieData.length === 0 ? (
          <div className="card-pie__empty">No hay datos disponibles</div>
        ) : (
          <ResponsiveContainer width="100%" height={320}>
            <PieChart>
              <defs>
                {/* podemos definir filtros / sombras SVG si queremos */}
                <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow
                    dx="0"
                    dy="6"
                    stdDeviation="10"
                    floodColor="#000"
                    floodOpacity="0.08"
                  />
                </filter>
              </defs>

              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius="50%"
                outerRadius={100}
                paddingAngle={4}
                onMouseEnter={(_, index) => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(null)}
                isAnimationActive={true}
                animationDuration={700}
              >
                {pieData.map((entry, index) => {
                  const isActive = index === activeIndex;
                  const stroke = isActive ? "#ffffff" : "transparent";
                  const outer = isActive ? 110 : 100; // no directo en Cell, control visual con transform via class
                  return (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                      stroke={stroke}
                      strokeWidth={isActive ? 4 : 0}
                    />
                  );
                })}
              </Pie>

              <Tooltip
                formatter={(value) => value.toLocaleString("es-PE")}
                contentStyle={{
                  borderRadius: 8,
                  border: "1px solid #E6E9F8",
                  boxShadow: "0 6px 18px rgba(15, 23, 42, 0.08)",
                }}
              />

              <Legend
                verticalAlign="bottom"
                height={56}
                iconType="circle"
                wrapperStyle={{ fontSize: 13 }}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
