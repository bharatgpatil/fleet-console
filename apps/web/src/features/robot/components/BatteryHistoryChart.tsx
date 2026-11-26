import type { HistoryPoint } from '@fleet/contracts';
import { ALERT_RULES } from '@fleet/domain';
import { useTheme } from '@mui/material';
import { ChartsReferenceLine } from '@mui/x-charts/ChartsReferenceLine';
import { LineChart } from '@mui/x-charts/LineChart';
import { useMemo } from 'react';
import { formatClock } from '../../../shared/utils/format.ts';
import { batterySeries } from '../utils/battery-series.ts';
import { CHART_HEIGHT } from '../utils/constants.ts';

type BatteryHistoryChartProps = {
  points: readonly HistoryPoint[];
  windowMs: number;
  now: number;
};

export function BatteryHistoryChart({ points, windowMs, now }: BatteryHistoryChartProps) {
  const theme = useTheme();
  const { times, levels } = useMemo(() => batterySeries(points), [points]);
  const first = points[0];
  const last = points.at(-1);

  const summary =
    first === undefined || last === undefined
      ? 'No battery readings yet'
      : `Battery went from ${Math.round(first.battery)}% to ${Math.round(last.battery)}%`;

  return (
    <LineChart
      height={CHART_HEIGHT}
      aria-label={summary}
      skipAnimation
      hideLegend
      grid={{ horizontal: true }}
      margin={{ left: 0, right: 8 }}
      xAxis={[
        {
          data: times,
          scaleType: 'time',
          min: new Date(now - windowMs),
          max: new Date(now),
          valueFormatter: (value: Date) => formatClock(value.getTime()),
        },
      ]}
      yAxis={[{ min: 0, max: 100, width: 44, valueFormatter: (value: number) => `${value}%` }]}
      series={[
        {
          data: levels,
          label: 'Battery',
          color: theme.palette.primary.main,
          showMark: false,
          connectNulls: false,
          valueFormatter: (value) => (value === null ? 'no data' : `${Math.round(value)}%`),
        },
      ]}
    >
      <ChartsReferenceLine
        y={ALERT_RULES.batteryLowBelow}
        label={`Low ${ALERT_RULES.batteryLowBelow}%`}
        labelAlign="end"
        lineStyle={{ stroke: theme.palette.health.warning, strokeDasharray: '4 4' }}
        labelStyle={{ fontSize: 11, fill: theme.palette.text.secondary }}
      />
      <ChartsReferenceLine
        y={ALERT_RULES.batteryCriticalBelow}
        label={`Critical ${ALERT_RULES.batteryCriticalBelow}%`}
        labelAlign="end"
        lineStyle={{ stroke: theme.palette.health.critical, strokeDasharray: '4 4' }}
        labelStyle={{ fontSize: 11, fill: theme.palette.text.secondary }}
      />
    </LineChart>
  );
}
