import React, { useEffect, useRef, useState } from 'react'
import { select, scaleBand, scaleLinear, max } from 'd3'
import './styles.css'

const BarChart = () => {
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
    const ref = useRef<any>()

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

        setInterval(int, 1000)
        return () => { clearInterval(int) }
    }, [])

    useEffect(() => {
        (async () => {
            if (data) {
                const svg = select(ref.current)
                data.sort((a, b) => b.value - a.value)
                const yScale = scaleBand()
                    .paddingInner(0.4)
                    .domain(data.map((value, index) => index))
                    .range([0, 280])

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
                    .attr('x',0)
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
    }, [ref, data])

    return (
        <section className="d3-bar-chart">
            <svg ref={ref} width={750} height={500} />
        </section>
    )
}

export default BarChart
