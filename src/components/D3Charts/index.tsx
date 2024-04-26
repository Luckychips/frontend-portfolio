import React, { useRef, useEffect, useState } from 'react'
import {
    select, ascending, descending, pairs, rollup,
    groups, range, scaleBand, scaleLinear, scaleOrdinal, schemeTableau10,
    axisTop, easeLinear, interpolateNumber,
    format, utcFormat, max,
} from 'd3'
import json from './data.json'

const D3Charts = () => {
    const [data, setData] = useState([
        {
            name: 'alpha',
            value: 10,
            color: '#f4efd3',
        },
        {
            name: 'beta',
            value: 15,
            color: '#cccccc',
        },
        {
            name: 'charlie',
            value: 20,
            color: '#c2b0c9',
        },
        {
            name: 'delta',
            value: 25,
            color: '#9656a1',
        },
        {
            name: 'echo',
            value: 30,
            color: '#fa697c',
        },
        {
            name: 'foxtrot',
            value: 35,
            color: '#fcc169',
        },
    ])
    const racingBarChartRef = useRef<any>()

    const getRandomIndex = array => {
        return Math.floor(array.length * Math.random());
    };

    useEffect(() => {
        const int = () => {
            const randomIndex = getRandomIndex(data);
            setData(
                data.map((entry, index) =>
                    index === randomIndex
                        ? {
                            ...entry,
                            value: entry.value + 10
                        }
                        : entry
                )
            );
        }

        setInterval(int, 500)
        return () => { clearInterval(int) }
    }, [])

    useEffect(() => {
        (async () => {
            if (data) {
                const svg = select(racingBarChartRef.current)
                const yScale = scaleBand()
                    .paddingInner(0.1)
                    .domain(data.map((value, index) => index))
                    .range([0, 500])

                const xScale = scaleLinear()
                    .domain([0, max(data, entry => entry.value)])
                    .range([0, 750])

                // draw the bars
                svg
                    .selectAll('.bar')
                    .data(data, (entry, index) => entry.name)
                    .join(enter =>
                        enter.append('rect').attr('y', (entry, index) => yScale(index))
                    )
                    .attr('fill', entry => entry.color)
                    .attr('class', 'bar')
                    .attr('x', 0)
                    .attr('height', yScale.bandwidth())
                    .transition()
                    .attr('width', entry => xScale(entry.value))
                    .attr('y', (entry, index) => yScale(index));

                // draw the labels
                svg
                    .selectAll('.label')
                    .data(data, (entry, index) => entry.name)
                    .join(enter =>
                        enter
                            .append('text')
                            .attr(
                                'y',
                                (entry, index) => yScale(index) + yScale.bandwidth() / 2 + 5
                            )
                    )
                    .text(entry => `🐎 ... ${entry.name} (${entry.value} meters)`)
                    .attr('class', 'label')
                    .attr('x', 10)
                    .transition()
                    .attr('y', (entry, index) => yScale(index) + yScale.bandwidth() / 2 + 5)
            }
        })()
    }, [racingBarChartRef, data])

    return (
        <>
            <svg ref={racingBarChartRef} width={750} height={500} />
        </>
    )
}

export default D3Charts
