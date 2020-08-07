import React from 'react';
import useSWR from 'swr';

function QuantityComment({ id }) {
    const quantity = useSWR(`/api/question/${id}`);

    return (
        <p className={'whiteColor'}>
            {'     '}
            {quantity?.data?.comments?.length || 0} comments
            {'  |'}
        </p>
    );
}

export default QuantityComment;
