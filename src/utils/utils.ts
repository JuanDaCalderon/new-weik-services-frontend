/**
 * This function removes the trash from the domain
 * @param domainToBeCleaned
 * @returns
 */
export const removeTrashFromDomain = (domainToBeCleaned: string): string => {
  let newDomain: string = domainToBeCleaned;
  if (domainToBeCleaned.includes('@') && domainToBeCleaned.includes('.')) {
    newDomain = domainToBeCleaned.split('@')[1].split('.')[0];
  }
  return newDomain;
};

/**
 * This function validates if a domain is valid
 * @param domainToBeValidated
 * @returns
 */
export const isValidDomain = (domainToBeValidated: string): boolean => {
  const regex = /^[A-Za-zÑñ]+$/;
  return regex.test(domainToBeValidated);
};

/**
 * This function validates if a name is valid
 * @param nameToBeValidated
 * @returns
 */
export const isValidName = (nameToBeValidated: string): boolean => {
  const regex = /^[A-Za-zÑñ]+(?: [A-Za-zÑñ]+)*$/;
  return regex.test(nameToBeValidated);
};

/**
 * This function formats a text
 * @param text
 * @returns
 */
export const formatText = (text: string) => text.toLowerCase().replace(/\s+/g, '');

/**
 * This function formats a domain
 * @param domain
 * @returns
 */
export const formatDomain = (domain: string) => removeTrashFromDomain(formatText(domain));
