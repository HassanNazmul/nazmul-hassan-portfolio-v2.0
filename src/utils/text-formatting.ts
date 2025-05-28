/**
 * Text formatting utilities for form inputs with grammar logic
 */

/**
 * Capitalizes the first letter of each word in a name
 * Example: "john doe" -> "John Doe"
 */
export const formatName = (name: string): string => {
  return name
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

/**
 * Formats email with only the first letter capitalized
 * Example: "JOHN.DOE@EXAMPLE.COM" -> "John.doe@example.com"
 */
export const formatEmail = (email: string): string => {
  const trimmedEmail = email.toLowerCase();
  return trimmedEmail.charAt(0).toUpperCase() + trimmedEmail.slice(1);
};

/**
 * Capitalizes the first letter of each sentence
 * Handles multiple sentence endings: . ! ?
 * Converts ALL CAPS or all lowercase to proper sentence case
 * Example: "HELLO WORLD. HOW ARE YOU?" -> "Hello world. How are you?"
 * Example: "hello world. how are you?" -> "Hello world. How are you?"
 */
export const formatSentences = (text: string): string => {
  // First convert everything to lowercase to normalize
  const normalizedText = text.toLowerCase();

  // Split by sentence endings but keep the punctuation
  const sentences = normalizedText.split(/([.!?]\s*)/);

  let result = '';
  let shouldCapitalize = true;

  for (let i = 0; i < sentences.length; i++) {
    const part = sentences[i];

    if (part.match(/^[.!?]\s*/)) {
      // This is punctuation + whitespace
      result += part;
      shouldCapitalize = true;
    } else if (part.trim().length > 0) {
      // This is actual text content
      if (shouldCapitalize) {
        const trimmed = part.trimStart();
        const leadingSpaces = part.substring(0, part.length - trimmed.length);
        result += leadingSpaces + trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
        shouldCapitalize = false;
      } else {
        result += part;
      }
    } else {
      result += part;
    }
  }

  return result;
};

/**
 * Formats subject line (same as sentence formatting)
 */
export const formatSubject = formatSentences;

/**
 * Formats message content (same as sentence formatting)
 */
export const formatMessage = formatSentences;

/**
 * Combined formatter that applies appropriate formatting based on field type
 */
export const formatField = (value: string, fieldType: 'name' | 'email' | 'subject' | 'message'): string => {
  switch (fieldType) {
    case 'name':
      return formatName(value);
    case 'email':
      return formatEmail(value);
    case 'subject':
      return formatSubject(value);
    case 'message':
      return formatMessage(value);
    default:
      return value;
  }
};