import React from 'react'
import useFetchData from '../customeHooks/useFetchData'
import useSWR from 'swr'

function QuantityComment({ slug, isDarkMode }) {
    //SWR
    const swrFetchCountQuantityOfComments = useSWR(`/api/comment/quantity/${slug}`)

    return (
        <small className={isDarkMode ? 'whiteColor' : 'darkColor'}>
            {'     '}
            {swrFetchCountQuantityOfComments?.data || 0} comments
        </small>
    )
}

export default QuantityComment
