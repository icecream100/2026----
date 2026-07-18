import { useMemo } from 'react'
import { Empty, Tag, Typography } from 'antd'
import { EnvironmentOutlined, FireOutlined, VideoCameraOutlined } from '@ant-design/icons'

const { Text } = Typography

export function TrendChart({ data, dark = false, height = 210 }: { data: number[]; dark?: boolean; height?: number }) {
  const points = useMemo(() => {
    const max = Math.max(...data)
    return data.map((value, index) => `${(index / (data.length - 1)) * 100},${height - 30 - (value / max) * (height - 58)}`).join(' ')
  }, [data, height])
  return (
    <div className={`trend-chart ${dark ? 'trend-chart-dark' : ''}`}>
      <svg viewBox={`0 0 100 ${height}`} preserveAspectRatio="none" aria-label="分时流量趋势">
        {[0, 1, 2, 3].map((line) => <line key={line} x1="0" y1={20 + line * ((height - 50) / 3)} x2="100" y2={20 + line * ((height - 50) / 3)} className="chart-grid" />)}
        <polyline points={points} className="chart-line" />
        <polyline points={`0,${height - 30} ${points} 100,${height - 30}`} className="chart-area" />
      </svg>
      <div className="chart-x-axis"><span>00:00</span><span>06:00</span><span>12:00</span><span>18:00</span><span>24:00</span></div>
    </div>
  )
}

type HeatmapBoardProps = { compact?: boolean; dark?: boolean; showCameras?: boolean; onAreaClick?: (name: string) => void }

export function HeatmapBoard({ compact = false, dark = false, showCameras = true, onAreaClick }: HeatmapBoardProps) {
  const areas = [
    { name: '研发楼 A 座', x: 26, y: 24, w: 24, h: 30, heat: 'hot' },
    { name: '研发楼 B 座', x: 55, y: 18, w: 20, h: 26, heat: 'warm' },
    { name: '食堂一层', x: 19, y: 62, w: 23, h: 21, heat: 'hotter' },
    { name: '运动中心', x: 52, y: 57, w: 27, h: 25, heat: 'cool' },
  ]
  return (
    <div className={`heatmap-board ${compact ? 'heatmap-board-compact' : ''} ${dark ? 'heatmap-board-dark' : ''}`}>
      <div className="map-toolbar"><span><EnvironmentOutlined /> 园区平面图 · 2026-07-18 10:45</span><span className="map-status"><i /> 实时数据</span></div>
      <div className="map-canvas">
        <div className="map-road road-one" /><div className="map-road road-two" /><div className="map-road road-three" />
        {areas.map((area) => (
          <button key={area.name} type="button" className={`map-area ${area.heat}`} style={{ left: `${area.x}%`, top: `${area.y}%`, width: `${area.w}%`, height: `${area.h}%` }} onClick={() => onAreaClick?.(area.name)}>
            <span>{area.name}</span>
            {!compact && <strong>{area.name === '研发楼 A 座' ? '128' : area.name === '食堂一层' ? '86' : area.name === '研发楼 B 座' ? '62' : '31'}<small> 人</small></strong>}
          </button>
        ))}
        {showCameras && <>
          <span className="camera-pin pin-one"><VideoCameraOutlined /></span><span className="camera-pin pin-two"><VideoCameraOutlined /></span><span className="camera-pin pin-three"><VideoCameraOutlined /></span>
        </>}
        <div className="map-cluster"><FireOutlined /> 聚集点 3</div>
        <div className="map-compass">N</div>
      </div>
      {!compact && <div className="map-legend"><span>低</span><i className="legend-cold" /><i className="legend-mild" /><i className="legend-warm" /><i className="legend-hot" /><span>高</span><Text type="secondary">颜色表示逐人脚位置累积密度</Text></div>}
    </div>
  )
}

export function MiniBars({ values, color = '#1677ff' }: { values: number[]; color?: string }) {
  const max = Math.max(...values)
  return <div className="mini-bars">{values.map((value, index) => <i key={`${value}-${index}`} style={{ height: `${Math.max(12, (value / max) * 100)}%`, background: color }} />)}</div>
}

export function StatCard({ label, value, suffix, change, tone = 'blue', icon }: { label: string; value: string; suffix?: string; change?: string; tone?: string; icon: React.ReactNode }) {
  return <div className="stat-card"><div className={`stat-icon stat-${tone}`}>{icon}</div><div className="stat-copy"><Text type="secondary">{label}</Text><div className="stat-value">{value}<small>{suffix}</small></div>{change && <span className={change.startsWith('-') ? 'change-down' : 'change-up'}>{change} <em>较昨日</em></span>}</div></div>
}

export function EmptyState({ description }: { description: string }) {
  return <div className="empty-state"><Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={description} /></div>
}

export function StatusTag({ status }: { status: string }) {
  const colorMap: Record<string, string> = { 已标定: 'green', 已画线: 'blue', 未配置: 'default', 在线: 'green', 离线: 'red', 待确认: 'red', 处理中: 'orange', 已关闭: 'default', 已生成: 'green' }
  return <Tag color={colorMap[status] ?? 'blue'}>{status}</Tag>
}
