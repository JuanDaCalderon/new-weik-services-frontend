export const removeTrashFromDomain = (domainToBeCleaned: string): string => {
  let newDomain: string = domainToBeCleaned;
  if (domainToBeCleaned.includes('@') && domainToBeCleaned.includes('.')) {
    newDomain = domainToBeCleaned.split('@')[1].split('.')[0];
  }
  return newDomain;
};

export const isValidDomain = (domainToBeValidated: string): boolean => {
  const regex = /^[A-Za-zÑñ]+$/;
  return regex.test(domainToBeValidated);
};

export const isValidName = (nameToBeValidated: string): boolean => {
  const regex = /^[A-Za-zÑñ]+(?: [A-Za-zÑñ]+)*$/;
  return regex.test(nameToBeValidated);
};

export const formatText = (text: string) => text.toLowerCase().replace(/\s+/g, '');
export const formatDomain = (domain: string) => removeTrashFromDomain(formatText(domain));
