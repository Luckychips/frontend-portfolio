import React, { useEffect, useRef } from 'react'
import {
    select, ascending, descending, rollup, pairs,
} from 'd3'
import json from './json/data.json'
import './styles.css'

const RaceBarChart = () => {
    const ref = useRef<any>()

    const getRank = (value) => {
        const names = new Set(json.map(d => d.name))
        const data = Array.from(names, name => ({name, value: value(name), rank: 0}))
        data.sort((a, b) => descending(a.value, b.value))
        for (let i = 0; i < data.length; ++i) data[i].rank = Math.min(12, i)
        return data
    }

    const getKeyframes = () => {
        console.log(Array.from(rollup(json, ([d]) => d.value, d => +d.date, d => d.name)))
        const datevalues = Array.from(rollup(json, ([d]) => d.value, d => +d.date, d => d.name))
            .map(([date, data]) => [new Date(date), data])
            .sort(([a], [b]) => ascending(a, b))
        const keyframes = [];
        let ka, a, kb, b;
        for ([[ka, a], [kb, b]] of pairs(datevalues)) {
            for (let i = 0; i < 10; i++) {
                const t = i / 10
                keyframes.push([
                    new Date(ka * (1 - t) + kb * t),
                    getRank(name => (a.get(name) || 0) * (1 - t) + (b.get(name) || 0) * t)
                ])
            }
        }
        keyframes.push([new Date(kb), getRank(name => b.get(name) || 0)])
        return keyframes
    }

    useEffect(() => {
        (async () => {
            if (json) {
                const svg = select(ref.current)

                const keyframes = getKeyframes()
                console.log(keyframes)
            }
        })()
    }, [ref, json])

    return (
        <section className="d3-race-bar-chart">
            <svg ref={ref} width={750} height={500} />
        </section>
    )
}

export default RaceBarChart
