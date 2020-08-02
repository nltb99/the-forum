import React from 'react'
import useSWR from 'swr'

function QuantityComment({ slug, isWhiteMode }) {
    const quantityOfComments = useSWR(`/api/comment/quantity/${slug}`)

    return (
        <small className={isWhiteMode === 'false' ? 'whiteColor' : 'darkColor'}>
            {'     '}
            {quantityOfComments?.data || 0} comments
        </small>
    )
}

export default QuantityComment
