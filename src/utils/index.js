import { createTheme } from '@mui/material/styles';

export const mandatoryTheam = createTheme({
    components: {
        MuiFormLabel: {
            styleOverrides: {
                asterisk: { color: '#FF2E2E' },
            },
        },
    },
})

export const mandatoryLabel = (label) => {
    return (
      <div className="display-mandatory" style={{display:'flex'}}>
        {label}<p style={{ color: 'red',margin:'0px' }}>**</p>
      </div>
    )
  }