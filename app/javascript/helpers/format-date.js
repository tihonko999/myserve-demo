import { locale } from './use-i18n'
// importing whole I18n is 10 times heavier than individual helpers import
import { parseDate } from 'i18n-js/dist/import/helpers/parseDate'
import { strftime } from 'i18n-js/dist/import/helpers/strftime'
import frCA from 'i18n-js/json/fr-CA.json'
import en from 'i18n-js/json/en.json'

const prepareLocaleOptions = (options, localeName) => ({
  dayNames: options[localeName].date.day_names,
  abbrDayNames: options[localeName].date.abbr_day_names,
  monthNames: options[localeName].date.month_names,
  abbrMonthNames: options[localeName].date.abbr_month_names,
})

const strftimeOptions = {
  en: prepareLocaleOptions(en, 'en'),
  'fr-CA': prepareLocaleOptions(frCA, 'fr-CA'),
}[locale]

/**
 * dateLocale param is useful for usage in Cypress
 * @param {string | Date} date
 * @param {string} format
 * @param {import('./use-i18n').LocaleType} dateLocale
 * @returns {string}
 */
export const formatDate = (
  date,
  format = locale === 'fr-CA' ? '%d %b, %Y' : '%b %d, %Y',
  dateLocale = locale
) => {
  // format options https://github.com/fnando/i18n#date-formatting
  return date ? strftime(parseDate(date), format, strftimeOptions[dateLocale]) : ''
}

/**
 *
 * @param {string} date
 * @param {{month: string; year: string}} format
 * @returns {string}
 */
export const formatMonth = (date, format = { month: 'short', year: 'numeric' }) => {
  // ignore timezone - /-01$/, '-02'
  return date ? new Date(date.replace(/-01$/, '-02')).toLocaleString(locale, format) : ''
}

/**
 *
 * @param {string} date
 * @returns {string}
 */
export const formatTime = (date) => {
  return date ? strftime(new Date(date), '%H:%M', strftimeOptions[locale]) : ''
}
