import { Layout, Menu, Avatar, Badge, Button, Breadcrumb, Space, Typography } from 'antd'
import {
  AlertOutlined, BarChartOutlined, BellOutlined, DashboardOutlined, ExperimentOutlined,
  FireOutlined, FullscreenOutlined, SettingOutlined, TeamOutlined,
  VideoCameraOutlined, ApartmentOutlined, FileTextOutlined,
} from '@ant-design/icons'
import type { MenuProps } from 'antd'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'

const { Header, Sider, Content } = Layout

const menuItems: MenuProps['items'] = [
  { key: '/dashboard', icon: <DashboardOutlined />, label: '人流分析总览' },
  { key: '/heatmap', icon: <FireOutlined />, label: '热力图分析' },
  { key: '/stats', icon: <BarChartOutlined />, label: '流量统计分析' },
  { key: '/correlation', icon: <ApartmentOutlined />, label: <span>建筑关联分析 <small className="menu-experimental">实验</small></span> },
  { key: '/reports', icon: <FileTextOutlined />, label: '人流报表' },
  { key: '/region-monitor', icon: <VideoCameraOutlined />, label: '建筑人数监测' },
  { key: '/config', icon: <SettingOutlined />, label: '分析配置' },
  { type: 'divider' },
  { key: '/alerts/rules', icon: <BellOutlined />, label: '告警规则' },
  { key: '/alerts/list', icon: <AlertOutlined />, label: <span>告警列表 <Badge count={2} size="small" /></span> },
  { key: '/screen', icon: <FullscreenOutlined />, label: '监控中心大屏' },
]

const breadcrumbMap: Record<string, string[]> = {
  '/dashboard': ['人流分析', '人流分析总览'], '/heatmap': ['人流分析', '热力图分析'], '/stats': ['人流分析', '流量统计分析'],
  '/correlation': ['人流分析', '建筑关联分析'], '/reports': ['人流分析', '人流报表'], '/region-monitor': ['人流分析', '建筑人数监测'],
  '/config': ['人流分析', '分析配置'], '/alerts/rules': ['告警', '告警规则'], '/alerts/list': ['告警', '告警列表'], '/screen': ['监控', '监控中心大屏'],
}

export default function AppShell() {
  const location = useLocation()
  const navigate = useNavigate()
  const crumb = breadcrumbMap[location.pathname] ?? ['人流分析', '人流分析总览']
  const selected = location.pathname === '/screen' ? '/screen' : menuItems?.find((item) => 'key' in (item ?? {}) && location.pathname.startsWith(String(item?.key)))?.key
  return (
    <Layout className="app-layout">
      <Sider width={232} breakpoint="lg" collapsedWidth="0" className="app-sider">
        <div className="brand-block"><div className="brand-logo"><TeamOutlined /></div><div><div className="brand-title">园区运营中心</div><div className="brand-caption">视频云 · 人流分析</div></div></div>
        <div className="sider-section-title">业务导航</div>
        <Menu theme="dark" mode="inline" selectedKeys={[String(selected ?? '/dashboard')]} items={menuItems} onClick={({ key }) => navigate(key)} />
        <div className="sider-footer"><div className="data-pulse"><i /> 数据连接正常</div><Typography.Text>v3.1 · 2026.07.18</Typography.Text></div>
      </Sider>
      <Layout>
        <Header className="app-header"><div className="header-left"><Typography.Text type="secondary">运营工作台</Typography.Text><span className="header-divider" /> <Breadcrumb items={crumb.map((title) => ({ title }))} /></div><Space size={16}><Button type="text" icon={<ExperimentOutlined />} onClick={() => navigate('/correlation')}>实验数据</Button><Badge dot><BellOutlined className="header-icon" /></Badge><div className="user-chip"><Avatar size={30} style={{ background: '#1677ff' }}>林</Avatar><span>林晓宇</span></div></Space></Header>
        <Content className="app-content"><Outlet /></Content>
      </Layout>
    </Layout>
  )
}
