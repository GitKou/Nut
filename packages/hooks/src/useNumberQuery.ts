import useQuery from './useQuery';

export default function useNumberQuery(dataIndex: string) {
  const p = useQuery();
  const numberValue =
    p.get(dataIndex) !== 'undefined' ? Number(p.get(dataIndex)) : undefined;

  return numberValue
    ? isNaN(numberValue)
      ? undefined
      : numberValue
    : undefined;
}
