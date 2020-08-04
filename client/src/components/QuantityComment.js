import React from 'react';
import useSWR from 'swr';

function QuantityComment({ id, isWhiteMode }) {
    const quantity = useSWR(`/api/question/${id}`);

    return (
        <small className={isWhiteMode === 'false' ? 'whiteColor' : 'darkColor'}>
            {'     '}
            {quantity?.data?.comments.length || 0} comments
        </small>
    );
}

export default QuantityComment;
