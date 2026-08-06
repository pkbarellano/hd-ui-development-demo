import { useState, useEffect } from 'react';
import AutoComplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';

import axios from '../../Axios';
import TextField from '@mui/material/TextField';

const ClientType = ({ value, margin, error, required, autoFocus, helperText, onChange, disabled }) => {

    const [renderState, setRenderState] = useState(false);

    const [clientTypeState, setClientTypeState] = useState([]);

    const [progressState, setProgressState] = useState(false);

    const [valueState, setValueState] = useState(value);

    useEffect(() => {

        if (renderState === false) {
            getClientType();
        }

        return setRenderState(true);
    }, [renderState]);

    useEffect(() => {

        if (valueState !== value) {
            setValueState(value);
        }
    }, [value]);

    const getClientType = () => {

        setProgressState(true);

        axios({
            url: 'clienttype/read',
            method: 'POST',
        }).then(response => {

            const data = response.data.data;

            const clientTypes = data.map((el) => {
                return { label: el.clientTypeName, value: el.id }
            });

            setClientTypeState(clientTypes);
        }).catch(error => {
            console.error(error);
        }).finally(() => {
            setProgressState(false);
        });
    };

    return (
        <AutoComplete
            id="clientType"
            name="clientType"
            autoHighlight
            options={clientTypeState}
            isOptionEqualToValue={(option, value) => option.label === value.label}
            getOptionLabel={option => (option) ? option.label : option.label}
            value={valueState}
            disabled={disabled}
            renderInput={params => (
                <TextField
                    margin={margin}
                    error={error}
                    {...params}
                    label="Access Type"
                    required={required}
                    autoFocus={autoFocus}
                    id="clientType-options"
                    InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                            <>
                                {progressState ?
                                    <CircularProgress size={15} /> : null}
                                {params.InputProps.endAdornment}
                            </>
                        )
                    }}
                    helperText={helperText}
                />
            )}
            onChange={onChange}
        />
    );
};

export default ClientType;