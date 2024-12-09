export const getUpdatedFields = <T extends Record<string, any>>(
  original: Partial<T>,
  updated: Partial<T>
): Partial<T> => {
  const changes: Partial<T> = {};
  for (const key in updated) {
    if (updated[key] !== original[key]) {
      changes[key] = updated[key];
    }
  }
  return changes;
};
