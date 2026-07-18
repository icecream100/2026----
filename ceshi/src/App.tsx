import { ConfigProvider } from 'antd'
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom'
import AppShell from './app/AppShell'
import { theme } from './app/theme'
import DashboardPage from './pages/DashboardPage'
import HeatmapPage from './pages/HeatmapPage'
import StatsPage from './pages/StatsPage'
import CorrelationPage from './pages/CorrelationPage'
import ReportsPage from './pages/ReportsPage'
import RegionMonitorPage from './pages/RegionMonitorPage'
import ConfigPage from './pages/ConfigPage'
import AlertRulesPage from './pages/AlertRulesPage'
import AlertListPage from './pages/AlertListPage'

export default function App() {
  return <ConfigProvider theme={theme}><HashRouter><Routes><Route element={<AppShell />}><Route index element={<Navigate to="/dashboard" replace />} /><Route path="dashboard" element={<DashboardPage />} /><Route path="heatmap" element={<HeatmapPage />} /><Route path="stats" element={<StatsPage />} /><Route path="correlation" element={<CorrelationPage />} /><Route path="reports" element={<ReportsPage />} /><Route path="region-monitor" element={<RegionMonitorPage />} /><Route path="config" element={<ConfigPage />} /><Route path="alerts/rules" element={<AlertRulesPage />} /><Route path="alerts/list" element={<AlertListPage />} /><Route path="screen" element={<DashboardPage screenMode />} /><Route path="*" element={<Navigate to="/dashboard" replace />} /></Route></Routes></HashRouter></ConfigProvider>
}
