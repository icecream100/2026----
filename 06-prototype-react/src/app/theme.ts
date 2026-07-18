import type { ThemeConfig } from 'antd'

export const theme: ThemeConfig = {
  token: {
    colorPrimary: '#1677ff',
    colorSuccess: '#16a34a',
    colorWarning: '#d97706',
    colorError: '#dc2626',
    colorBgLayout: '#f5f7fb',
    borderRadius: 8,
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", sans-serif',
  },
  components: {
    Layout: { siderBg: '#101828', headerBg: '#ffffff' },
    Menu: { darkItemBg: '#101828', darkItemSelectedBg: '#1d4ed8', darkItemHoverBg: '#172554' },
    Table: { headerBg: '#f8fafc', rowHoverBg: '#f8fbff' },
  },
}
