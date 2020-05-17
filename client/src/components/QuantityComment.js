import React from 'react'
import useFetchData from '../customeHooks/useFetchData'

function QuantityComment({ slug, isDarkMode }) {
    const quantity = useFetchData(`/api/comment/quantity/${slug}`)

    return (
        <small className={isDarkMode ? 'whiteColor' : 'darkColor'}>
            {'     '}
            {quantity} comments
        </small>
    )
}

export default QuantityComment
