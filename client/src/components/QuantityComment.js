import React from 'react';
import useSWR from 'swr';

function QuantityComment({ id, isWhiteMode }) {
    const quantity = useSWR(`/api/question/${id}`);

    return (
        <p className={isWhiteMode === 'false' ? 'whiteColor' : 'darkColor'}>
            {'     '}
            {quantity?.data?.comments?.length || 0} comments
            {'  |'}
        </p>
    );
}

export default QuantityComment;
