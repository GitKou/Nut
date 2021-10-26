import { useParams } from 'umi';

export default function useNumberParam(dataIndex: string) {
  const p = useParams<any>();
  const numberValue =
    p[dataIndex] !== 'undefined' ? Number(p[dataIndex]) : undefined;

  return numberValue
    ? isNaN(numberValue)
      ? undefined
      : numberValue
    : undefined;
}
