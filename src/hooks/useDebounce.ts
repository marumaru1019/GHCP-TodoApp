import { useState, useEffect } from 'react';

/**
 * 📝 入力値をデバウンス処理するカスタムフック
 * 検索入力のパフォーマンス最適化に使用
 * 
 * @param value デバウンス対象の値
 * @param delay 遅延時間（ミリ秒）
 * @returns デバウンスされた値
 */
export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // 🎯 指定された遅延後に値を更新
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // 📝 新しい値が来たら前のタイマーをクリア
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};