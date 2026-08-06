import { useState, useEffect } from 'react';
import {
    Autocomplete,
    CircularProgress,
    TextField
} from '@mui/material';

import axios from '../../Axios';
import hmacSHA256 from '../../helper/crypto.helper';

const Group = ({ value, margin, error, required, autoFocus, helperText, onChange, disabled }) => {

    const session = JSON.parse(localStorage.getItem('HD-Sess'));

    const [renderState, setRenderState] = useState(false);

    const [groupState, setGroupState] = useState([]);

    const [progressState, setProgressState] = useState(false);

    const [valueState, setValueState] = useState(value);

    const [timerDelay, setTimerDelay] = useState(null);

    const getGroup = search => {
        setProgressState(true);

        const data = {
            search: search,
            clientType: session.clientType,
            department: session.department
        };

        const headers = {
            'X-HD-Sign': hmacSHA256(data)
        };

        axios({
            url: 'group/client',
            method: 'POST',
            headers: headers,
            data: data
        }).then(response => {
            const data = response.data.data;

            const groups = data.map(el => {
                return {
                    label: el.groupName,
                    value: el.id
                };
            });

            setGroupState(groups);
        }).catch(error => {
            console.error(error);
        }).finally(() => {
            setProgressState(false);
        });
    };

    const getGroupDelay = (search) => {
        if (timerDelay) {
            clearTimeout(timerDelay);
            setTimerDelay(null);
        }

        setTimerDelay(
            setTimeout(() => getGroup(search), 800)
        );
    };

    useEffect(() => {
        if (renderState === false) {
            getGroup("");
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
            id="group"
            name="group"
            autoHighlight
            options={groupState}
            onInputChange={(e, v) => getGroupDelay(v)}
            isOptionEqualToValue={(option, value) => option.label === value.label}
            getOptionLabel={option => (option) ? option.label : option.label}
            value={valueState}
            disabled={disabled}
            renderInput={params => (
                <TextField
                    margin={margin}
                    error={error}
                    {...params}
                    label="Group"
                    required={required}
                    autoFocus={autoFocus}
                    id="group-options"
                    InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                            <>
                                {progressState ?
                                    <CircularProgress
                                        size={15}
                                    /> : null}
                                {params.InputProps.endAdornment}
                            </>
                        )
                    }}
                    helperText={helperText}
                />
            )}
            onChange={onChange}
        />
    )
};

export default Group;