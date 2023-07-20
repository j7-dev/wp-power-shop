import '@/assets/scss/index.scss'
import SalesStats from './pages/SalesStats'
import { StyleProvider } from '@ant-design/cssinjs'

function App4() {
  return (
    <StyleProvider hashPriority="high">
      <SalesStats />
    </StyleProvider>
  )
}

export default App4
