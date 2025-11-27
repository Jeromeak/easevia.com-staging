/**
 * Generates initials from a name string.
 * For a full name like "John Doe", returns "JD".
 * For a single name like "John", returns "JO" (first two characters).
 * For empty/invalid names, returns "?".
 *
 * @param name - The full name string (e.g., "John Doe", "John", "John Michael Doe")
 * @param maxLength - Maximum number of initials to return (default: 2)
 * @returns Uppercase initials string
 */
export const getInitials = (name: string | null | undefined, maxLength = 2): string => {
  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    return '?';
  }

  const trimmedName = name.trim();
  const words = trimmedName.split(/\s+/).filter((word) => word.length > 0);

  if (words.length === 0) {
    return '?';
  }

  // If only one word, use first two characters
  if (words.length === 1) {
    const firstWord = words[0];

    if (firstWord.length >= maxLength) {
      return firstWord.substring(0, maxLength).toUpperCase();
    }

    return firstWord.toUpperCase().padEnd(maxLength, firstWord[0] || '?');
  }

  // Multiple words: use first char of first word and first char of last word
  const firstInitial = words[0].charAt(0);
  const lastInitial = words[words.length - 1].charAt(0);

  return `${firstInitial}${lastInitial}`.toUpperCase();
};
