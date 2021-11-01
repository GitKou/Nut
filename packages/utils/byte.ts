export interface ByteData {
  number: number;
  unit: EByteSize;
}

export enum EByteSize {
  Bytes,
  KB,
  MB,
  GB,
  TB,
  PB,
  EB,
  ZB,
  YB,
}

export const byteSize: EByteSize[] = [
  EByteSize.Bytes,
  EByteSize.KB,
  EByteSize.MB,
  EByteSize.GB,
  EByteSize.TB,
  EByteSize.PB,
  EByteSize.EB,
  EByteSize.ZB,
  EByteSize.YB,
];

export function formatBytes(bytes: number, decimals = 2): ByteData {
  if (bytes === 0)
    return {
      number: 0,
      unit: EByteSize.Bytes,
    };

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return {
    number: parseFloat((bytes / k ** i).toFixed(dm)),
    unit: byteSize[i],
  };
}

export function formatBytesToString(bytes: number, decimals = 2) {
  const { number, unit } = formatBytes(bytes, decimals);
  return `${number}${EByteSize[unit]}`;
}

export function calcBytes({ number, unit }: ByteData): number {
  return number * 2 ** (10 * unit);
}
