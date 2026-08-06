import { useState, useEffect } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

const Status = ({ value, margin, error, required, autoFocus, helperText, onChange, disabled }) => {

    const statusOptions = [
        { label: 'Active', value: "A" },
        { label: 'Disabled', value: "D" }
    ];

    const [valueState, setValueState] = useState(value);

    useEffect(() => {

        if (valueState !== value) {
            setValueState(value);
        }
    }, [value]);

    return (
        <Autocomplete
            id='status'
            name='status'
            options={statusOptions}
            isOptionEqualToValue={(option, value) => option.label === value.label}
            getOptionLabel={option => (option) ? option.label : option.label}
            value={valueState}
            disabled={disabled}
            renderInput={params => (
                <TextField
                    margin={margin}
                    error={error}
                    {...params}
                    label='Status'
                    required={required}
                    autoFocus={autoFocus}
                    id='status-options'
                    InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                            <>
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

export default Status;