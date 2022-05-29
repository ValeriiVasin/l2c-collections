import classNames from 'classnames/bind';
import type { DebouncedFunc } from 'lodash';
import debounce from 'lodash/debounce';
import { useEffect, useMemo, useRef, useState } from 'react';
import styles from './filter-input.module.scss';
const cx = classNames.bind(styles);

export function FilterInput({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const debouncedRef = useRef<null | DebouncedFunc<(q: string) => void>>(null);
  const [filterText, setFilterText] = useState(value);

  debouncedRef.current = useMemo(() => {
    if (debouncedRef.current) {
      debouncedRef.current.cancel();
    }

    return debounce(onChange, 500);
  }, [onChange]);

  useEffect(() => {
    debouncedRef.current?.(filterText);
  }, [filterText]);

  return (
    <input
      type="search"
      className={cx('filter-input')}
      value={filterText}
      data-testid="filter"
      onChange={({ currentTarget }) => setFilterText(currentTarget.value)}
    />
  );
}
