import React from 'react';
import { useTheme, useMediaQuery } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import {
    Paper
} from '@mui/material';

const calculateColumnWidth = (field, rows) => {

    const maxLength = Math.max(
        ...rows.map(row => String(row[field]).length),
        field.length
    );

    return maxLength * 20;
};

const DataGridUI = ({ rows, columns, paginationModel, setPaginationModel, setSortModel, setFilterModel, totalRows, handleSelectionChange }) => {

    const theme = useTheme();
    const isXs = useMediaQuery(theme.breakpoints.down('xs'));

    const dynamicColumns = () => {

        return columns.map(col => ({
            ...col,
            width: isXs ? 100 : undefined
        }));
    };

    return (
        <Paper
            sx={{
                height: '100%',
                width: '100%',
                overflow: 'hidden'
            }}
        >
            <div
                style={{
                    height: '600',
                    width: '100%'
                }}
            >
                <DataGrid
                    autoHeight
                    style={{
                        width: '100%',
                        minWidth: 600
                    }}
                    rows={rows}
                    columns={dynamicColumns()}
                    pagination
                    onPaginationModelChange={setPaginationModel}
                    onSortModelChange={setSortModel}
                    onFilterModelChange={(newModel) => setFilterModel(newModel)}
                    checkboxSelection
                    pageSizeOptions={[5, 10]}
                    initialState={{ pagination: { paginationModel } }}
                    rowCount={totalRows}
                    onRowSelectionModelChange={newSelection => handleSelectionChange(newSelection)}
                />
            </div>
        </Paper>
    );
};

export default DataGridUI;
