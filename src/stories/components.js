// import React, { useState } from 'react'
// import { storiesOf } from '@storybook/react'
// import { action } from '@storybook/addon-actions'
// import { linkTo } from '@storybook/addon-links'
// import IconLogo from '../components/IconLogo'
// import Filter from '../components/Filter'
// import {
//   MuiThemeProvider,
//   MuiThemeProvider as Theme,
//   createMuiTheme,
// } from '@material-ui/core/styles'
// import { theme } from '../App'
// import themeNew from '../components/common/theme'
// import Typography from '@material-ui/core/Typography'
// import { withTheme } from '@material-ui/core/styles'
// import FilterModel from '../models/Filter'
// import { ThemeProvider, useTheme } from '@material-ui/styles'
// import Button from '@material-ui/core/Button'
// import Box from '@material-ui/core/Box'
// import TextField from '@material-ui/core/TextField'
// import '../index.css'
// import Paper from '@material-ui/core/Paper'
// import Table from '@material-ui/core/Table'
// import TableBody from '@material-ui/core/TableBody'
// import TableCell from '@material-ui/core/TableCell'
// import TableHead from '@material-ui/core/TableHead'
// import TableRow from '@material-ui/core/TableRow'
// import TableFooter from '@material-ui/core/TableFooter'
// import TablePagination from '@material-ui/core/TablePagination'
// import { makeStyles } from '@material-ui/core/styles'
// import Drawer from '@material-ui/core/Drawer'
// import Menu from '../components/common/Menu'
// import ListItemIcon from '@material-ui/core/ListItemIcon'
// import ListItemText from '@material-ui/core/ListItemText'
// import GSInputLabel from '../components/common/InputLabel'
// import MenuItem from '@material-ui/core/MenuItem'
// import Grid from '@material-ui/core/Grid'
// import IconSettings from '@material-ui/icons/Settings'
// import IconSearch from '@material-ui/icons/Search'
// import InputAdornment from '@material-ui/core/InputAdornment'
// import IconCloudDownload from '@material-ui/icons/CloudDownload'
// import confirm from '../components/common/confirm'
// import alert from '../components/common/alert'
// import notification from '../components/common/notification'
// import Inspector from 'react-inspector'
// import TreeImage from '../components/TreeImage'
// import FilterTop from '../components/FilterTop'
// import Species from '../components/Species'
// import { init } from '@rematch/core'
// import { Provider } from 'react-redux'
// import * as models from '../models'
// import api from '../api/treeTrackerApi'
// import { Planter } from '../components/Planters'
// import { Detail } from '../components/Planters'
// import Home from '../components/Home'

// const store = init({ models })

// storiesOf('Form', module)
//   .add('InputLabel', () => (
//     <ThemeProvider theme={themeNew}>
//       <Box p={4}>
//         <GSInputLabel text="Input Label" />
//       </Box>
//     </ThemeProvider>
//   ))
//   .add('TextField', () => (
//     <ThemeProvider theme={themeNew}>
//       <Box p={4}>
//         <GSInputLabel text="Tree Id" />
//         <TextField placeholder={'e.g. 80'} />
//       </Box>
//     </ThemeProvider>
//   ))
//   .add('Selector', () => (
//     <ThemeProvider theme={themeNew}>
//       <Box p={4}>
//         <GSInputLabel text="Tree Id" />
//         <TextField
//           select
//           value="Planted"
//           placeholder={'e.g. 80'}
//           style={{
//             width: 300,
//           }}
//         >
//           {['All', 'Planted', 'Hole dug', 'Not a tree', 'Blurry'].map((name) => (
//             <MenuItem key={name} value={name}>
//               {name}
//             </MenuItem>
//           ))}
//         </TextField>
//       </Box>
//     </ThemeProvider>
//   ))

// function FilterControl(props) {
//   //{{{
//   const [isOpen, setOpen] = useState(false)

//   const filter = new FilterModel()
//   filter.treeId = 10
//   filter.status = 'Planted'

//   return (
//     <div>
//       <button onClick={() => setOpen(!isOpen)}>open</button>
//       <Filter isOpen={isOpen} filter={filter} onSubmit={(r) => console.warn('do filter:%o', r)} />
//     </div>
//   )
//   //}}}
// }

