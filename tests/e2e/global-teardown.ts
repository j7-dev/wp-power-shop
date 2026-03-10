/**
 * Global Teardown — 測試完成後清理
 */
import { revertLcBypass } from './helpers/lc-bypass.js'

async function globalTeardown() {
  console.log('\n🧹 E2E Global Teardown')

  // 還原 LC bypass
  try {
    revertLcBypass()
  } catch (e) {
    console.warn('LC bypass 還原跳過:', (e as Error).message)
  }

  console.log('🎉 Global Teardown 完成\n')
}

export default globalTeardown
