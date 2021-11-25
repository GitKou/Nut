import { useMemo } from 'react';

export default function useParseJson<ValueType>(
  jsonStr: string,
  defaultValue: ValueType,
) {
  const data = useMemo(() => {
    try {
      const list = JSON.parse(jsonStr) as ValueType;
      return list;
    } catch (e) {
      return defaultValue;
    }
  }, [jsonStr, defaultValue]);

  return data;
}
