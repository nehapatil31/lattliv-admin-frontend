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