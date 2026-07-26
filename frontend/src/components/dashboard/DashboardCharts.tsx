import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

import type { InventoryDistributionSlice, OrderStatusCount, ShippingCostTrendPoint, WarehouseUtilizationItem } from '../../types/dashboard'
import { formatChartDate, getStatusColor } from '../../services/dashboardService'
import { ChartCard } from './ChartCard'

type WarehouseUtilizationChartProps = {
  data: WarehouseUtilizationItem[]
}

export function WarehouseUtilizationChart({ data }: WarehouseUtilizationChartProps) {
  const chartData = data.map((warehouse) => ({
    name: warehouse.warehouseName,
    utilization: warehouse.utilizationPercentage,
  }))

  return (
    <ChartCard
      title="Warehouse Utilization"
      description="Capacity usage across fulfillment centers"
      isEmpty={chartData.length === 0}
      emptyMessage="No warehouse utilization data available."
    >
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis
              dataKey="name"
              tick={{ fill: '#64748b', fontSize: 12 }}
              interval={0}
              angle={-20}
              textAnchor="end"
              height={70}
            />
            <YAxis tick={{ fill: '#64748b', fontSize: 12 }} unit="%" />
            <Tooltip
              formatter={(value) => [`${Number(value).toFixed(1)}%`, 'Utilization']}
              contentStyle={{ borderRadius: '0.75rem', borderColor: '#e2e8f0' }}
            />
            <Bar dataKey="utilization" fill="#3b82f6" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  )
}

type InventoryDistributionChartProps = {
  data: InventoryDistributionSlice[]
}

export function InventoryDistributionChart({ data }: InventoryDistributionChartProps) {
  return (
    <ChartCard
      title="Inventory Distribution"
      description="Stock health across inventory records"
      isEmpty={data.length === 0}
      emptyMessage="No inventory distribution data available."
    >
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={95}
              innerRadius={0}
              paddingAngle={2}
            >
              {data.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value, name) => [value, name]}
              contentStyle={{ borderRadius: '0.75rem', borderColor: '#e2e8f0' }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  )
}

type ShippingCostTrendChartProps = {
  data: ShippingCostTrendPoint[]
}

export function ShippingCostTrendChart({ data }: ShippingCostTrendChartProps) {
  const chartData = data.map((point) => ({
    ...point,
    label: formatChartDate(point.date),
  }))

  return (
    <ChartCard
      title="Shipping Cost Trend"
      description="Daily average shipping cost from allocations"
      isEmpty={chartData.length === 0}
      emptyMessage="No shipping cost trend data available."
    >
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="label" tick={{ fill: '#64748b', fontSize: 12 }} />
            <YAxis tick={{ fill: '#64748b', fontSize: 12 }} />
            <Tooltip
              formatter={(value) => [`₹${Number(value).toFixed(2)}`, 'Avg Cost']}
              contentStyle={{ borderRadius: '0.75rem', borderColor: '#e2e8f0' }}
            />
            <Line
              type="monotone"
              dataKey="averageShippingCost"
              stroke="#0ea5e9"
              strokeWidth={2}
              dot={{ r: 3, fill: '#0ea5e9' }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  )
}

type OrdersByStatusChartProps = {
  data: OrderStatusCount[]
}

export function OrdersByStatusChart({ data }: OrdersByStatusChartProps) {
  const chartData = data.map((item) => ({
    name: item.status.replace('_', ' '),
    value: item.count,
    status: item.status,
  }))

  return (
    <ChartCard
      title="Orders by Status"
      description="Current order pipeline breakdown"
      isEmpty={chartData.length === 0}
      emptyMessage="No order status data available."
    >
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={95}
              paddingAngle={2}
            >
              {chartData.map((entry) => (
                <Cell key={entry.status} fill={getStatusColor(entry.status)} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value, name) => [value, name]}
              contentStyle={{ borderRadius: '0.75rem', borderColor: '#e2e8f0' }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  )
}
