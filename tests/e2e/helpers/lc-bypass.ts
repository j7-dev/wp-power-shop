/**
 * License Check Bypass — 繞過 Powerhouse 授權檢查（E2E 測試專用）
 *
 * 原理：在 $this->init() 的參數陣列中注入 'lc' => false，
 * 讓 PluginTrait::set_lc() 將 self::$need_lc 設為 false，
 * 使 check_required_plugins() 無條件呼叫 Bootstrap::instance()。
 */
import * as fs from 'fs'
import * as path from 'path'

const PLUGIN_FILE = path.resolve(import.meta.dirname, '../../../plugin.php')
const BACKUP_FILE = PLUGIN_FILE + '.e2e-backup'
const MARKER = '/* E2E-LC-BYPASS */'

export function applyLcBypass(): void {
  const content = fs.readFileSync(PLUGIN_FILE, 'utf-8')
  if (content.includes(MARKER)) return
  fs.copyFileSync(PLUGIN_FILE, BACKUP_FILE)

  // 在 init() 參數陣列中注入 'lc' => false
  const needle = "'callback'    => [ Bootstrap::class, 'instance' ],"
  if (!content.includes(needle)) {
    // 嘗試寬鬆匹配
    const altNeedle = "'callback'"
    if (!content.includes(altNeedle)) {
      console.warn('找不到 LC bypass 注入點，跳過 bypass')
      return
    }
    // 在 callback 行後注入
    const patched = content.replace(
      /('callback'\s*=>\s*\[.*?\],)/s,
      `$1\n\t\t\t\t'lc'          => false, ${MARKER}`,
    )
    if (patched === content) {
      console.warn('LC bypass 注入失敗（regex 無法匹配），跳過')
      return
    }
    fs.writeFileSync(PLUGIN_FILE, patched)
    console.log('✅ LC bypass 已注入（regex 模式）')
    return
  }

  const patched = content.replace(
    needle,
    `${needle}\n\t\t\t\t'lc'          => false, ${MARKER}`,
  )
  fs.writeFileSync(PLUGIN_FILE, patched)
  console.log('✅ LC bypass 已注入')
}

export function revertLcBypass(): void {
  if (fs.existsSync(BACKUP_FILE)) {
    fs.copyFileSync(BACKUP_FILE, PLUGIN_FILE)
    fs.unlinkSync(BACKUP_FILE)
    console.log('✅ LC bypass 已還原')
  }
}
