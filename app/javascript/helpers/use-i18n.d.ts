export type LocaleType = 'en' | 'fr-CA'
export const locale: LocaleType

type KeyValueType = { [key: string]: string }
type MessagesType<T extends KeyValueType> = { en: T; 'fr-CA'?: T }

export function defineMessages<T extends KeyValueType>(messages: MessagesType<T>): MessagesType<T>
export function useI18n<T extends KeyValueType>(options: {
  messages: MessagesType<T>
}): { t: (key: keyof T) => string }
