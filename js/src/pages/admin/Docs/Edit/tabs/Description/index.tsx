import { memo, useEffect, useState } from 'react'
import KeyWords from './KeyWords'
import {
	Form,
	Input,
	// Select,
	Typography,
	Button,
	UploadFile,
	Radio,
} from 'antd'
import {
	// termToOptions,
	// defaultSelectProps,
	Heading,
	Switch,
	CopyText,
	useEnv,
} from 'antd-toolkit'
import { FileUpload } from 'antd-toolkit/wp'

const { Item } = Form
const { Text } = Typography

const DescriptionComponent = () => {
	const form = Form.useFormInstance()

	// const { options, isLoading } = useOptions({ endpoint: 'courses/options' })
	// const { product_cats = [], product_tags = [] } = {}
	const { SITE_URL = '', DOCS_POST_TYPE = '', ELEMENTOR_ENABLED } = useEnv()

	const docsUrl = `${SITE_URL}/${DOCS_POST_TYPE}/`
	const watchSlug = Form.useWatch(['slug'], form)
	const watchId = Form.useWatch(['id'], form)
	const watchEditor = Form.useWatch(['editor'], form)
	const watchNeedAccess = Form.useWatch(['need_access'], form)

	// 縮圖
	const [fileList, setFileList] = useState<UploadFile[]>([])
	const watchImages = Form.useWatch(['images'], form)
	const featureImageUrl = watchImages?.[0]?.url

	// 背景圖
	const [bgFileList, setBgFileList] = useState<UploadFile[]>([])
	const watchBgImages = Form.useWatch(['bg_images'], form)
	const bgImageUrl = watchBgImages?.[0]?.url

	useEffect(() => {
		if (watchId) {
			if (featureImageUrl) {
				setFileList([
					{
						uid: '-1',
						name: 'feature_image_url.png',
						status: 'done',
						url: featureImageUrl,
					},
				])
			}
			if (bgImageUrl) {
				setBgFileList([
					{
						uid: '-1',
						name: 'bg_image_url.png',
						status: 'done',
						url: bgImageUrl,
					},
				])
			}
		}
	}, [watchId])

	return (
		<>
			<div className="mb-12">
				<Heading>知識庫發佈</Heading>

				<Item name={['slug']} label="網址">
					<Input
						addonBefore={
							<Text className="max-w-[25rem] text-left" ellipsis>
								{docsUrl}
							</Text>
						}
						addonAfter={<CopyText text={`${docsUrl}${watchSlug}`} />}
					/>
				</Item>

				<Switch
					formItemProps={{
						name: ['status'],
						label: '發佈',
						initialValue: 'publish',
						getValueProps: (value) => ({ value: value === 'publish' }),
						normalize: (value) => (value ? 'publish' : 'draft'),
						hidden: true,
					}}
					switchProps={{
						checkedChildren: '發佈',
						unCheckedChildren: '草稿',
					}}
				/>
			</div>
			<div className="mb-12">
				<Heading>知識庫描述</Heading>

				<Item name={['id']} hidden normalize={() => undefined} />

				<div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
					<Item name={['name']} label="知識庫名稱" className="xl:col-span-3">
						<Input allowClear />
					</Item>
					{/* TODO: 知識庫分類 */}
					{/* <Item name={['category_ids']} label="知識庫分類" initialValue={[]}>
						<Select
							{...defaultSelectProps}
							options={termToOptions(product_cats)}
							placeholder="可多選"
							disabled
						/>
					</Item>
					<Item name={['tag_ids']} label="知識庫標籤" initialValue={[]}>
						<Select
							{...defaultSelectProps}
							options={termToOptions(product_tags)}
							placeholder="可多選"
							disabled
						/>
					</Item> */}
				</div>
				<div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
					<Item
						name={['short_description']}
						label="知識庫簡介"
						className="xl:col-span-2"
					>
						<Input.TextArea rows={8} allowClear />
					</Item>

					<div>
						<Item
							name={['editor']}
							label="模板"
							initialValue={''}
							help={
								watchEditor === 'elementor'
									? '請先儲存之後就可以使用 Elementor 編輯'
									: undefined
							}
						>
							<Radio.Group
								options={[
									{ label: '預設模板', value: '' },
									{
										label: 'Elementor',
										value: 'elementor',
										disabled: !ELEMENTOR_ENABLED,
									},
								]}
								optionType="button"
								buttonStyle="solid"
							/>
						</Item>
						{watchEditor === 'elementor' && (
							<Button
								className="mt-7 w-fit"
								href={`${SITE_URL}/wp-admin/post.php?post=${watchId}&action=elementor`}
								target="_blank"
								rel="noreferrer"
							>
								使用 Elementor 編輯版面
							</Button>
						)}
					</div>

					<div className="mb-8">
						<label className="mb-3 tw-block">知識庫縮圖</label>
						<FileUpload fileList={fileList} setFileList={setFileList} />
					</div>

					<div className="mb-8 xl:col-span-2">
						<label className="mb-3 tw-block">知識庫背景圖</label>
						<FileUpload
							formItemProps={{
								name: ['bg_images'],
							}}
							fileList={bgFileList}
							setFileList={setBgFileList}
							aspect={5}
						/>
						<p className="text-sm text-gray-500">手機版縮放後比例接近正方形</p>
					</div>

					<div>
						<Switch
							formItemProps={{
								name: ['need_access'],
								label: '購買才能觀看',
							}}
							switchProps={{
								checkedChildren: '需授權',
								unCheckedChildren: '免費',
							}}
						/>

						{watchNeedAccess === 'yes' && (
							<Item
								name={['unauthorized_redirect_url']}
								label="當用戶沒有權限觀看時，將用戶導向指定網址"
								tooltip="例如，針對沒有權限的用戶，將用戶導到商品頁面下單購買，訂單完成會自動授權"
							>
								<Input placeholder={`請輸入完整網址，例如 ${SITE_URL}/404`} />
							</Item>
						)}
					</div>

					<KeyWords />
				</div>
			</div>
		</>
	)
}

export const Description = memo(DescriptionComponent)
