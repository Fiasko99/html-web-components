const resources = [
  'Стать продавцом',
  'Покупать как компания',
  'Мобильное приложение',
  'Подарочные сертификаты',
  'Помощь',
]
const right = document.querySelector('.right')

resources.forEach(resource => {
  right.innerHTML += `<div>${resource}</div>`
})