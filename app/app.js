const divs = Array.from(document.querySelectorAll('div'))

const getHex = () => {
  const a = '0123456789abcdef'.split('')
  let out = '#'
  for (let i = 0; i < 6; i++) {
    out += a[~~(Math.random() * 16)]
  }
  return out
}


divs.forEach((element, i) => {
  const color = getHex()
  element.style.backgroundColor = color
  element.addEventListener('click', ({ target }) => {
    target.innerText = 'X'
    target.classList.add('poop-storm')
  })
})