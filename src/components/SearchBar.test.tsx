import { render, screen, fireEvent } from '@testing-library/react';
import { SearchBar } from './SearchBar';

describe('SearchBar', () => {
  const defaultProps = {
    searchOptions: {
      query: '',
      caseSensitive: false,
      useRegex: false,
      fuzzySearch: true,
      searchFields: ['text' as const],
    },
    onSearchOptionsChange: jest.fn(),
    searchHistory: [],
    onClearSearch: jest.fn(),
    onClearHistory: jest.fn(),
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('検索入力フィールドが表示される', () => {
    render(<SearchBar {...defaultProps} />);
    expect(screen.getByPlaceholderText(/タスクを検索/)).toBeInTheDocument();
  });

  it('検索クエリの入力が正しく動作する', () => {
    render(<SearchBar {...defaultProps} />);
    const input = screen.getByPlaceholderText(/タスクを検索/);
    
    fireEvent.change(input, { target: { value: 'test query' } });
    
    expect(defaultProps.onSearchOptionsChange).toHaveBeenCalledWith({
      ...defaultProps.searchOptions,
      query: 'test query',
    });
  });

  it('検索オプションボタンが表示される', () => {
    render(<SearchBar {...defaultProps} />);
    const optionsButton = screen.getByTitle('検索オプション');
    expect(optionsButton).toBeInTheDocument();
  });

  it('検索クエリがある場合にクリアボタンが表示される', () => {
    const propsWithQuery = {
      ...defaultProps,
      searchOptions: { ...defaultProps.searchOptions, query: 'test' },
    };
    
    render(<SearchBar {...propsWithQuery} />);
    const clearButton = screen.getByTitle(/検索をクリア/);
    expect(clearButton).toBeInTheDocument();
  });

  it('クリアボタンをクリックするとonClearSearchが呼ばれる', () => {
    const propsWithQuery = {
      ...defaultProps,
      searchOptions: { ...defaultProps.searchOptions, query: 'test' },
    };
    
    render(<SearchBar {...propsWithQuery} />);
    const clearButton = screen.getByTitle(/検索をクリア/);
    
    fireEvent.click(clearButton);
    
    expect(defaultProps.onClearSearch).toHaveBeenCalled();
  });

  it('検索オプションパネルの切り替えが動作する', () => {
    render(<SearchBar {...defaultProps} />);
    const optionsButton = screen.getByTitle('検索オプション');
    
    fireEvent.click(optionsButton);
    
    expect(screen.getByText('ファジー検索')).toBeInTheDocument();
    expect(screen.getByText('正規表現')).toBeInTheDocument();
    expect(screen.getByText('大文字小文字区別')).toBeInTheDocument();
  });
});