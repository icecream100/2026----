import { expect, test } from '@playwright/test'

test('dashboard loads with core metrics and navigation', async ({ page }) => {
  await page.goto('/#/dashboard')
  await expect(page.getByRole('heading', { name: '人流分析总览' })).toBeVisible()
  await expect(page.getByText('园区当前在场')).toBeVisible()
  await page.getByRole('menuitem', { name: '热力图分析' }).click()
  await expect(page.getByRole('heading', { name: '热力图分析' })).toBeVisible()
})

test('heatmap switches to historical mode and plays', async ({ page }) => {
  await page.goto('/#/heatmap')
  await page.locator('.heatmap-controls input').first().click()
  await page.getByText('17', { exact: true }).last().click()
  await expect(page.getByText('历史回看 · 已定格')).toBeVisible()
  await page.getByRole('button', { name: 'play-circle 播放' }).click()
  await expect(page.getByRole('button', { name: 'pause 暂停' })).toBeVisible()
})

test('configuration drawer and alert state feedback work', async ({ page }) => {
  await page.goto('/#/config')
  await page.getByRole('button', { name: 'setting 配置', exact: true }).first().click()
  await expect(page.getByText('设备配置 · 食堂-入口')).toBeVisible()
  await page.getByRole('tab', { name: '算法绑定' }).click()
  await page.getByRole('button', { name: 'save 保存绑定' }).click()
  await expect(page.getByText('算法绑定保存成功')).toBeVisible()

  await page.goto('/#/alerts/list')
  await page.getByRole('button', { name: 'check 确认' }).click()
  await expect(page.getByText('告警已确认，状态变更为处理中')).toBeVisible()
})
