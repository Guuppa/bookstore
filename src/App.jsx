import { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community'; 
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import './App.css';

ModuleRegistry.registerModules([AllCommunityModule]);

const PROJECT_ID = "bookstore-27f10-default-rtdb.europe-west1"

function AddBook(props) {
  const [open, setOpen] = useState(false);
  const [book, setBook] = useState({
    title: "",
    author: "",
    year: "",
    isbn: "",
    price: "",
  });

  const handleOpen = () => {
    setOpen(true);
  }

  const handleClose = () => {
    setOpen(false);
  }

  const handleSave = () => {
    props.addBook(book);
    handleClose();
  }

  const inputChanged = (event) => {
    setBook({...book, [event.target.name]: event.target.value});
  }

  return(
    <>
      <Button variant="outlined" onClick={handleOpen}>
        Add book
      </Button>
     <Dialog open={open}>
       <DialogTitle>New book</DialogTitle>
       <DialogContent> 
         <TextField
            name="title"
            value={book.description}
            onChange={inputChanged}
            margin="dense"
            label="Title"
            fullWidth
          /> 
         <TextField
           name="author"
           value={book.date}
           onChange={inputChanged}
           margin="dense"
           label="Author"
           fullWidth
         /> 
         <TextField
           name="year"
           value={book.priority}
           onChange={inputChanged}
           margin="dense"
           label="Year"
           fullWidth
         /> 
         <TextField
           name="isbn"
           value={book.priority}
           onChange={inputChanged}
           margin="dense"
           label="ISBN"
           fullWidth
         /> 
         <TextField
           name="price"
           value={book.priority}
           onChange={inputChanged}
           margin="dense"
           label="Price"
           fullWidth
         /> 
      </DialogContent>
      <DialogActions>
         <Button color="primary" onClick={handleClose}>Cancel</Button>
         <Button color="primary" onClick={handleSave}>Save</Button>
      </DialogActions>
     </Dialog> 
    </>
  );
}

function App() {
  const [books, setBooks] = useState([]);

  const [colDefs, setColDefs] = useState([
    { field: 'title', sortable: true, filter: true },
    { field: 'author', sortable: true, filter: true },
    { field: 'year', sortable: true, filter: true },
    { field: 'isbn', sortable: true, filter: true },
    { field: 'price', sortable: true, filter: true },
    {
      headerName: '',
      field: 'id',
      width: 90,
      cellRenderer: params => 
      <IconButton onClick={() => deleteTodo(params.value)} size="small" color="error">
        <DeleteIcon />
      </IconButton> 
    },
  ]);

  useEffect(() => {
   fetchItems(); 
  },[])

  const fetchItems = () => {
    fetch(`https://${PROJECT_ID}.firebasedatabase.app/books/.json`)
    .then(response => response.json())
    .then(data => addKeys(data)) 
    .catch(err => console.error(err))
  }

 const addBook = (newBook) => {
    fetch(`https://${PROJECT_ID}.firebasedatabase.app/books/.json`,
    {
      method: 'POST',
      body: JSON.stringify(newBook)
    })
    .then(response => fetchItems())
    .catch(err => console.error(err))
  }

  const addKeys = (data) => {
    const keys = Object.keys(data);
    const valueKeys = Object.values(data).map((item, index) => 
    Object.defineProperty(item, 'id', {value: keys[index]}));
    setBooks(valueKeys);
  }

  const deleteTodo = (id) => {
    fetch(`https://${PROJECT_ID}.firebasedatabase.app/books/${id}.json`,
    {
      method: 'DELETE',
    })
    .then(response => fetchItems())
    .catch(err => console.error(err))
  } 
  
  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h5">
            Book Store
          </Typography>
        </Toolbar>
      </AppBar> 
      <AddBook addBook={addBook} />
      <div style={{ height: 500, width: 1100 }}> 
        <AgGridReact 
          rowData={books}
          columnDefs={colDefs}
        />
      </div>
      </>
  );
}

export default App;