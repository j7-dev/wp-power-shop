import '@/assets/scss/index.scss'
import Report from './pages/Report'
import { StyleProvider } from '@ant-design/cssinjs'

function App4() {
	return (
		<StyleProvider hashPriority="high">
			<Report />
		</StyleProvider>
	)
}

export default App4
