import { useEffect, useState } from 'react'
import axios from 'axios'

function useFetchData(url) {
    const [data, setData] = useState()

    useEffect(() => {
        async function fetchData() {
            const data = await axios.get(url)
            setData(data.data)
        }
        fetchData()
    }, [url, data])
    return data
}

export default useFetchData
