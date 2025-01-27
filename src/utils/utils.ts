export const removeTrashFromDomain = (domainToBeCleaned: string): string => {
  let newDomain: string = domainToBeCleaned;
  if (domainToBeCleaned.includes('@') && domainToBeCleaned.includes('.')) {
    newDomain = domainToBeCleaned.split('@')[1].split('.')[0];
  }
  return newDomain;
};
