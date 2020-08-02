import React from 'react'
import useFetchData from '../customeHooks/useFetchData'
import useSWR from 'swr'

function QuantityComment({ slug, isWhiteMode }) {
    //SWR
    const swrFetchCountQuantityOfComments = useSWR(`/api/comment/quantity/${slug}`)

    return (
        <small className={isWhiteMode === 'false' ? 'whiteColor' : 'darkColor'}>
            {'     '}
            {swrFetchCountQuantityOfComments?.data || 0} comments
        </small>
    )
}

export default QuantityComment
