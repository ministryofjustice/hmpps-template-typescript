const properCase = (word: string): string => {
  return word.length >= 1 ? word[0].toUpperCase() + word.toLowerCase().slice(1) : word
}

const isBlank = (str: string): boolean => {
  return !str || /^\s*$/.test(str)
}

/**
 * Converts a name (first name, last name, middle name, etc.) to proper case equivalent, handling double-barreled names
 * correctly (i.e. each part in a double-barreled is converted to proper case).
 * @param name name to be converted.
 * @returns name converted to proper case.
 */
const properCaseName = (name: string): string => {
  return isBlank(name) ? '' : name.split('-').map(properCase).join('-')
}

const convertToTitleCase = (sentence: string): string => {
  return isBlank(sentence) ? '' : sentence.split(' ').map(properCaseName).join(' ')
}

export default convertToTitleCase
