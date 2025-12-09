import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import App from './App.tsx';
import { Item, List } from './components/List.tsx';
import SearchForm from './components/SearchForm.tsx';
import InputWithLabel from './components/InputWithLabel.tsx';
import { storiesReducer } from './reducers/storiesReducer.ts';

// Hay que mapear para ciertos tests las 'stories' ya que se mapean los datos después de hacer la petición de los datos a la api.Entonces hay una data sin mapear, y otra data mapeada.
// Para representar la respuesta que da la peticion se usan los datos sin mapear.
// Para los componentes que ya usan los datos se usa la data mapeada.

// Data sin mapear
const storyOne = {
  title: 'React',
  url: 'https://react.dev/',
  author: 'Jordan Walke',
  num_comments: 3,
  points: 4,
  objectID: 0,
};

const storyTwo = {
  title: 'Redux',
  url: 'https://redux.js.org/',
  author: 'Dan Abramov, Andrew Clark',
  num_comments: 2,
  points: 5,
  objectID: 1,
};

// Data mapeada
const storyOneMapped = {
  title: 'React',
  url: 'https://react.dev/',
  author: 'Jordan Walke',
  numComments: 3,
  points: 4,
  objectId: 0,
};

const storyTwoMapped = {
  title: 'Redux',
  url: 'https://redux.js.org/',
  author: 'Dan Abramov, Andrew Clark',
  numComments: 2,
  points: 5,
  objectId: 1,
};

const stories = [storyOne, storyTwo];
const mappedStories = [storyOneMapped, storyTwoMapped];

describe('storiesReducer', () => {
  it('init fetch stories', () => {
    const action = { type: 'STORIES_FETCH_INIT' };
    const state = { data: mappedStories, isLoading: false, isError: false };
    const newState = storiesReducer(state, action);
    const expectedState = {
      data: mappedStories,
      isLoading: true,
      isError: false,
    };

    expect(newState).toStrictEqual(expectedState);
  });

  it('get data fetch', () => {
    const action = { type: 'STORIES_FETCH_SUCCESS', payload: mappedStories };
    const state = { data: [], isLoading: false, isError: false };
    const newState = storiesReducer(state, action);
    const expectedState = {
      data: mappedStories,
      isLoading: false,
      isError: false,
    };

    expect(newState).toStrictEqual(expectedState);
  });

  it('failuter data fetch', () => {
    const action = { type: 'STORIES_FETCH_FAILURE' };
    const state = { data: mappedStories, isLoading: false, isError: false };
    const newState = storiesReducer(state, action);
    const expectedState = {
      data: mappedStories,
      isLoading: false,
      isError: true,
    };

    expect(newState).toStrictEqual(expectedState);
  });

  it('removes a story from all stories', () => {
    const action = { type: 'REMOVE_STORY', payload: storyOneMapped };
    const state = { data: mappedStories, isLoading: false, isError: false };
    const newState = storiesReducer(state, action);
    const expectedState = {
      data: [storyTwoMapped],
      isLoading: false,
      isError: false,
    };

    expect(newState).toStrictEqual(expectedState);
  });
});

