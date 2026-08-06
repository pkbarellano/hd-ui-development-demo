import * as React from 'react';
import { Outlet } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import axios from './Axios';
import WithErrorHandler from './hoc/withErrorHandler/WithErrorHandler';

const myTheme = createTheme({
  palette: {
    mode: "light",
    // common: {
    //   black: '#000',
    //   white: '#fff'
    // },
    // primary: {
    //   main: '#90caf9',
    //   light: '#e3f2fd',
    //   dark: '#42a5f5',
    //   contrastText: 'rgba(0, 0, 0, 0.87)'
    // },
    // secondary: {
    //   main: '#ce93d8',
    //   light: '#f3e5f5',
    //   dark: '#ab47bc',
    //   contrastText: 'rgba(0, 0, 0, 0.87)'
    // },
    // error: {
    //   main: '#f44336',
    //   light: '#e57373',
    //   dark: '#d32f2f',
    //   contrastText: '#fff'
    // },
    // warning: {
    //   main: '#ffa726',
    //   light: '#ffb74d',
    //   dark: '#ffb74d',
    //   contrastText: 'rgba(0, 0, 0, 0.87)'
    // },
    // info: {
    //   main: '#29b6f6',
    //   light: '#4fc3f7',
    //   dark: '#0288d1',
    //   contrastText: 'rgba(0, 0, 0, 0.87)'
    // },
    // success: {
    //   main: '#66bb6a',
    //   light: '#81c784',
    //   dark: '#388e3c',
    //   contrastText: 'rgba(0, 0, 0, 0.87)'
    // },
    contrastThreshold: 3,
    tonalOffset: 0.2
  },
  shape: {
    borderRadius: 6
  },
  typography: {
    fontFamily: '""Rob  oto", "Helvetica", "Arial", sans-serif"',
  },
  paperRoot: {
    backgroundColor: '#424242'
  },
  components: {
    MuiButton: {
      defaultProps: {
        size: "small",
        fullWidth: false,
        variant: "contained"
      },
      styleOverrides: {
        root: {
          boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.4)',
          '&:hover': {
            boxShadow: '0px 6px 10px rgba(0, 0, 0, 0.7)',
          },
        }
      }
    },
    MuiLoadingButton: {
      styleOverrides: {
        root: {
          boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.4)',
          '&:hover': {
            boxShadow: '0px 6px 10px rgba(0, 0, 0, 0.7)',
          },
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        size: "small",
        fullWidth: true,
        autoCapitalize: 'none'
      }
    },
    MuiIconButton: {
      defaultProps: {
        size: "small",
        color: "inherit"
      }
    },
    MuiLink: {
      defaultProps: {
        color: "inherit",
        underline: "none"
      }
    },
    MuiAppBar: {
      defaultProps: {
        position: "fixed",
        color: "inherit",
        elevation: 4
      }
    },
    MuiCard: {
      defaultProps: {
        elevation: 8
      },
    },
    MuiDrawer: {
      defaultProps: {
        variant: "permanent",
        sx: {
          width: 240,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: 240, boxSizing: 'border-box' },
        },
        PaperProps: {
          elevation: 8
        }
      }
    },
    MuiAutocomplete: {
      defaultProps: {
        disablePortal: true,
        size: "small",
        fullWidth: true
      }
    },
    MuiCircularProgress: {
      defaultProps: {
        color: "inherit",
        size: 15
      }
    },
    MuiCardHeader: {
      styleOverrides: {
        root: {
          backgroundColor: '#1a237e',
          color: '#e8eaf6'
        }
      }
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          '&.Mui-selected': {
            backgroundColor: '#78909c',
            color: '#e3f2fd',
            '&:hover': {
              backgroundColor: '#b0bec5',
              color: 'black'
            },
            '& .MuiListItemIcon-root': {
              color: '#e3f2fd'
            }
          },
          '&:hover': {
            backgroundColor: '#b0bec5',
            color: 'black'
          }
        }
      }
    },
    MuiDataGrid: {
      styleOverrides: {
        columnHeaderTitle: {
          fontWeight: 'bold'
        },
        columnHeaderInput: {
          '& .MuiInputBase-input': {
            size: 'small'
          }
        }
      }
    }
  }
});

function App() {
  return (
    <ThemeProvider theme={myTheme}>
      <CssBaseline />
      <Outlet />
    </ThemeProvider>
  );
}

export default WithErrorHandler(App, axios);
