import '@/assets/scss/index.scss'
import PowerShopProducts from './pages/PowerShopProducts'
import { StyleProvider } from '@ant-design/cssinjs'

function App2() {
  return (
    <StyleProvider hashPriority="high">
      <PowerShopProducts />
    </StyleProvider>
  )
}

export default App2
