import { useState, useEffect } from 'react';
import {
    Card,
    CardContent,
    Stack,
    Box
} from '@mui/material';
import { teal, deepOrange, cyan } from '@mui/material/colors';

import DataTableUI from '../../../component/UI/DataTable';
import ComponentHeader from '../../../component/UI/ComponentHeader';
import ClientForm from './client/ClientForm';

export const Client = () => {

    const [requestData, setRequestData] = useState({});

    const [renderDataTable, setRenderDataTable] = useState(false);

    const [selectedRows, setSelectedRows] = useState(null);

    const [clientFormModalState, setClientFormModalState] = useState(false);

    const [clientFormTypeState, setClientFormTypeState] = useState('');

    const columns = [
        {
            name: 'FIRSTNAME',
            selector: row => row.firstName,
            sortable: true,
        },
        {
            name: 'MIDDLENAME',
            selector: row => row.middleName,
            sortable: true,
        },
        {
            name: 'LASTNAME',
            selector: row => row.lastName,
            sortable: true,
        },
        {
            name: 'USERNAME',
            selector: row => row.username,
            sortable: true,
        },
        {
            name: 'EMAIL',
            selector: row => row.email,
            sortable: true,
            cell: row => (
                <Box sx={{
                    color: teal[600]
                }}>
                    {row.email}
                </Box>
            )
        },
        {
            name: 'DEPARTMENT',
            selector: row => row.department,
            sortable: true,
        },
        {
            name: 'GROUP',
            selector: row => row.group,
            sortable: true,
        },
        {
            name: 'STATUS',
            selector: row => row.status,
            sortable: true,
            cell: row => (
                <Box
                    sx={{
                        padding: 1,
                        backgroundColor: (row.status === 'Active') ? cyan[600] : deepOrange[600],
                        textAlign: 'center',
                        borderRadius: '6px',
                        color: 'white'
                    }}
                >
                    {row.status}
                </Box>
            )
        },
        {
            name: 'CREATE DATE',
            selector: row => row.createdAt,
            sortable: true,
        },
        {
            name: 'LAST UPDATE DATE',
            selector: row => row.updatedAt,
            sortable: true,
        },
        {
            name: 'DISABLE DATE',
            selector: row => row.deletedAt,
            sortable: true
        }
    ];

    const addItemHandler = async () => {

        setClientFormTypeState('add');
        setClientFormModalState(true);
    };

    const updateItemHandler = async () => {

        setClientFormTypeState('update');
        setClientFormModalState(true);
    };

    const deleteItemHandler = () => {

        console.log("Delete Item");
    };

    const setSelectedRowsHandler = state => {

        console.log(state.selectedRows);
    };

    useEffect(() => {

        const getClientDataHandler = () => {

            const session = JSON.parse(localStorage.getItem('HD-Sess'));

            setRequestData({
                sessionKey: session.sessionKey,
                clientType: session.clientType,
                department: session.department
            });

            setRenderDataTable(true);
        };

        return getClientDataHandler();

    }, []);

    useEffect(() => console.log(selectedRows), [selectedRows]);

    return (
        <div>
            <Card>
                <ComponentHeader />
                <CardContent>
                    <Stack spacing={1}>
                        <Stack spacing={1} direction='row'>
                        </Stack>
                        {
                            renderDataTable && (<DataTableUI
                                addButton={true}
                                addButtonActionHandler={addItemHandler}
                                addActionUrl=''
                                editButton={true}
                                editButtonActionHandler={updateItemHandler}
                                editActionUrl=''
                                deleteButton={true}
                                deleteButtonActionHandler={deleteItemHandler}
                                deleteActionUrl=''
                                url='user/read'
                                method='POST'
                                requestData={requestData}
                                columns={columns}
                                setSelectedRows={setSelectedRows}
                            />)
                        }
                    </Stack>
                </CardContent>
            </Card>
            <ClientForm
                formType={clientFormTypeState}
                clientFormModalState={clientFormModalState}
                setClientFormModalState={setClientFormModalState}
                selectedRow={(clientFormTypeState === 'update') ? selectedRows : null}
            />
        </div>
    );
};