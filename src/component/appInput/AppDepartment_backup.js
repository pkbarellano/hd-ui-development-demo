import { useState, useEffect } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';

import axios from '../../Axios'
import TextField from '@mui/material/TextField';
import hmacSHA256 from '../../helper/crypto.helper';
import WithErrorHandler from '../../hoc/withErrorHandler/WithErrorHandler';

const Department = ({ value, margin, error, required, autoFocus, helperText, onChange }) => {

    const [renderState, setRenderState] = useState(false);

    const [departmentState, setDepartmentState] = useState([]);

    const [progressState, setProgressState] = useState(false);

    const [valueState, setValueState] = useState("");

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
            data: data,
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

    const onChangeHandler = (e, v) => {

        console.log(v);
    };

    return (
        <Autocomplete
            id="department"
            name="department"
            options={departmentState}
            onInputChange={(e, v) => getDepartment(v)}
            onChange={onChangeHandler}
            isOptionEqualToValue={(option, value) => option.label === value.label}
            getOptionLabel={option => (!option) ? '' : option.label}
            value={valueState}
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
        />
    );
};

export default WithErrorHandler(Department, axios);