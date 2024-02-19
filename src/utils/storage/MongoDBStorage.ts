import { HttpHelper } from '@/utils/HttpHelper'

export const MongoDBStorage = () => {
	const baseUrl = '/api/'
	const httpHelper = HttpHelper()

	const readRecord = async (table: string, column: string, value: string) => {
		const url = baseUrl + table

		const body = {
			column: column,
			value: value,
		}
		try {
			return await httpHelper.post(url, { body: body })
		} catch (err) {
			return console.log(err)
		}
	}

	const createRecord = async (table: string, data: any, column?: string, value?: string) => {
		const url = baseUrl + table
		const body = {
			column: column,
			value: value,
			data: data,
		}
		try {
			return await httpHelper.post(url, { body: body })
		} catch (err) {
			return console.log(err)
		}
	}

	const updateRecord = async (table: string, data: any, column?: string, value?: string) => {
		const url = baseUrl + table
		const body = {
			column: column,
			value: value,
			data: data,
		}
		try {
			return await httpHelper.put(url, { body: body })
		} catch (err) {
			return console.log(err)
		}
	}

	const deleteRecord = async (table: string, column: string, value: string) => {
		const url = baseUrl + table
		const body = {
			column: column,
			value: value,
			data: {},
		}
		try {
			return await httpHelper.put(url, { body: body })
		} catch (err) {
			return console.log(err)
		}
	}

	return {
		createRecord,
		readRecord,
		updateRecord,
		deleteRecord,
	}
}
