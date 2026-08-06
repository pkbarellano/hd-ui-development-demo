import { useState, useEffect } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';

import axios from '../../Axios';
import TextField from '@mui/material/TextField';
import hmacSHA256 from '../../helper/crypto.helper';

const Department = ({ value, margin, error, required, autoFocus, helperText, onChange, disabled }) => {

    const [renderState, setRenderState] = useState(false);

    const [departmentState, setDepartmentState] = useState([]);

    const [progressState, setProgressState] = useState(false);

    const [valueState, setValueState] = useState(value);

    const [timerDelay, setTimerDelay] = useState(null);

    const getDepartmentDelay = search => {

        if (timerDelay) {
            clearTimeout(timerDelay);
            setTimerDelay(null);
        }

        setTimerDelay(
            setTimeout(() => getDepartment(search), 800)
        );
    };

    const getDepartment = search => {

        setProgressState(true);

        const data = {
            search: search
        };

        const headers = {
            'X-HD-Sign': hmacSHA256(data)
        };

        axios({
            url: 'department/read',
            method: 'POST',
            headers: headers,
            data: data
        }).then(response => {

            const data = response.data.data;

            const departments = data.map((el) => {
                return { label: el.departmentName, value: el.id };
            });

            setDepartmentState(departments);

        }).catch(error => {
            console.error(error);
        })
            .finally(() => {
                setProgressState(false);
            });
    }

    useEffect(() => {

        if (renderState === false) {

            getDepartment("");
        }

        return setRenderState(true);
    }, [renderState]);

    useEffect(() => {

        if (valueState !== value) {
            setValueState(value);
        }

    }, [value]);

    return (
        <Autocomplete
            id="department"
            name="department"
            autoHighlight
            options={departmentState}
            onInputChange={(e, v) => getDepartmentDelay(v)}
            isOptionEqualToValue={(option, value) => option.label === value.label}
            getOptionLabel={option => (option) ? option.label : option.label}
            value={valueState}
            disabled={disabled}
            renderInput={params => (
                <TextField
                    margin={margin}
                    error={error}
                    {...params}
                    label="Department"
                    required={required}
                    autoFocus={autoFocus}
                    id='department-options'
                    InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                            <>
                                {progressState ? <CircularProgress size={15} /> : null}
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

export default Department;