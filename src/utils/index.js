import { createTheme } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';
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

  export const useStyles = makeStyles(theme => ({
    root: {
      boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .1)',
      backgroundColor: 'transparent',
          '& .MuiDataGrid-columnHeaders': {
            background: '#007bff',
            color: '#fff',
            fontWeight: 'bold',
            fontSize: '1.1rem',
            boxShadow: 'none',
          },
          '& .MuiDataGrid-row': {
            '&:nth-of-type(odd)': {
              backgroundColor: "white",
            },
            '&:nth-of-type(even)': {
              backgroundColor: "#D7E9F7",
            },
          }, 
          '& .MuiDataGrid-row:hover': {
            fontWeight: 'bold',
            transition: 'background-color 0.5s ease',
          }
    }
  }));