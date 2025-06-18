import { render, screen, fireEvent } from '@testing-library/react';
import { AdvancedFilter } from './AdvancedFilter';

describe('AdvancedFilter', () => {
  const defaultProps = {
    filterOptions: {
      status: 'all' as const,
      categories: [],
      tags: [],
      priority: [],
      dateRange: {
        type: 'created' as const,
      },
    },
    onFilterOptionsChange: jest.fn(),
    onClearFilters: jest.fn(),
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('詳細フィルターヘッダーが表示される', () => {
    render(<AdvancedFilter {...defaultProps} />);
    expect(screen.getByText('詳細フィルター')).toBeInTheDocument();
  });

  it('日付フィルターセクションが表示される', () => {
    render(<AdvancedFilter {...defaultProps} />);
    expect(screen.getByText('日付範囲')).toBeInTheDocument();
  });

  it('日付フィルターを展開できる', () => {
    render(<AdvancedFilter {...defaultProps} />);
    const dateButton = screen.getByText('日付範囲');
    
    fireEvent.click(dateButton);
    
    expect(screen.getByText('日付の種類')).toBeInTheDocument();
    expect(screen.getByText('開始日')).toBeInTheDocument();
    expect(screen.getByText('終了日')).toBeInTheDocument();
  });

  it('日付タイプの選択が動作する', () => {
    render(<AdvancedFilter {...defaultProps} />);
    const dateButton = screen.getByText('日付範囲');
    
    fireEvent.click(dateButton);
    
    const typeSelect = screen.getByDisplayValue('作成日');
    fireEvent.change(typeSelect, { target: { value: 'updated' } });
    
    expect(defaultProps.onFilterOptionsChange).toHaveBeenCalledWith({
      ...defaultProps.filterOptions,
      dateRange: {
        ...defaultProps.filterOptions.dateRange,
        type: 'updated',
      },
    });
  });

  it('開始日の入力が動作する', () => {
    render(<AdvancedFilter {...defaultProps} />);
    const dateButton = screen.getByText('日付範囲');
    
    fireEvent.click(dateButton);
    
    const startDateInput = screen.getByLabelText('開始日');
    fireEvent.change(startDateInput, { target: { value: '2024-01-01' } });
    
    expect(defaultProps.onFilterOptionsChange).toHaveBeenCalledWith({
      ...defaultProps.filterOptions,
      dateRange: {
        ...defaultProps.filterOptions.dateRange,
        start: new Date('2024-01-01'),
      },
    });
  });

  it('終了日の入力が動作する', () => {
    render(<AdvancedFilter {...defaultProps} />);
    const dateButton = screen.getByText('日付範囲');
    
    fireEvent.click(dateButton);
    
    const endDateInput = screen.getByLabelText('終了日');
    fireEvent.change(endDateInput, { target: { value: '2024-12-31' } });
    
    expect(defaultProps.onFilterOptionsChange).toHaveBeenCalledWith({
      ...defaultProps.filterOptions,
      dateRange: {
        ...defaultProps.filterOptions.dateRange,
        end: new Date('2024-12-31'),
      },
    });
  });

  it('アクティブなフィルターがある場合にクリアボタンが表示される', () => {
    const propsWithFilters = {
      ...defaultProps,
      filterOptions: {
        ...defaultProps.filterOptions,
        dateRange: {
          type: 'created' as const,
          start: new Date('2024-01-01'),
        },
      },
    };
    
    render(<AdvancedFilter {...propsWithFilters} />);
    
    expect(screen.getByText('すべてクリア')).toBeInTheDocument();
    expect(screen.getByText('1個のフィルター')).toBeInTheDocument();
  });

  it('フィルタークリアボタンが動作する', () => {
    const propsWithFilters = {
      ...defaultProps,
      filterOptions: {
        ...defaultProps.filterOptions,
        dateRange: {
          type: 'created' as const,
          start: new Date('2024-01-01'),
        },
      },
    };
    
    render(<AdvancedFilter {...propsWithFilters} />);
    const clearButton = screen.getByText('すべてクリア');
    
    fireEvent.click(clearButton);
    
    expect(defaultProps.onClearFilters).toHaveBeenCalled();
  });
});