import { useState, useEffect } from 'react';

const useStorageState = (key, initialState) => {
  const [value, setValue] = useState(localStorage.getItem(key) ?? initialState);

  useEffect(() => {
    localStorage.setItem(key, value);
  }, [value, key]);

  return [value, setValue];
};

const App = () => {
  const stories = [
    {
      title: 'React',
      url: 'https://react.dev/',
      author: 'Jordan Walke',
      num_comments: 3,
      points: 4,
      objectID: 0,
    },
    {
      title: 'Redux',
      url: 'https://redux.js.org/',
      author: 'Dan Abramov, Andrew Clark',
      num_comments: 2,
      points: 5,
      objectID: 1,
    },
  ];

  const [searchTerm, setSearchTerm] = useStorageState('search', 'React');

  const format = (text) => text.toLowerCase();

  // A
  const handleSearch = (event) => {
    // D
    setSearchTerm(event.target.value);
  };

  const searchedStories = stories.filter((story) =>
    //* Esto funciona correctamente mostrando todos los resultados si la cadena es vacía porque un "string",vacío o no, siempre incluye el caracter vacío ("").
    format(story.title).includes(format(searchTerm))
  );

  return (
    <>
      <h1>My Hacker Stories</h1>

      {/* // B */}
      <InputWithLabel
        id="search"
        type="text"
        label="Search:"
        value={searchTerm}
        onInputChange={handleSearch}
      />

      <hr />

      <List list={searchedStories} />

      <hr />

      <Button
        type="button"
        disabled={false}
        name="boton 1"
        value="1"
        onClick={() => console.log('Button clicked')}
      >
        Button
      </Button>

      <hr />
      
      
      <Checkbox
        label="My value"
        value={true}
        onChange={() => console.log('Checkbox clicked')}
      ></Checkbox>
    </>
  );
};

const InputWithLabel = ({ id, label, type = 'text', value, onInputChange }) => {
  return (
    <>
      <label htmlFor={id}>{label}</label>
      &nbsp;
      <input id={id} type={type} value={value} onChange={onInputChange} />
    </>
  );
};

const List = ({ list }) => {
  return (
    <ul>
      {list.map(({ objectID, ...item }) => (
        <Item key={objectID} {...item} />
      ))}
    </ul>
  );
};

const Item = ({ url, title, author, num_comments, points }) => {
  return (
    <li>
      <span>
        <a href={url}>{title}</a> |
      </span>
      <span>{author} | </span>
      <span>{num_comments} | </span>
      <span>{points} | </span>
    </li>
  );
};

const Button = ({ type = 'button', onClick, children, ...rest }) => {
  return (
    <button type={type} onClick={onClick} {...rest}>
      {children}
    </button>
  );
};

// TODO: terminar de coidifcar los componentes del ejercicio del último capítulo. 
const Checkbox = ({ label, value, onChange }) => {
  return (
    <label>
      {label}
      &nbsp;
      <input type="checkbox" checked={value} onChange={onChange}></input>
    </label>
  );
};

export default App;
