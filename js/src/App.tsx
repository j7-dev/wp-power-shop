import '@/assets/scss/index.scss'
import AddProduct from './pages/AddProduct'
import { StyleProvider } from '@ant-design/cssinjs'

function App() {
  return (
    <StyleProvider hashPriority="high">
      <AddProduct />
    </StyleProvider>
  )
}

export default App
