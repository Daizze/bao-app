const { MongoClient, ServerApiVersion } = require('mongodb')

export default async function handler(req, res) {
	try {
		const client = new MongoClient(process.env.MONGODB_URI, {
			serverApi: {
				version: ServerApiVersion.v1,
				strict: true,
				deprecationErrors: true,
			},
		})

		const body = req.body
		const column = body.column
		const value = body.value
		let data = {}

		if (body.hasOwnProperty('data')) {
			data = body.data
		}

		const db = client.db(process.env.MONGODB_DATABASE)
		const collection = db.collection('ballast')
		const query = { [column]: value }

		if (req.method === 'POST' && Object.keys(data).length === 0) {
			const result = await collection.findOne(query)

			if (result.hasOwnProperty(column)) {
				res.status(200).json(result)
			} else {
				res.status(200).json('{}')
			}
		} else if ((req.method === 'POST' || req.method === 'PUT') && Object.keys(data).length !== 0) {
			const options = { upsert: true }
			const updateDoc = {
				$set: data,
			}

			const result = await collection.updateOne(query, updateDoc, options)

			if (result.hasOwnProperty('matchedCount')) {
				res.status(200).json({ result: 'true' })
			} else {
				res.status(200).json({ result: 'false' })
			}
		} else if (req.method === 'PUT' && Object.keys(data).length === 0) {
			const result = await collection.deleteOne(query)

			if (result.hasOwnProperty('deletedCount')) {
				res.status(200).json({ result: 'true' })
			} else {
				res.status(200).json({ result: 'false' })
			}
		}
	} catch (err) {
		res.status(500).json({ result: 'false' })
	}
}
