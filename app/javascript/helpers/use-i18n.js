export const locale = document.documentElement.lang || 'en'

export function useI18n({ messages }) {
  // en is a fallback locale
  const t = (key) => messages[locale]?.[key] || messages.en?.[key] || key
  return { t }
}

export function defineMessages(messages) {
  return messages
}
