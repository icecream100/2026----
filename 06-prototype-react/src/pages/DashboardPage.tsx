import { Alert, Button, Card, Col, List, Row, Space, Tag, Tooltip, Typography } from 'antd'
import { ArrowDownOutlined, ArrowUpOutlined, ClockCircleOutlined, FullscreenOutlined, HeatMapOutlined, LeftOutlined, ReloadOutlined, TeamOutlined, UserAddOutlined, UserDeleteOutlined, WarningOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { HeatmapBoard, StatCard, TrendChart } from '../components/Charts'
import { alertSeed, buildingStats, hourlyTrend, screenAlerts } from '../mocks/data'

const { Title, Text } = Typography

export default function DashboardPage({ screenMode = false }: { screenMode?: boolean }) {
  const navigate = useNavigate()
  if (screenMode) return <ScreenView onExit={() => navigate('/dashboard')} />
  return <div className="page-stack dashboard-page">
    <div className="page-heading"><div><Title level={3}>人流分析总览</Title><Text type="secondary">一屏掌握园区当前人流状态，数据每 30 秒自动刷新</Text></div><Space><Button icon={<ReloadOutlined />} onClick={() => window?.dispatchEvent(new Event('prototype-refresh'))}>立即刷新</Button><Button icon={<FullscreenOutlined />} onClick={() => navigate('/screen')}>投屏模式</Button></Space></div>
    <Alert className="data-notice" showIcon type="info" message={<span>数据口径：区域当前人数为逐人检测框计数；分组在场人数基于净流入+每日闭园清零，为运营估算值。</span>} />
    <div className="stat-grid"><StatCard label="园区当前在场" value="486" suffix="人" change="+8.2%" tone="blue" icon={<TeamOutlined />} /><StatCard label="今日进入" value="8,542" suffix="人次" change="+12.4%" tone="green" icon={<UserAddOutlined />} /><StatCard label="今日离开" value="8,217" suffix="人次" change="+6.8%" tone="cyan" icon={<UserDeleteOutlined />} /><StatCard label="待处理告警" value="2" suffix="条" change="-3 条" tone="red" icon={<WarningOutlined />} /></div>
    <Row gutter={[16, 16]}>
      <Col xs={24} xl={15}><Card className="panel-card" title={<span><HeatMapOutlined className="title-icon blue-text" />园区实时足迹热力图</span>} extra={<Button type="link" onClick={() => navigate('/heatmap')}>查看详情 <LeftOutlined rotate={180} /></Button>}><HeatmapBoard compact onAreaClick={() => navigate('/heatmap')} /></Card></Col>
      <Col xs={24} xl={9}><Card className="panel-card" title={<span><TeamOutlined className="title-icon" />建筑人数排行</span>} extra={<Button type="link" onClick={() => navigate('/stats')}>查看全部</Button>}><List className="ranking-list" dataSource={buildingStats.slice(0, 5)} renderItem={(item) => <List.Item><span className={`rank-index rank-${item.rank}`}>{item.rank}</span><span className="rank-name">{item.name}</span><strong>{item.current}<small> 人</small></strong><span className={item.change > 0 ? 'change-up' : 'change-down'}>{item.change > 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />} {Math.abs(item.change)}%</span></List.Item>} /></Card></Col>
    </Row>
    <Row gutter={[16, 16]}>
      <Col xs={24} xl={15}><Card className="panel-card" title={<span><ClockCircleOutlined className="title-icon" />今日分时流量</span>} extra={<Tag color="blue">实时</Tag>}><div className="chart-summary"><div><Text type="secondary">总进入</Text><strong>8,542</strong></div><div><Text type="secondary">峰值时段</Text><strong>14:00 - 15:00</strong></div><div><Text type="secondary">峰值同时在场</Text><strong>512</strong></div></div><TrendChart data={hourlyTrend} /></Card></Col>
      <Col xs={24} xl={9}><Card className="panel-card" title={<span><WarningOutlined className="title-icon red-text" />实时告警</span>} extra={<Button type="link" onClick={() => navigate('/alerts/list')}>查看全部</Button>}><List className="alert-list" dataSource={alertSeed.slice(0, 3)} renderItem={(item) => <List.Item><div className="alert-item"><div><Tag color={item.level === '高' ? 'red' : 'orange'}>{item.level}</Tag><span>{item.type}</span></div><strong>{item.area}</strong><Text type="secondary">{item.time} · {item.value}</Text></div></List.Item>} /></Card></Col>
    </Row>
    <div className="quick-entry"><span>常用操作</span><Button type="link" onClick={() => navigate('/config')}>配置统计设备</Button><Button type="link" onClick={() => navigate('/reports')}>查看人流报表</Button><Button type="link" onClick={() => navigate('/alerts/rules')}>维护告警规则</Button></div>
  </div>
}

function ScreenView({ onExit }: { onExit: () => void }) {
  return <div className="screen-page"><div className="screen-top"><div className="screen-brand"><div className="brand-logo"><TeamOutlined /></div><div><strong>园区人流监控中心</strong><small>PEOPLE FLOW COMMAND CENTER</small></div></div><div className="screen-time">2026 / 07 / 18 <strong>10:45:32</strong></div><Space><span className="screen-live"><i /> LIVE · 30s</span><Tooltip title="退出投屏"><Button type="text" icon={<FullscreenOutlined />} onClick={onExit} /></Tooltip></Space></div><div className="screen-stats"><ScreenStat label="当前在场人数" value="486" suffix="估算" tone="blue" /><ScreenStat label="今日进入" value="8,542" tone="green" /><ScreenStat label="今日离开" value="8,217" tone="cyan" /><ScreenStat label="未处理告警" value="2" tone="red" /></div><div className="screen-main"><Card className="screen-map-card" title="园区足迹热力图" extra={<span className="screen-muted">逐人位置累积密度 · 已标定摄像头 6 / 8</span>}><HeatmapBoard dark /></Card><Card className="screen-rank-card" title="区域人数排行"><List dataSource={buildingStats} renderItem={(item) => <List.Item><span className={`rank-index rank-${item.rank}`}>{item.rank}</span><span className="rank-name">{item.name}</span><strong>{item.current}</strong></List.Item>} /></Card></div><div className="screen-bottom"><Card title="今日分时趋势"><TrendChart data={hourlyTrend} dark height={160} /></Card><Card title="实时告警滚动"><List dataSource={screenAlerts} renderItem={(item) => <List.Item><Text className="screen-muted">{item.time}</Text><span>{item.text}</span><Tag color={item.level === '高' ? 'red' : item.level === '中' ? 'orange' : 'green'}>{item.level}</Tag></List.Item>} /></Card></div></div>
}

function ScreenStat({ label, value, suffix, tone }: { label: string; value: string; suffix?: string; tone: string }) { return <div className={`screen-stat screen-stat-${tone}`}><Text>{label}</Text><strong>{value}<small>{suffix}</small></strong></div> }
