import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#003636',
      paper: '#004b49',
    },
    text: {
      primary: '#ffffff',
      secondary: '#f0f0f0'
    },
    primary: {
      main: '#00a86b',
      dark: '#008756',
    },
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          '& label': {
            color: '#ffffff',
          },
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: '#ffffff',
            },
          },
        },
      },
    },
  },
});

export default theme;