// storiesOf('Filter', module)
//   .add('Filter', () => (
//     <ThemeProvider theme={themeNew}>
//       <Filter filter={new FilterModel()} isOpen={true} />
//     </ThemeProvider>
//   ))
//   .add('FilterControl', () => (
//     <ThemeProvider theme={themeNew}>
//       <FilterControl />
//     </ThemeProvider>
//   ))

// storiesOf('FilterTop', module).add('FilterTop', () => (
//   <ThemeProvider theme={themeNew}>
//     <FilterTop filter={new FilterModel()} isOpen={true} onSubmit={(e) => console.log(e)} />
//   </ThemeProvider>
// ))

// storiesOf('Menu', module).add('Menu', () => (
//   <ThemeProvider theme={themeNew}>
//     <Menu />
//   </ThemeProvider>
// ))

// const useStyles = makeStyles((theme) => ({
//   root: {
//     width: '100%',
//     marginTop: theme.spacing(3),
//     overflowX: 'auto',
//   },
//   table: {
//     minWidth: 650,
//     width: 724,
//   },
// }))

// function createData(name, calories, fat, carbs, protein) {
//   return { name, calories, fat, carbs, protein }
// }

// const rows = [
//   createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
//   createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
//   createData('Eclair', 262, 16.0, 24, 6.0),
//   createData('Cupcake', 305, 3.7, 67, 4.3),
//   createData('Gingerbread', 356, 16.0, 49, 3.9),
// ]

// export default function SimpleTable() {
//   const classes = useStyles()

//   return (
//     <Table className={classes.table}>
//       <TableHead>
//         <TableRow>
//           <TableCell>Dessert</TableCell>
//           <TableCell align="right">Calories</TableCell>
//           <TableCell align="right">Fat&nbsp;(g)</TableCell>
//           <TableCell align="right">Carbs&nbsp;(g)</TableCell>
//           <TableCell align="right">Protein&nbsp;(g)</TableCell>
//         </TableRow>
//       </TableHead>
//       <TableBody>
//         {rows.map((row) => (
//           <TableRow key={row.name} hover={true}>
//             <TableCell component="th" scope="row">
//               {row.name}
//             </TableCell>
//             <TableCell align="right">{row.calories}</TableCell>
//             <TableCell align="right">{row.fat}</TableCell>
//             <TableCell align="right">{row.carbs}</TableCell>
//             <TableCell align="right">{row.protein}</TableCell>
//           </TableRow>
//         ))}
//       </TableBody>
//       <TableFooter>
//         <TableRow>
//           <TablePagination
//             rowsPerPageOptions={[5, 10, 25]}
//             count={100}
//             rowsPerPage={20}
//             page={1}
//             style={{
//               borderBottom: 'none',
//             }}
//           />
//         </TableRow>
//       </TableFooter>
//     </Table>
//   )
// }

// storiesOf('Table', module).add('Table', () => (
//   <ThemeProvider theme={themeNew}>
//     <SimpleTable />
//   </ThemeProvider>
// ))

// storiesOf('Utilities', module)
//   .add('confirm', () => {
//     function handleClick() {
//       confirm('To delete somthing', 'You can not undo this operation, are you sure?').then(
//         (result) => {
//           if (result) {
//             console.log('user confirmed')
//           } else {
//             console.log('user decliened')
//           }
//         }
//       )
//     }
//     return (
//       <ThemeProvider theme={themeNew}>
//         <h1>confirm box</h1>
//         <p>
//           a easy way to show confirm box, just call:
//           <pre>confirm('your confirm box title', 'your message')</pre>
//         </p>
//         <button onClick={handleClick}>click me</button>
//       </ThemeProvider>
//     )
//   })
//   .add('alert', () => {
//     function handleClick() {
//       alert('This is a title', 'This is some message!').then(() => {
//         console.log('user clicked OK')
//       })
//     }
//     return (
//       <ThemeProvider theme={themeNew}>
//         <h1>alert box</h1>
//         <p>
//           a easy way to show alert box, just call:
//           <pre>alert('your box title', 'your message')</pre>
//         </p>
//         <button onClick={handleClick}>click me</button>
//       </ThemeProvider>
//     )
//   })
//   .add('notification', () => {
//     function handleClick(type) {
//       notification('This is a message from GreenStand admin panel', type, 3000)
//     }

