// PaginationComponent.js
import React from 'react';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';

function PaginationComponent({ totalPages, currentPage, onChangePage }) {
    return (
        <Stack spacing={2} alignItems="center" style={{ marginTop: '20px' }}>
            <Pagination
                count={totalPages}
                page={currentPage}
                onChange={onChangePage}
                color="primary"
            />
        </Stack>
    );
}

export default PaginationComponent;
