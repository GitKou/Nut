import { useParams } from 'react-router-dom';

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
// test lerna publish
console.log('test lerna publish');