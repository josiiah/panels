import { Chart as ChartJS, ChartData, ChartDataset, ChartOptions, Filler, LinearScale, LineElement, PointElement } from 'chart.js';
import { DeepPartial } from 'ts-essentials';
import { useState } from 'react';
import { deepmerge, deepmergeCustom } from 'deepmerge-ts';
import { theme } from 'twin.macro';
import { hexToRgba } from '@/lib/helpers';

ChartJS.register(LineElement, PointElement, Filler, LinearScale);

const options: ChartOptions<'line'> = {
    responsive: true,
    animation: false,
    plugins: {
        legend: { display: false },
        title: { display: false },
        tooltip: { enabled: false },
    },
    layout: {
        padding: 0,
    },
    scales: {
        x: {
            min: 0,
            max: 19,
            type: 'linear',
            grid: {
                display: false,
                drawBorder: false,
            },
            ticks: {
                display: false,
            },
        },
        y: {
            min: 0,
            type: 'linear',
            grid: {
                display: true,
                color: theme('colors.gray.700'),
                drawBorder: false,
            },
            ticks: {
                display: true,
                count: 3,
                color: theme('colors.gray.200'),
                font: {
                    family: theme('fontFamily.sans'),
                    size: 11,
                    weight: '400',
                },
            },
        },
    },
    elements: {
        point: {
            radius: 0,
        },
        line: {
            tension: 0.15,
        },
    },
};

function getOptions(opts?: DeepPartial<ChartOptions<'line'>> | undefined): ChartOptions<'line'> {
    return deepmerge(options, opts || {});
}

type ChartDatasetCallback = (value: ChartDataset<'line'>, index: number) => ChartDataset<'line'>;

function getEmptyData(label: string, sets = 1, callback?: ChartDatasetCallback | undefined): ChartData<'line'> {
    const next = callback || ((value) => value);

    return {
        labels: Array(20)
            .fill(0)
            .map((_, index) => index),
        datasets: Array(sets)
            .fill(0)
            .map((_, index) =>
                next(
                    {
                        fill: true,
                        label,
                        data: Array(20).fill(-5),
                        borderColor: theme('colors.cyan.400'),
                        backgroundColor: hexToRgba(theme('colors.cyan.700'), 0.5),
                    },
                    index
                )
            ),
    };
}

const merge = deepmergeCustom({ mergeArrays: false });

interface UseChartOptions {
    sets: number;
    options?: DeepPartial<ChartOptions<'line'>> | number | undefined;
    callback?: ChartDatasetCallback | undefined;
}

function useChart(label: string, opts?: UseChartOptions) {
    const options = getOptions(typeof opts?.options === 'number' ? { scales: { y: { min: 0, suggestedMax: opts.options } } } : opts?.options);
    const [data, setData] = useState(getEmptyData(label, opts?.sets || 1, opts?.callback));

    const push = (items: number | null | (number | null)[]) =>
        setData((state) =>
            merge(state, {
                datasets: (Array.isArray(items) ? items : [items]).map((item, index) => ({
                    ...state.datasets[index],
                    data: state.datasets[index].data.slice(1).concat(typeof item === 'number' ? Number(item.toFixed(2)) : item),
                })),
            })
        );

    const clear = () =>
        setData((state) =>
            merge(state, {
                datasets: state.datasets.map((value) => ({
                    ...value,
                    data: Array(20).fill(-5),
                })),
            })
        );

    return { props: { data, options }, push, clear };
}

interface ExtraChartOptions {
    tickFormatter?: (value: number | string, label: string) => string;
    max?: number;
}

function useChartTickLabel(label: string, max: number, tickLabel: string, options: ExtraChartOptions = {}) {
    return useChart(label, {
        sets: 1,
        options: {
            animation: {
                duration: 0.25,
            },
            elements: {
                point: {
                    radius: 0,
                },
                line: {
                    tension: 0.6,
                    backgroundColor: 'rgba(15, 178, 184, 0.45)',
                    borderColor: '#32D0D9',
                },
            },
            scales: {
                y: {
                    grid: {
                        drawTicks: false,
                        color: '#1e1f2d',
                        drawBorder: false,
                    },
                    suggestedMax: max,
                    max: options.max || undefined,
                    ticks: {
                        callback(value) {
                            if (options.tickFormatter) {
                                return options.tickFormatter(value, tickLabel);
                            }
                            return `${value}${tickLabel}`;
                        },
                        font: {
                            size: 10,
                            family: '"IBM Plex Mono", monospace',
                        },
                        color: '#434556',
                    },
                },
            },
        },
    });
}

export { useChart, useChartTickLabel, getOptions, getEmptyData };
