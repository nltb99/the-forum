import React from 'react';
import useSWR from 'swr';
import PropTypes from 'prop-types';

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
QuantityComment.propTypes = {
    id: PropTypes.number.isRequired,
};

export default QuantityComment;
