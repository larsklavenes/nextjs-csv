import type { NextApiRequest, NextApiResponse } from 'next'
import { pipeline, Readable } from 'stream'
import {
	first_name,
	last_name,
	phone,
	country,
	city,
	street,
	address,
	address1,
	address2,
	state,
	state_abbr,
	latitude,
	longitude,
	building_number,
	description,
	url,
	email,
} from 'casual'

export type CSVApiQueries = {
	/**
	 * Name of the file to be downloaded.
	 *
	 * @example john-doe.csv
	 */
	fileName?: string
	/**
	 * The number of records to add to the CSV.
	 * Default = 1_000_000
	 *
	 * @example 1000
	 */
	records?: number
}

export interface CSVApiRequest extends Omit<NextApiRequest, 'query'> {
	query: CSVApiQueries
}

/**
 * Returns a CSV file that can be downloaded.
 *
 * Accepts optional parameters:
 * - `fileName` for the file name and
 * - `records` for the number of records to generate.
 *
 * @param req
 * @param res
 * @method GET
 *
 * @example /api/csv?fileName=export.csv&entries=1000
 */
export default async function handler(
	req: CSVApiRequest,
	res: NextApiResponse
): Promise<void> {
	try {
		const { fileName = 'data.csv', records = 1_000_000 } = req?.query

		res.setHeader('Content-Type', 'application/csv')
		res.setHeader('Content-Disposition', `attachment; filename=${fileName}`)
		res.status(200)

		let csvAsString =
			'ID,Name,Phone,Country,City,Street,Address,Address1,Address2,State,State Abbr,Lat,Lng,Building Number,Description,URL,Email\n'

		for (let i = 1; i <= records; i++) {
			/**
			 * @note wrap strings with comma (,) in double quotes ("") to escape
			 */
			csvAsString += `${i},${first_name} ${last_name},${phone},${country},${city},"${street}","${address}","${address1}","${address2}",${state},${state_abbr},${latitude},${longitude},${building_number},${description},${url},${email}\n`
		}

		const fileStream = Readable.from(Buffer.from(csvAsString, 'utf8'))

		pipeline(fileStream, res, error => {
			if (error) {
				throw new Error(error.toString())
			}
		})
	} catch (e) {
		res.status(500)
		res.end()
	}
}
