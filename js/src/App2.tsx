import '@/assets/scss/index.scss'
import SalesStats from './pages/SalesStats'
import { StyleProvider } from '@ant-design/cssinjs'

function App2() {
	return (
		<StyleProvider hashPriority="high">
			<SalesStats isAdmin={true} />
		</StyleProvider>
	)
}

export default App2
