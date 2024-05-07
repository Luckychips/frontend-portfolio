import React, { useEffect, useRef } from 'react'
import {
    select, ascending, descending, rollup, pairs, groups, interpolateNumber, format, utcFormat,
    axisTop,
    scaleOrdinal, schemeTableau10,
    scaleLinear, scaleBand, range, easeLinear,
} from 'd3'
import json from './json/data.json'
import './styles.css'

const RaceBarChart = () => {
    const width = 750
    const height = 500
    const barSize = 48
    const marginTop = 16
    const marginBottom = 6
    const marginLeft = 0
    const marginRight = 6
    const tickFormat = undefined
    const x = scaleLinear([0, 1], [marginLeft, width - marginRight])
    const y = scaleBand()
        .domain(range(12 + 1))
        .rangeRound([marginTop, marginTop + barSize * (12 + 1 + 0.1)])
        .padding(0.1)
    const ref = useRef<any>()

    const getRank = (value) => {
        const names = new Set(json.map(d => d.name))
        const data = Array.from(names, name => ({name, value: value(name), rank: 0}))
        data.sort((a, b) => descending(a.value, b.value))
        for (let i = 0; i < data.length; ++i) data[i].rank = Math.min(12, i)
        return data
    }

    const getDateFormat = (date) => {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return year + '-' + month + '-' + day;
    }

    const getKeyframes = () => {
        const datevalues = Array.from(rollup(json, ([d]) => d.value, d => d.date, d => d.name))
            .map(([date, data]) => [getDateFormat(new Date(date)), data])
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

    const getColors = () => {
        const scale = scaleOrdinal(schemeTableau10)
        if (json.some(d => d.category !== undefined)) {
            const categoryByName = new Map(json.map(d => [d.name, d.category]))
            scale.domain(categoryByName.values())
            return d => scale(categoryByName.get(d.name))
        }

        return d => scale(d.name)
    }

    const bars = (svg, prev, next) => {
        const bar = svg.append('g').attr('fill-opacity', 0.6).selectAll('rect')
        return ([date, data], transition) => (bar) = bar
            .data(data.slice(0, 12), d => d.name)
            .join(
                enter => enter.append('rect')
                    .attr('fill', getColors())
                    .attr('height', y.bandwidth())
                    .attr('x', x(0))
                    .attr('y', d => y((prev.get(d) || d).rank))
                    .attr('width', d => x((prev.get(d) || d).value) - x(0)),
                update => update,
                exit => exit.transition(transition).remove()
                    .attr('y', d => y((next.get(d) || d).rank))
                    .attr('width', d => x((next.get(d) || d).value) - x(0))
            )
            .call(bar => bar.transition(transition)
                .attr('y', d => y(d.rank))
                .attr('width', d => x(d.value) - x(0)));
    }

    const axis = (svg) => {
        const g = svg.append('g').attr('transform', `translate(0,${marginTop})`);
        const axis = axisTop(x)
            .ticks(width / 160, tickFormat)
            .tickSizeOuter(0)
            .tickSizeInner(-barSize * (12 + y.padding()))

        return (_, transition) => {
            g.transition(transition).call(axis)
            g.select('.tick:first-of-type text').remove()
            g.selectAll('.tick:not(:first-of-type) line').attr('stroke', 'white')
            g.select('.domain').remove()
        };
    }

    const labels = (svg, prev, next) => {
        let label = svg.append('g')
            .style('font', 'bold 12px var(--sans-serif)')
            .style('font-variant-numeric', 'tabular-nums')
            .attr('text-anchor', 'end')
            .selectAll('text')

        return ([date, data], transition) => label = label
            .data(data.slice(0, 12), d => d.name)
            .join(
                enter => enter.append('text')
                    .attr('transform', d => `translate(${x((prev.get(d) || d).value)},${y((prev.get(d) || d).rank)})`)
                    .attr('y', y.bandwidth() / 2)
                    .attr('x', -6)
                    .attr('dy', '-0.25em')
                    .text(d => d.name)
                    .call(text => text.append('tspan')
                        .attr('fill-opacity', 0.7)
                        .attr('font-weight', 'normal')
                        .attr('x', -6)
                        .attr('dy', '1.15em')),
                update => update,
                exit => exit.transition(transition).remove()
                    .attr('transform', d => `translate(${x((next.get(d) || d).value)},${y((next.get(d) || d).rank)})`)
                    .call(g => g.select('tspan').tween('text', d => textTween(d.value, (next.get(d) || d).value)))
            )
            .call(bar => bar.transition(transition)
                .attr('transform', d => `translate(${x(d.value)},${y(d.rank)})`)
                .call(g => g.select('tspan').tween('text', d => textTween((prev.get(d) || d).value, d.value))))
    }

    const textTween = (a, b) => {
        const formatNumber = (t) => {
            return format(',d')
        }

        const i = interpolateNumber(a, b);
        return function(t) {
            this.textContent = formatNumber(i(t));
        };
    }

    const ticker = (svg, keyframes) => {
        const formatDate = (e) => {
            return utcFormat('%Y')
        }

        const now = svg.append('text')
            .style('font', `bold ${barSize}px var(--sans-serif)`)
            .style('font-variant-numeric', 'tabular-nums')
            .attr('text-anchor', 'end')
            .attr('x', width - 6)
            .attr('y', marginTop + barSize * (12 - 0.45))
            .attr('dy', '0.32em')
            .text(formatDate(keyframes[0][0]))

        return ([date], transition) => {
            // transition.end().then(() => now.text(formatDate(date)));
            transition.end().then(() => now.text(utcFormat('%Y')))
        };
    }

    useEffect(() => {
        (async () => {
            if (json) {
                const svg = select(ref.current)
                const keyframes = getKeyframes()
                const nameframes = groups(keyframes.flatMap(([, data]) => data), d => d.name)
                const prev = new Map(nameframes.flatMap(([, data]) => pairs(data, (a, b) => [b, a])))
                const next = new Map(nameframes.flatMap(([, data]) => pairs(data)))

                const updateBars = bars(svg, prev, next)
                const updateAxis = axis(svg)
                const updateLabels = labels(svg, prev, next)
                const updateTicker = ticker(svg, keyframes)

                for (const keyframe of keyframes) {
                    const transition = svg.transition().duration(250).ease(easeLinear)
                    x.domain([0, keyframe[1][0].value]);

                    updateAxis(keyframe, transition);
                    updateBars(keyframe, transition);
                    updateLabels(keyframe, transition);
                    updateTicker(keyframe, transition);

                    await transition.end();
                }
            }
        })()
    }, [ref, json])

    return (
        <section className="d3-race-bar-chart">
            <svg ref={ref} width={width} height={height} />
        </section>
    )
}

export default RaceBarChart
