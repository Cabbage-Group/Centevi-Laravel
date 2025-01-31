import React from 'react'
import ReactApexChart from 'react-apexcharts'

const KpiTipoLente = (props) => {
    const {chartOptions, data} = props
    return (
        <div>
            <div>hola mundo</div>
            <ReactApexChart options={chartOptions} series={data} type="bar" height={300} />

        </div>
    )
}

export default KpiTipoLente