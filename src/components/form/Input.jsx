import React from 'react'
import TextField from '@mui/material/TextField';

export default function Input(props) {

    const { name, label, value,error=null, onChange, required=false, InputProps=null,helperText=null } = props;
    return (
        <TextField
            required={required}
            variant="outlined"
            label={label}
            name={name}
            value={value}
            onChange={onChange}
            InputProps={InputProps}
            helperText={helperText}

            {...(error && {error:true,helperText:error})}
        />
    )
}