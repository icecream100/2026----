export type AlertStatus = '待确认' | '处理中' | '已关闭'

export const groups = [
  { id: 'all', name: '全部区域', count: 8, active: true },
  { id: 'east', name: '东区办公组团', count: 3, active: true },
  { id: 'west', name: '西区生活配套', count: 3, active: true },
  { id: 'north', name: '北区公共空间', count: 2, active: true },
]

export const cameras = [
  { id: 'cam-001', name: '食堂-入口', group: '西区生活配套', status: '已标定', online: true, people: 86, area: '入口大厅' },
  { id: 'cam-002', name: '食堂-二层', group: '西区生活配套', status: '已画线', online: true, people: 42, area: '就餐区' },
  { id: 'cam-003', name: '研发楼-A座', group: '东区办公组团', status: '已标定', online: true, people: 128, area: '一层大厅' },
  { id: 'cam-004', name: '研发楼-B座', group: '东区办公组团', status: '未配置', online: false, people: 0, area: '主入口' },
  { id: 'cam-005', name: '园区南门', group: '北区公共空间', status: '已标定', online: true, people: 74, area: '人行通道' },
  { id: 'cam-006', name: '连廊-东侧', group: '东区办公组团', status: '已标定', online: true, people: 55, area: '二层连廊' },
  { id: 'cam-007', name: '运动中心', group: '西区生活配套', status: '已画线', online: true, people: 31, area: '羽毛球馆' },
  { id: 'cam-008', name: '北门广场', group: '北区公共空间', status: '已标定', online: true, people: 19, area: '广场东侧' },
]

export const buildingStats = [
  { rank: 1, name: '研发楼 A 座', current: 128, peak: 184, enter: 1248, change: 12.4, zone: '东区办公组团' },
  { rank: 2, name: '食堂一层', current: 86, peak: 156, enter: 986, change: 8.6, zone: '西区生活配套' },
  { rank: 3, name: '园区南门', current: 74, peak: 121, enter: 832, change: -3.2, zone: '北区公共空间' },
  { rank: 4, name: '研发楼 B 座', current: 62, peak: 116, enter: 720, change: 6.8, zone: '东区办公组团' },
  { rank: 5, name: '运动中心', current: 31, peak: 92, enter: 458, change: -5.4, zone: '西区生活配套' },
]

export const alertSeed = [
  { id: 'AL-20260718-008', time: '10:42:18', type: '超员告警', level: '高', area: '研发楼 A 座 · 一层大厅', value: '128 / 120 人', status: '待确认' as AlertStatus, rule: '办公楼大厅超员' },
  { id: 'AL-20260718-007', time: '10:38:05', type: '聚集告警', level: '中', area: '园区南门 · 人行通道', value: '持续 8 分钟', status: '处理中' as AlertStatus, rule: '出入口聚集检测' },
  { id: 'AL-20260718-006', time: '10:21:44', type: '超员告警', level: '高', area: '食堂一层 · 入口大厅', value: '86 / 80 人', status: '已关闭' as AlertStatus, rule: '餐厅高峰超员' },
  { id: 'AL-20260718-005', time: '09:56:31', type: '聚集告警', level: '中', area: '运动中心 · 羽毛球馆', value: '持续 5 分钟', status: '已关闭' as AlertStatus, rule: '运动场馆聚集检测' },
]

export const reportSeed = [
  { id: 'R-20260717-D', type: '日报', period: '2026-07-17', enter: 8542, leave: 8217, peak: 486, alerts: 12, status: '已生成' },
  { id: 'R-20260714-W', type: '周报', period: '2026-07-07 ~ 07-13', enter: 52846, leave: 52102, peak: 512, alerts: 67, status: '已生成' },
  { id: 'R-20260701-M', type: '月报', period: '2026-06-01 ~ 06-30', enter: 224680, leave: 223991, peak: 628, alerts: 286, status: '已生成' },
  { id: 'R-20260716-D', type: '日报', period: '2026-07-16', enter: 8126, leave: 7998, peak: 452, alerts: 9, status: '已生成' },
]

export const hourlyTrend = [18, 24, 31, 42, 60, 88, 132, 158, 146, 120, 112, 136, 168, 182, 174, 156, 142, 128, 104, 76, 54, 42, 31, 22]

export const flowPairs = [
  { from: '园区南门', to: '研发楼 A 座', value: 628, rate: 42.8 },
  { from: '研发楼 A 座', to: '食堂一层', value: 486, rate: 31.6 },
  { from: '研发楼 B 座', to: '运动中心', value: 232, rate: 18.5 },
  { from: '食堂一层', to: '园区南门', value: 196, rate: 12.4 },
]

export const screenAlerts = [
  { time: '10:42', text: '研发楼 A 座一层大厅超员', level: '高' },
  { time: '10:38', text: '园区南门人行通道聚集', level: '中' },
  { time: '10:21', text: '食堂一层入口超员已关闭', level: '已处理' },
]
