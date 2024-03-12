import axios from 'axios'

/**
 *
 * @param {string} text
 * @param {'info' | 'error'} type
 * @returns {void}
 */
function showNotification(text, type = 'info') {
  const modal = document.createElement('div')
  modal.classList.add('notification-component')
  const html = `
    <div
      class="${type === 'error' ? 'is-danger' : 'is-info'}"
      data-test="${type === 'error' ? 'error-message' : 'info-message'}"
    >
      <button data-test="close-message-button"></button>
      <div>${text}</div>
    </div>
  `
  modal.insertAdjacentHTML('afterbegin', html)
  const close = () => {
    modal.classList.remove('__visible')
    modal.addEventListener('transitionend', () => modal.remove())
  }
  document.body.append(modal)
  window.setTimeout(() => modal.classList.add('__visible'), 50)
  window.setTimeout(close, 10000)
  modal.addEventListener('click', close)
}

export const showError = (e) => {
  // axios request cancellation is not a error
  if (axios.isCancel(e)) return
  // AbortController request cancellation is not en error
  if (e?.code === 'ERR_CANCELED') return
  console.error(e)

  let errorText = ''
  // Error happened but error is empty
  if (!e) errorText = 'Unknown error'
  // string
  else if (typeof e === 'string') errorText = e
  // array of strings
  else if (typeof e?.[0] === 'string') errorText = e.join(', ')
  // formatted server error
  else if (typeof e?.response?.data?.error === 'string') errorText = e.response.data.error
  else if (e instanceof Error) errorText = e.message
  // apollo gql errors - {text: string}[]
  else if (e?.forEach) e.forEach((error) => (errorText += error?.text ?? ''))

  showNotification(errorText, 'error')
}

/**
 *
 * @param {string} text
 */
export const showMessage = (text) => showNotification(text)