describe('Item', () => {
  it('renders all properties', () => {
    render(<Item item={storyOne} />);

    expect(screen.getByText('Jordan Walke')).toBeInTheDocument();
    expect(screen.getByText('React')).toHaveAttribute(
      'href',
      'https://react.dev/',
    );

    // screen.debug();
  });

  it('renders a clickeable dismiss button', () => {
    render(<Item item={storyOne} />);

    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('clicking the dismiss button calls the callback handler', () => {
    const handleRemoveItem = vi.fn();

    render(<Item item={storyOne} onRemoveItem={handleRemoveItem} />);

    fireEvent.click(screen.getByRole('button'));

    expect(handleRemoveItem).toHaveBeenCalledTimes(1);
    expect(handleRemoveItem).toHaveBeenCalledWith(storyOne);
  });

  it('renders snapshot', () => {
    const { container } = render(
      <Item item={storyOne} onRemoveItem={() => {}} />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});

describe('SearchForm', () => {
  const searchFormProps = {
    search: 'React',
    onSearchInput: vi.fn(),
    searchAction: vi.fn(),
  };

  it('renders the input field with its value', () => {
    render(<SearchForm {...searchFormProps} />);
    // screen.debug();
    expect(screen.getByDisplayValue('React')).toBeInTheDocument();
  });

  it('renders de correct label', () => {
    render(<SearchForm {...searchFormProps} />);

    expect(screen.getByLabelText(/Search/)).toBeInTheDocument();
  });

  it('calls onSearchInput on input fields change', () => {
    render(<SearchForm {...searchFormProps} />);

    fireEvent.change(screen.getByDisplayValue('React'), {
      target: { value: 'Redux' },
    });

    expect(searchFormProps.onSearchInput).toHaveBeenCalledTimes(1);
  });

  it('calls searchAction on button submit click', () => {
    render(<SearchForm {...searchFormProps} />);

    fireEvent.click(screen.getByRole('button'));

    expect(searchFormProps.searchAction).toHaveBeenCalledTimes(1);
  });

  it('renders snapshot', () => {
    const { container } = render(<SearchForm {...searchFormProps} />);
    expect(container.firstChild).toMatchSnapshot();
  });
});

describe('List', () => {
  // 2 test, uno para evaluar que se hayan renderizado cierta cantidad de elementos como elementos tiene la lista base y otro para evaluar si se renderiza el <NoResults> si la lista no tiene elementos
  it('renders all items from list property', () => {
    render(<List list={mappedStories} />);

    expect(screen.getAllByRole('listitem')).toHaveLength(2);
  });

  it('renders no results', () => {
    render(<List list={[]} />);

    expect(screen.getByText(/No news was found for this search/));
  });

  it('renders snapshot', () => {
    const { container } = render(<List list={mappedStories} />);
    expect(container.firstChild).toMatchSnapshot();
  });
});

describe('InputWithLabel', () => {
  const inputWithLabelProps = {
    id: 0,
    type: 'text',
    value: 'React',
    placeholder: 'React, Angular...',
    onInputChange: vi.fn(),
    children: 'Search:',
  };

  it('calls onInputChange on input fields change', () => {
    render(<InputWithLabel {...inputWithLabelProps} />);

    fireEvent.change(screen.getByRole('textbox'), {
      target: { value: 'Redux' },
    });

    expect(inputWithLabelProps.onInputChange).toHaveBeenCalledTimes(1);
  });

  it('renders correct input value', () => {
    render(<InputWithLabel {...inputWithLabelProps} />);

    expect(screen.getByDisplayValue('React')).toBeInTheDocument();
  });

  it('render label', () => {
    render(<InputWithLabel {...inputWithLabelProps} />);

    expect(screen.getByLabelText(/Search/)).toBeInTheDocument();
  });

  it('no render label', () => {
    const { container } = render(<InputWithLabel children={undefined} />);

    expect(container.querySelector('label')).toBeNull();
  });

  it('renders snapshot', () => {
    const { container } = render(<InputWithLabel {...inputWithLabelProps} />);
    expect(container.firstChild).toMatchSnapshot();
  });
});

//* Para las peticiones de datos hay que usar la data sin mapear ya que es la representación de los datos que se obtionen de la petición de base, ya que la App después se encarga de mapear estos datos.
vi.mock('axios');

describe('App', () => {
  // Mockear localStorage ya que App lo usa
  beforeEach(() => {
    vi.stubGlobal('localStorage', {
      getItem: vi.fn(),
      setItem: vi.fn(),
    });
  });

  it('succeeds fetching data', async () => {
    const promise = Promise.resolve({
      data: {
        hits: stories,
      },
    });

    axios.get.mockImplementationOnce(() => promise);

    render(<App />);

    expect(screen.queryByAltText(/Loading/)).toBeInTheDocument();

    await waitFor(async () => await promise);

    expect(screen.queryByAltText(/Loading/)).toBeNull();

    // Confirmar los datos obtenidos
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('Redux')).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /Remove item/ }).length).toBe(
      2,
    );
  });

  it('fails fetching data', async () => {
    const promise = Promise.reject();

    axios.get.mockImplementationOnce(() => promise);

    render(<App />);

    expect(screen.queryByAltText(/Loading/)).toBeInTheDocument();

    try {
      await waitFor(async () => await promise);
    } catch (err) {
      expect(screen.queryByAltText(/Loading/)).toBeNull();
      expect(screen.queryByText(/went wrong/)).toBeInTheDocument();
    }
  });

  it('removes a story', async () => {
    const promise = Promise.resolve({
      data: {
        hits: stories,
      },
    });
    axios.get.mockImplementationOnce(() => promise);
    render(<App />);

    await waitFor(async () => await promise);

    expect(screen.getAllByRole('button', { name: /Remove item/ }).length).toBe(
      2,
    );
    expect(screen.getByText('Jordan Walke')).toBeInTheDocument();

    // Eliminar el primer item
    fireEvent.click(screen.getAllByRole('button', { name: /Remove item/ })[0]);

    expect(screen.getAllByRole('button', { name: /Remove item/ }).length).toBe(
      1,
    );
    expect(screen.queryByText('Jordan Walke')).toBeNull();
  });

  it('searches for specific stories', async () => {
    const reactPromise = Promise.resolve({
      data: {
        hits: stories,
      },
    });

    const anotherStory = {
      title: 'JavaScript',
      url: 'https://en.wikipedia.org/wiki/JavaScript',
      author: 'Brendan Eich',
      num_comments: 15,
      points: 10,
      objectID: 3,
    };

    const javascriptPromise = Promise.resolve({
      data: {
        hits: [anotherStory],
      },
    });

    axios.get.mockImplementation((url) => {
      if (url.includes('React')) {
        return reactPromise;
      }
      if (url.includes('JavaScript')) {
        return javascriptPromise;
      }

      throw Error();
    });

    // Initial render
    render(<App />);

    // First data Fetching
    await waitFor(async () => await reactPromise);

    // Esta primera aserción se espera ya que si es la primera vez que se ejecuta la aplicación se setea 'React' como búsqueda por defecto
    expect(screen.queryByDisplayValue('React')).toBeInTheDocument();
    expect(screen.queryByDisplayValue('JavaScript')).toBeNull();

    expect(screen.queryByText('Jordan Walke')).toBeInTheDocument();
    expect(screen.queryByText('Dan Abramov, Andrew Clark')).toBeInTheDocument();
    expect(screen.queryByText('Brendan Eich')).toBeNull();

    // User interaction -> Search

    fireEvent.change(screen.queryByDisplayValue('React'), {
      target: {
        value: 'JavaScript',
      },
    });

    expect(screen.queryByDisplayValue('React')).toBeNull();
    expect(screen.queryByDisplayValue('JavaScript')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /Submit form/ }));

    // Second Data Fetching
    await waitFor(async () => await javascriptPromise);

    expect(screen.queryByText('Jordan Walke')).toBeNull();
    expect(screen.queryByText('Dan Abramov, Andrew Clark')).toBeNull();
    expect(screen.queryByText('Brendan Eich')).toBeInTheDocument();
  });
});
