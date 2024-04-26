import React, { useRef, useEffect, useState } from 'react'
import { select, csv, max, scaleBand, scaleLinear, axisBottom, axisTop, axisLeft, easeLinear, autoType } from 'd3'

const D3Charts = () => {
    const racingBarChartRef = useRef<any>()
    const [frames, setFrames] = useState([]);
    const [colorMap, setColorMap] = useState({});

    const getRandomIndex = array => {
        return Math.floor(array.length * Math.random());
    }

    useEffect(() => {
        (async () => {
            const svg = select(racingBarChartRef.current)
        })()
    }, [racingBarChartRef])

    return (
        <>
            <svg ref={racingBarChartRef} width={1024} height={768} />
        </>
    )
}

export default D3Charts