//     return (
//       <ThemeProvider theme={themeNew}>
//         <h1>notification box</h1>
//         <p>
//           a easy way to show notification box, just call:
//           <pre>notification('your box title', message Type, delay)</pre>
//         </p>
//         <button onClick={() => handleClick('info')}>show info message</button>
//         <button onClick={() => handleClick('success')}>show success message</button>
//         <button onClick={() => handleClick('warning')}>show warning message</button>
//         <button onClick={() => handleClick('error')}>show error message</button>
//       </ThemeProvider>
//     )
//   })

// storiesOf('MainFrame', module).add('MainFrame', () => (
//   <ThemeProvider theme={themeNew}>
//     <Grid container wrap="nowrap">
//       <Grid item>
//         <Menu />
//       </Grid>
//       <Grid item>
//         <Box pl={27} pt={11} pr={3}>
//           <Typography variant="h5">2,000 trees</Typography>
//           <Box py={2}>
//             <Grid container justify="space-between" alignItems="center">
//               <Grid item>
//                 <TextField
//                   placeholder="search"
//                   InputProps={{
//                     endAdornment: (
//                       <InputAdornment position="end">
//                         <IconSearch />
//                       </InputAdornment>
//                     ),
//                   }}
//                 />
//               </Grid>
//               <Grid item>
//                 <IconCloudDownload color="action" />
//                 <Box pl={3} clone>
//                   <IconSettings color="action" />
//                 </Box>
//               </Grid>
//             </Grid>
//           </Box>
//           <SimpleTable />
//         </Box>
//       </Grid>
//       <Grid item>
//         <Filter isOpen={true} filter={new FilterModel()} />
//       </Grid>
//     </Grid>
//   </ThemeProvider>
// ))

// function TestTreeImage() {
//   return (
//     <ThemeProvider theme={themeNew}>
//       <Box p={10}>
//         <TreeImage />
//       </Box>
//     </ThemeProvider>
//   )
// }

// function TestTreeImageList() {
//   return (
//     <ThemeProvider theme={themeNew}>
//       <Grid spacing={4} container>
//         {Array.from(new Array(20)).map((e, i) => (
//           <Grid item>
//             <TreeImage />
//           </Grid>
//         ))}
//       </Grid>
//     </ThemeProvider>
//   )
// }

// storiesOf('tree', module)
//   .add('image', () => <TestTreeImage />)
//   .add('imageList', () => <TestTreeImageList />)

// function TestSpecies() {
//   //mock api
//   api.getSpecies = () => {
//     return [
//       {
//         id: 0,
//         name: 'apple',
//       },
//       {
//         id: 1,
//         name: 'pineapple',
//       },
//     ]
//   }

//   const species = [
//     {
//       id: 0,
//       name: 'apple',
//     },
//     {
//       id: 1,
//       name: 'orange',
//     },
//   ]
//   return (
//     <Provider store={store}>
//       <ThemeProvider theme={themeNew}>
//         <Species />
//       </ThemeProvider>
//     </Provider>
//   )
// }

// storiesOf('species', module).add('species', () => <TestSpecies />)

// const planterData = {
//   firstName: 'Dadior',
//   lastName: 'Chen',
// }
// storiesOf('planter', module).add('planterSingle', () => <Planter planter={planterData} />)

// function DetailTest() {
//   const [isShown, setShown] = React.useState(true)
//   const planter = {
//     id: 12345,
//     imageUrl: undefined,
//     firstName: 'Dadior',
//     lastName: 'Chen',
//     email: 'Dadiorchen@outlook.com',
//     phone: '123456789',
//   }

//   return (
//     <ThemeProvider theme={themeNew}>
//       <div>
//         <button onClick={() => setShown(!isShown)}>open</button>
//         <Detail planter={planter} open={isShown} onClose={() => setShown(false)} />
//       </div>
//     </ThemeProvider>
//   )
// }

// storiesOf('planter', module).add('detail', () => <DetailTest />)

// storiesOf('home', module).add('home', () => <Home />)
