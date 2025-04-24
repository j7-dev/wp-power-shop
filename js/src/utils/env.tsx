/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck

import { simpleDecrypt } from 'antd-toolkit'
import { TWoocommerce } from '@/hooks'

const encryptedEnv = window?.power_shop_data?.env
export const env = simpleDecrypt(encryptedEnv)

export const API_URL = env?.API_URL || '/wp-json'
export const APP1_SELECTOR = env?.APP1_SELECTOR || 'power_shop'
export const DEFAULT_IMAGE = 'https://placehold.co/480x480?text=%3CIMG%20/%3E'
