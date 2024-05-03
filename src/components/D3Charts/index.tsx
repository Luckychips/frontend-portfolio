import React, { useRef, useEffect, useState } from 'react'
import {
    select, ascending, descending, pairs, rollup,
    groups, range, scaleBand, scaleLinear, scaleOrdinal, schemeTableau10,
    axisTop, easeLinear, interpolateNumber,
    format, utcFormat, max,
} from 'd3'
import BarChart from '@components/Chart/BarChart'
import RaceBarChart from '@components/Chart/RaceBarChart'

const D3Charts = () => {
    return (
        <>
            <BarChart />
            <RaceBarChart />
        </>
    )
}

export default D3Charts
