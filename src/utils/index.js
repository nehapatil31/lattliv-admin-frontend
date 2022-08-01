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
      "& .MuiDataGrid-renderingZone": {
        maxHeight: "none !important"
      },
      "& .MuiDataGrid-cell": {
        lineHeight: "unset !important",
        maxHeight: "none !important",
        whiteSpace: "normal"
      },
      "& .MuiDataGrid-row": {
        maxHeight: "none !important"
      },
      boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .1)',
      backgroundColor: 'transparent',
          '& .MuiDataGrid-columnHeaders': {
            background: '#007bff',
            color: '#fff',
            fontSize: '1.1rem',
            boxShadow: 'none',
          },
          '& .MuiDataGrid-columnHeaderTitle': {
            fontWeight: 800,
            color: '#fff',
          },
          '& .MuiDataGrid-row': {
            fontSize: '1rem',
            '&:nth-of-type(odd)': {
              backgroundColor: "white",
            },
            '&:nth-of-type(even)': {
              backgroundColor: "#D7E9F7",
            },
          }, 
          '& .MuiDataGrid-row:hover': {
            //gray color 
            backgroundColor: '#DCDCDC	',
            transition: 'background-color 0.5s ease',
          },
          '& .MuiDataGrid-columnSeparator': {
            display: 'none !important',
          },
    }
  }));

  export function validURL(str) {
    var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
      '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
    return !!pattern.test(str);
  }