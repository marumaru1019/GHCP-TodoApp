// 📝 検索関連のユーティリティ関数

/**
 * ファジー検索のスコア計算
 * @param query 検索クエリ
 * @param text 検索対象のテキスト
 * @returns マッチスコア (0-1)
 */
export const fuzzySearch = (query: string, text: string): number => {
  if (!query || !text) return 0;
  
  const queryLower = query.toLowerCase();
  const textLower = text.toLowerCase();
  
  // 🚩 完全一致の場合は最高スコア
  if (textLower.includes(queryLower)) {
    return Math.min(1, 1 - (queryLower.length / textLower.length) * 0.5 + 0.5);
  }
  
  // 📝 文字の順序を考慮したファジーマッチング
  let score = 0;
  let queryIndex = 0;
  let lastMatchIndex = -1;
  
  for (let i = 0; i < textLower.length && queryIndex < queryLower.length; i++) {
    if (textLower[i] === queryLower[queryIndex]) {
      // 🎯 連続した文字にボーナスポイント
      const bonus = i === lastMatchIndex + 1 ? 0.1 : 0;
      score += (1 / queryLower.length) + bonus;
      lastMatchIndex = i;
      queryIndex++;
    }
  }
  
  // 📝 すべての文字がマッチした場合のみスコアを返す（最大1.0）
  return queryIndex === queryLower.length ? Math.min(1, score) : 0;
};

/**
 * 検索結果のハイライト表示用マークアップを生成
 * @param text 元のテキスト
 * @param query 検索クエリ
 * @returns ハイライト付きのHTML文字列
 */
export const highlightMatches = (text: string, query: string): string => {
  if (!query || !text) return text;
  
  const regex = new RegExp(`(${escapeRegExp(query)})`, 'gi');
  return text.replace(regex, '<mark class="bg-yellow-200 dark:bg-yellow-800">$1</mark>');
};

/**
 * 正規表現用の特殊文字をエスケープ
 * @param string エスケープ対象の文字列
 * @returns エスケープされた文字列
 */
export const escapeRegExp = (string: string): string => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

/**
 * 検索クエリのパース結果
 */
export interface ParsedQuery {
  text: string;
  tags: string[];
  categories: string[];
  priority: string[];
  status: string[];
  dateConditions: {
    type: 'created' | 'updated' | 'due';
    operator: '>' | '<' | '=' | '>=' | '<=';
    date: Date;
  }[];
  exactMatch: boolean;
}

/**
 * 高度な検索クエリの解析
 * @param query 検索クエリ文字列
 * @returns パースされた検索条件
 */
export const parseSearchQuery = (query: string): ParsedQuery => {
  const result: ParsedQuery = {
    text: '',
    tags: [],
    categories: [],
    priority: [],
    status: [],
    dateConditions: [],
    exactMatch: false,
  };

  if (!query) return result;

  let remainingQuery = query;

  // 📝 完全一致検索 ("text")
  const exactMatchRegex = /"([^"]+)"/g;
  const exactMatch = exactMatchRegex.exec(remainingQuery);
  if (exactMatch) {
    result.text = exactMatch[1];
    result.exactMatch = true;
    remainingQuery = remainingQuery.replace(exactMatchRegex, '').trim();
    return result; // 🚩 完全一致の場合は他の条件を無視
  }

  // 📝 タグ検索 (tag:value)
  const tagRegex = /tag:(\S+)/g;
  let tagMatch;
  while ((tagMatch = tagRegex.exec(remainingQuery)) !== null) {
    result.tags.push(tagMatch[1]);
    remainingQuery = remainingQuery.replace(tagMatch[0], '').trim();
  }

  // 📝 カテゴリ検索 (category:value)
  const categoryRegex = /category:(\S+)/g;
  let categoryMatch;
  while ((categoryMatch = categoryRegex.exec(remainingQuery)) !== null) {
    result.categories.push(categoryMatch[1]);
    remainingQuery = remainingQuery.replace(categoryMatch[0], '').trim();
  }

  // 📝 優先度検索 (priority:high|medium|low)
  const priorityRegex = /priority:(high|medium|low)/g;
  let priorityMatch;
  while ((priorityMatch = priorityRegex.exec(remainingQuery)) !== null) {
    result.priority.push(priorityMatch[1]);
    remainingQuery = remainingQuery.replace(priorityMatch[0], '').trim();
  }

  // 📝 ステータス検索 (status:active|completed)
  const statusRegex = /status:(active|completed)/g;
  let statusMatch;
  while ((statusMatch = statusRegex.exec(remainingQuery)) !== null) {
    result.status.push(statusMatch[1]);
    remainingQuery = remainingQuery.replace(statusMatch[0], '').trim();
  }

  // 📝 日付条件 (created:>2024-01-01)
  const dateRegex = /(created|updated|due):(>=|<=|>|<|=)(\d{4}-\d{2}-\d{2})/g;
  let dateMatch;
  while ((dateMatch = dateRegex.exec(remainingQuery)) !== null) {
    const [, type, operator, dateStr] = dateMatch;
    const date = new Date(dateStr);
    if (!isNaN(date.getTime())) {
      result.dateConditions.push({
        type: type as 'created' | 'updated' | 'due',
        operator: operator as '>' | '<' | '=' | '>=' | '<=',
        date,
      });
    }
    remainingQuery = remainingQuery.replace(dateMatch[0], '').trim();
  }

  // 📝 残りのテキストを一般検索テキストとして扱う
  result.text = remainingQuery.trim();

  return result;
};

/**
 * 日付比較を実行
 * @param targetDate 比較対象の日付
 * @param operator 比較演算子
 * @param referenceDate 基準日
 * @returns 比較結果
 */
export const compareDates = (
  targetDate: Date,
  operator: string,
  referenceDate: Date
): boolean => {
  const target = targetDate.getTime();
  const reference = referenceDate.getTime();

  switch (operator) {
    case '>': return target > reference;
    case '<': return target < reference;
    case '>=': return target >= reference;
    case '<=': return target <= reference;
    case '=': 
      // 📝 同日であることをチェック（時刻は無視）
      return targetDate.toDateString() === referenceDate.toDateString();
    default: return false;
  }
};