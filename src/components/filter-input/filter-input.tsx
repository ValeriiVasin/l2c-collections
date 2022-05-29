import classNames from 'classnames/bind';
import type { DebouncedFunc } from 'lodash';
import debounce from 'lodash/debounce';
import React, { forwardRef, useEffect, useMemo, useRef, useState } from 'react';
import styles from './filter-input.module.scss';
const cx = classNames.bind(styles);

interface FilterInputProps {
  value: string;
  onChange: (value: string) => void;
}

export const FilterInput = forwardRef<HTMLInputElement, FilterInputProps>(({ value, onChange }, inputRef) => {
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
      ref={inputRef}
      type="search"
      className={cx('filter-input')}
      value={filterText}
      data-testid="filter"
      onChange={({ currentTarget }) => setFilterText(currentTarget.value)}
    />
  );
});
