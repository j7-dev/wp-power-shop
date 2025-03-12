import { renderHTML } from 'antd-toolkit'

type TInfo = {
	full_name: string
	email: string
	phone: string
	full_address: string
	company: string
}

const defaultInfo: TInfo = {
	full_name: '',
	email: '',
	phone: '',
	full_address: '',
	company: '',
}

export const InfoTable = ({ info = defaultInfo }: { info: TInfo }) => {
	const { full_name, email, phone, full_address, company } = info
	return (
		<table className="table table-vertical table-xs text-xs [&_th]:!w-20">
			<tbody>
				<tr>
					<th>姓名</th>
					<td>{full_name}</td>
				</tr>
				<tr>
					<th>電話</th>
					<td>{phone}</td>
				</tr>
				<tr>
					<th>地址</th>
					<td>{renderHTML(full_address)}</td>
				</tr>
				{email && (
					<tr>
						<th>Email</th>
						<td>{email}</td>
					</tr>
				)}
				{company && (
					<tr>
						<th>公司</th>
						<td>{company}</td>
					</tr>
				)}
			</tbody>
		</table>
	)
}
