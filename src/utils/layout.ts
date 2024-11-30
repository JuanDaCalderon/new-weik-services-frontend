/**
 * Changes the HTML attributes
 * @param attribute - the HTML attribute
 * @param value - the value of the HTML attribute
 */
const changeHTMLAttribute = (attribute: string, value: string): void => {
  if (document.body) document.getElementsByTagName('html')[0].setAttribute(attribute, value);
};

export {changeHTMLAttribute};
