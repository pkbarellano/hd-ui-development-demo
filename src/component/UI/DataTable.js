import { useState, useEffect, useRef } from 'react';
import DataTable from 'react-data-table-component';
import CheckBox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import axios from '../../Axios';
import hmacSHA256 from '../../helper/crypto.helper';

const calculateColumnWidth = (string, width) => {

    const stringLen = string.length;

    const minMaxWidth = (width === 'min') ? 5 : 100;

    return Math.max(100, (stringLen + minMaxWidth) * 10) + 'px';
};

const setDefaultColumnProperty = itemObj => {

    return {
        ...itemObj,
        reorder: true,
        wrap: true,
        minWidth: calculateColumnWidth(itemObj.name, 'min'),
        maxWidth: calculateColumnWidth(itemObj.name, 'max')
    };
};

const DataTableUI = ({ addButton, addButtonActionHandler, editButton, editButtonActionHandler, deleteButton, deleteButtonActionHandler, url, method, requestData, columns, setSelectedRows }) => {

    const [isPending, setIsPending] = useState(true);

    const [rows, setRows] = useState([]);

    const [dataColumns, setDataColumns] = useState([]);

    const [rowsPerPage, setRowsPerPage] = useState(2);

    const [currentPage, setCurrentPage] = useState(1);

    const [onSort, setOnSort] = useState(null);

    const [totalRows, setTotalRows] = useState(0);

    const [dataTableFormState, setDataTableFormState] = useState({
        search: {
            onChange: e => inputOnChangeHandler(e),
            id: 'search',
            name: 'search',
            required: false,
            label: 'Search',
            value: '',
            disabled: true,
            fullWidth: false
        }
    });

    const [searchDebouncedValue, setSearchDebouncedValue] = useState(dataTableFormState.search.value);

    const customStyles = {
        header: {
            style: {
                wordWrap: 'break-word'
            }
        },
        headRow: {
            style: {
                backgroundColor: '#90a4ae',
                color: '#263238',
                borderRadius: '6px 6px 0 0',
            },
        },
        headCells: {
            style: {
                fontSize: '.9rem'
            }
        },
        table: {
            style: {
                borderRadius: '6px'
            }
        }
    };

    const inputOnChangeHandler = e => {

        let controlName = e.target.name;
        let controlValue = e.target.value;

        setDataTableFormState(prevState => ({
            ...prevState,
            [controlName]: {
                ...prevState[controlName],
                value: controlValue
            }
        }));
    };

    const sortHandler = (column, direction) => {

        setOnSort({
            column: column.name,
            direction: direction
        });
    };

    const rowsPerPageHandler = (rowsPerPage, page) => {

        setRowsPerPage(rowsPerPage);
        setCurrentPage(page);
    };

    useEffect(() => {

        const setDataColumnsHandler = () => {

            let columnsTmp = [];

            if (columns.length > 0) {

                columnsTmp = columns.map(item => {

                    return setDefaultColumnProperty(item);
                });
            }

            setDataColumns(columnsTmp);
        }

        return setDataColumnsHandler();
    }, [columns]);

    useEffect(() => {

        const getClientList = () => {

            setIsPending(true);

            const data = {
                ...requestData,
                search: searchDebouncedValue,
                page: currentPage - 1,
                rowsPerPage: rowsPerPage,
                sort: onSort
            };

            const headers = {
                'X-HD-Sign': hmacSHA256(data)
            };

            axios({
                url: url,
                method: method,
                headers: headers,
                data: data
            }).then(response => {

                const responseData = response.data;

                setRows(responseData.data);

                setTotalRows(responseData.count);
            }).catch(error => {

                console.error(error);
            }).finally(() => {

                setIsPending(false);
            });
        };

        return getClientList();

    }, [currentPage, onSort, rowsPerPage, searchDebouncedValue]);

    useEffect(() => {

        const enableSearchHandler = () => {

            setDataTableFormState(prevState => ({
                ...prevState,
                search: {
                    ...prevState.search,
                    disabled: isPending
                }
            }));
        };

        return enableSearchHandler();
    }, [isPending]);

    useEffect(() => {

        const timeoutHandler = setTimeout(() => {
            setSearchDebouncedValue(dataTableFormState.search.value);
        }, 800);

        return () => clearTimeout(timeoutHandler);
    }, [dataTableFormState.search.value]);

    return (
        <>
            <Grid container>
                <Grid item xs={12} display="flex" justifyContent="space-between">
                    <Grid item xs={4}>
                        <Stack spacing={1} direction="row">
                            {(addButton) &&
                                <Button
                                    color='primary'
                                    onClick={addButtonActionHandler}
                                    startIcon={<AddIcon
                                    />}
                                >
                                    Add
                                </Button>}
                            {(editButton) &&
                                <Button
                                    color='info'
                                    onClick={editButtonActionHandler}
                                    startIcon={<EditIcon />}
                                >
                                    Update
                                </Button>}
                            {(deleteButton) &&
                                <Button
                                    color='warning'
                                    onClick={deleteButtonActionHandler}
                                    startIcon={<DeleteIcon />}
                                >
                                    Delete
                                </Button>}
                        </Stack>
                    </Grid>
                    <Grid item xs={3} display="flex" justifyContent="flex-end">
                        <TextField
                            {...dataTableFormState.search}
                        />
                    </Grid>
                </Grid>
            </Grid>
            <DataTable
                columns={dataColumns}
                data={rows}
                direction="auto"
                fixedHeaderScrollHeight="600px"
                highlightOnHover
                noContextMenu
                onSort={sortHandler}
                pagination
                onChangePage={setCurrentPage}
                paginationPerPage={rowsPerPage}
                paginationTotalRows={totalRows}
                paginationRowsPerPageOptions={[2, 5, 10, 15, 20]}
                onChangeRowsPerPage={rowsPerPageHandler}
                pointerOnHover
                responsive
                onSelectedRowsChange={setSelectedRows}
                selectableRows
                selectableRowsHighlight
                selectableRowsComponent={CheckBox}
                striped
                customStyles={customStyles}
            />
        </>
    );
};

export default DataTableUI;