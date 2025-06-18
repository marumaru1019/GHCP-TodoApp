import { fuzzySearch, highlightMatches, parseSearchQuery, compareDates } from './searchUtils';

describe('searchUtils', () => {
  // 📝 ファジー検索のテスト
  describe('fuzzySearch', () => {
    it('完全一致の場合は高いスコアを返す', () => {
      expect(fuzzySearch('test', 'test')).toBeGreaterThan(0.8);
    });

    it('部分一致の場合は中程度のスコアを返す', () => {
      const score = fuzzySearch('test', 'this is a test string');
      expect(score).toBeGreaterThan(0);
      expect(score).toBeLessThanOrEqual(1);
    });

    it('マッチしない場合は0を返す', () => {
      expect(fuzzySearch('xyz', 'abc')).toBe(0);
    });

    it('空文字列の場合は0を返す', () => {
      expect(fuzzySearch('', 'test')).toBe(0);
      expect(fuzzySearch('test', '')).toBe(0);
    });

    it('連続した文字にボーナスを与える', () => {
      const contiguousScore = fuzzySearch('test', 'testing');
      const nonContiguousScore = fuzzySearch('test', 't e s t');
      expect(contiguousScore).toBeGreaterThanOrEqual(nonContiguousScore);
    });
  });

  // 📝 ハイライト機能のテスト
  describe('highlightMatches', () => {
    it('マッチした部分をマークアップで囲む', () => {
      const result = highlightMatches('hello world', 'world');
      expect(result).toContain('<mark');
      expect(result).toContain('world');
    });

    it('マッチしない場合は元のテキストを返す', () => {
      const result = highlightMatches('hello world', 'xyz');
      expect(result).toBe('hello world');
    });

    it('空のクエリの場合は元のテキストを返す', () => {
      const result = highlightMatches('hello world', '');
      expect(result).toBe('hello world');
    });

    it('大文字小文字を区別しない', () => {
      const result = highlightMatches('Hello World', 'hello');
      expect(result).toContain('<mark');
    });
  });

  // 📝 検索クエリパースのテスト
  describe('parseSearchQuery', () => {
    it('通常のテキスト検索をパースする', () => {
      const result = parseSearchQuery('hello world');
      expect(result.text).toBe('hello world');
      expect(result.exactMatch).toBe(false);
    });

    it('完全一致検索をパースする', () => {
      const result = parseSearchQuery('"exact match"');
      expect(result.text).toBe('exact match');
      expect(result.exactMatch).toBe(true);
    });

    it('ステータス検索をパースする', () => {
      const result = parseSearchQuery('status:active');
      expect(result.status).toContain('active');
    });

    it('日付条件をパースする', () => {
      const result = parseSearchQuery('created:>2024-01-01');
      expect(result.dateConditions).toHaveLength(1);
      expect(result.dateConditions[0].type).toBe('created');
      expect(result.dateConditions[0].operator).toBe('>');
    });

    it('複合検索クエリをパースする', () => {
      const result = parseSearchQuery('urgent status:active created:>2024-01-01');
      expect(result.text).toBe('urgent');
      expect(result.status).toContain('active');
      expect(result.dateConditions).toHaveLength(1);
    });

    it('空のクエリを適切に処理する', () => {
      const result = parseSearchQuery('');
      expect(result.text).toBe('');
      expect(result.tags).toHaveLength(0);
      expect(result.status).toHaveLength(0);
    });
  });

  // 📝 日付比較のテスト
  describe('compareDates', () => {
    const date1 = new Date('2024-01-01');
    const date2 = new Date('2024-01-02');

    it('> 演算子が正しく動作する', () => {
      expect(compareDates(date2, '>', date1)).toBe(true);
      expect(compareDates(date1, '>', date2)).toBe(false);
    });

    it('< 演算子が正しく動作する', () => {
      expect(compareDates(date1, '<', date2)).toBe(true);
      expect(compareDates(date2, '<', date1)).toBe(false);
    });

    it('= 演算子が同日であることを確認する', () => {
      const sameDate1 = new Date('2024-01-01T10:00:00');
      const sameDate2 = new Date('2024-01-01T15:00:00');
      expect(compareDates(sameDate1, '=', sameDate2)).toBe(true);
    });

    it('>= 演算子が正しく動作する', () => {
      expect(compareDates(date2, '>=', date1)).toBe(true);
      expect(compareDates(date1, '>=', date1)).toBe(true);
      expect(compareDates(date1, '>=', date2)).toBe(false);
    });

    it('<= 演算子が正しく動作する', () => {
      expect(compareDates(date1, '<=', date2)).toBe(true);
      expect(compareDates(date1, '<=', date1)).toBe(true);
      expect(compareDates(date2, '<=', date1)).toBe(false);
    });

    it('不正な演算子の場合はfalseを返す', () => {
      expect(compareDates(date1, 'invalid', date2)).toBe(false);
    });
  });
});