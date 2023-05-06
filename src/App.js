import React, { useState } from 'react';
import axios from 'axios';
import './styles.css';

var data = { "items": [] }

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');

  const sortList = (criterion) => {
    console.log("data.items: ", data.items);
    if (data.items && data.items.length > 0){
      const sortedList = [...data.items].sort((a, b) => {
        let aux1 = a.volumeInfo.authors ? a.volumeInfo.authors[0] : "";
        let aux2 = b.volumeInfo.authors ? b.volumeInfo.authors[0] : "";
        let crit1 = criterion === 0 ? a.volumeInfo.title : aux1;
        let crit2 = criterion === 0 ? b.volumeInfo.title : aux2;
        if (crit1 < crit2) { return -1; }
        if (crit1 > crit2) { return  1; }
        return 0;
      });
      console.log(sortedList);
      setItems(sortedList);

      //Guardado en alamcenamiento local
      localStorage.setItem('Último criterio', criterion === 0 ? "Título" : "Autor")
    }
  };

  const handleSearch = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.get('https://www.googleapis.com/books/v1/volumes', { params: { q: searchTerm }});
      data = response.data;

      if (data && data.items) {
        setItems(data.items);
        setError('');
      } 
      else {
        setItems([]);
        setError('No se encontraron resultados.');
      }
    } 
    catch (error) {
      console.error(error);
      setItems([]);
      setError('Ocurrió un error al realizar la búsqueda.');
    }    
    
    //Guardado en alamcenamiento local
    localStorage.setItem('Última Búsqueda', searchTerm)
  };

  return (
    <div>
      <h1>Buscador de Libros</h1>

      <form onSubmit={handleSearch}>
        <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Introduce el nombre del libro" />
        <button type="submit">Buscar</button>        
      </form>
      {error && <p>{error}</p>}
      <div class="btnDiv">
        <button class="FilterBtn" onClick={() => sortList(0)}>Ordenar por título</button>
        <button class="FilterBtn" onClick={() => sortList(1)}>Ordenar por autor</button>
      </div>
      <div class="booksDiv">
        {items.map((book) => (
          <div class='book' key={book.id}>
            <img src={book.volumeInfo.imageLinks?.thumbnail} alt="Portada del libro" />
            <h3>{book.volumeInfo.title}</h3>
            
            <p>Autores: {book.volumeInfo.authors ? book.volumeInfo.authors.join(', ') : 'Autor desconocido'}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;