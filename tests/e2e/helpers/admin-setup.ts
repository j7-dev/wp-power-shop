/**
 * Admin Setup — 管理員登入與認證狀態管理
 */
import { chromium, type FullConfig } from '@playwright/test'
import * as fs from 'fs'
import * as path from 'path'
import { extractNonce } from './api-client.js'

export const AUTH_FILE = path.resolve(import.meta.dirname, '../.auth/admin.json')
export const NONCE_FILE = path.resolve(import.meta.dirname, '../.auth/nonce.txt')

export function getNonce(): string {
  return fs.readFileSync(NONCE_FILE, 'utf-8').trim()
}

export async function loginAsAdmin(baseURL: string): Promise<string> {
  const browser = await chromium.launch()
  const context = await browser.newContext()
  const page = await context.newPage()

  // 設定 WP test cookie（WordPress 登入需要此 cookie）
  await context.addCookies([
    {
      name: 'wordpress_test_cookie',
      value: 'WP+Cookie+check',
      domain: new URL(baseURL).hostname,
      path: '/',
    },
  ])

  // 登入
  await page.goto(`${baseURL}/wp-login.php`)
  await page.fill('#user_login', 'admin')
  await page.fill('#user_pass', 'password')
  await page.click('#wp-submit')
  await page.waitForURL('**/wp-admin/**', { timeout: 60_000 })

  // 儲存認證狀態
  await context.storageState({ path: AUTH_FILE })

  // 提取 nonce
  const nonce = await extractNonce(page, baseURL)
  fs.writeFileSync(NONCE_FILE, nonce)

  await browser.close()
  return nonce
}
