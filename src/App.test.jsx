import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from './App.tsx';
import Item from './components/Item.tsx';
import List from './components/List.tsx';
import SearchForm from './components/SearchForm.tsx';
import InputWithLabel from './components/InputWithLabel.tsx';
import { storiesReducer } from './reducers/storiesReducer.ts';

const storyOne = {
  title: 'React',
  url: 'https://react.dev/',
  author: 'Jordan Walke',
  num_comments: 3,
  points: 4,
  objectId: 0,
};

const storyTwo = {
  title: 'Redux',
  url: 'https://redux.js.org/',
  author: 'Dan Abramov, Andrew Clark',
  num_comments: 2,
  points: 5,
  objectId: 1,
};

const storyThree = {
  author: 'peterhunt',
  num_comments: 287,
  objectId: '9271246',
  points: 1039,
  title: 'React Native is now open source',
  url: 'https://github.com/facebook/react-native',
};

const stories = [storyOne, storyTwo];

describe('storiesReducer', () => {
  it('init fetch stories', () => {
    const action = { type: 'STORIES_FETCH_INIT' };
    const state = { data: stories, isLoading: false, isError: false };
    const newState = storiesReducer(state, action);
    const expectedState = {
      data: stories,
      isLoading: true,
      isError: false,
    };

    expect(newState).toStrictEqual(expectedState);
  });

  it('get data fetch', () => {
    const action = { type: 'STORIES_FETCH_SUCCESS', payload: stories };
    const state = { data: [], isLoading: false, isError: false };
    const newState = storiesReducer(state, action);
    const expectedState = {
      data: stories,
      isLoading: false,
      isError: false,
    };

    expect(newState).toStrictEqual(expectedState);
  });

  it('failuter data fetch', () => {
    const action = { type: 'STORIES_FETCH_FAILURE' };
    const state = { data: stories, isLoading: false, isError: false };
    const newState = storiesReducer(state, action);
    const expectedState = {
      data: stories,
      isLoading: false,
      isError: true,
    };

    expect(newState).toStrictEqual(expectedState);
  });

  it('removes a story from all stories', () => {
    const action = { type: 'REMOVE_STORY', payload: storyOne };
    const state = { data: stories, isLoading: false, isError: false };
    const newState = storiesReducer(state, action);
    const expectedState = {
      data: [storyTwo],
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
});

describe('List', () => {
  // 2 test, uno para evaluar que se hayan renderizado cierta cantidad de elementos como elementos tiene la lista base y otro para evaluar si se renderiza el <NoResults> si la lista no tiene elementos
  it('renders all items from list property', () => {
    render(<List list={stories} />);

    expect(screen.getAllByRole('listitem')).toHaveLength(2);
  });

  it('renders no results', () => {
    render(<List list={[]} />);

    expect(screen.getByText(/No news was found for this search/));
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
});
