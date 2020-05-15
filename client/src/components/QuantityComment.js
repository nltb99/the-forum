import React, { useState, useEffect } from 'react'
import axios from 'axios'

function QuantityComment({ slug }) {
    const [quantity, setQuantity] = useState('')

    useEffect(() => {
        fetch(`/api/comment/quantity/${slug}`)
            .then((res) => res.json())
            .then((data) => setQuantity(data))
    }, [])

    return (
        <small>
            {'   '}
            {quantity} comments
        </small>
    )
}

export default QuantityComment
