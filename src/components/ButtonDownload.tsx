import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import { useState } from 'react'
import { downloadFile } from '../utils/downloadFile'
import { API_URL } from '../utils/constants'
import type { ReactNode } from 'react'

const inter = Inter({ subsets: ['latin'] })

export interface ButtonDownloadProps {
    /**
     * Name of the file to be downloaded.
     *
     * @example john-doe.csv
     */
    fileName: string
    /**
     * The number of records to add to the CSV.
     * Default = 1_000_000
     *
     * @example 1000
     */
    records: number
    children?: ReactNode
}

/**
 * A button that downloads a fetched file Blob
 */
export default function ButtonDownload({ fileName, records, children }: ButtonDownloadProps) {
    const [isLoading, setIsLoading] = useState(false)

    const handleDownload = async (fileName = 'export.csv', records = 1000) => {
        setIsLoading(true)

        try {
            const res = await fetch(`${API_URL}?fileName=${fileName}&records=${records}`, {
                method: 'get',
                headers: {
                    'content-type': 'application/csv;charset=UTF-8',
                }
            });

            if (res.status === 200) {
                const data = await res.blob();

                downloadFile(data, fileName)
            } else {
                throw new Error(`Error: ${res.status}`)
            }
        } catch (err) {
            console.log(err)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <button
            className={styles.card}
            onClick={() => handleDownload(fileName, records)}
        >
            <h2 className={inter.className}>
                {isLoading ? 'Generating export...' : 'Fetch download'}
            </h2>
            <p className={inter.className}>
                {children}
            </p>
        </button>
    )
}
