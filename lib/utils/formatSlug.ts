import type { FieldHook } from 'payload';

const format = (val: string): string =>
  val
    .replace(/ /g, '-')
    .replace(/[^\w-]+/g, '')
    .toLowerCase();

const formatSlug =
  (fallback: string): FieldHook =>
  ({ value, originalDoc, data }) => {
    // If the field has a value and it's not being changed by the fallback, return it
    // But the user specifically asked for "updates automatically in edit mode"
    // So we should prioritize the fallback if it's being changed.
    
    const fallbackData = data?.[fallback] || originalDoc?.[fallback];

    if (fallbackData && typeof fallbackData === 'string') {
      return format(fallbackData);
    }

    if (typeof value === 'string') {
      return format(value);
    }

    return value;
  };

export default formatSlug;
