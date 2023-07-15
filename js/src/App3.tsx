import '@/assets/scss/index.scss'
import FastShopProducts from './pages/FastShopProducts'
import { StyleProvider } from '@ant-design/cssinjs'

function App2() {
  return (
    <StyleProvider hashPriority="high">
      <FastShopProducts />
    </StyleProvider>
  )
}

export default App2
