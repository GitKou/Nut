/** The Presumption is no matter the key or the value of the enum is unique to each other,  */
export function getKeysOfAnEnum(obj: Record<any, any>) {
  const values = Object.values(obj);
  return values.slice(0, values.length / 2);
}

/** The Presumption is no matter the key or the value of the enum is unique to each other,  */
export function getValuesOfAnEnum(obj: Record<any, any>) {
  const values = Object.values(obj);
  return values.slice(values.length / 2);
}
