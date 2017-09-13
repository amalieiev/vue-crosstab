const colors = {
  'Deep Purple': '#4527A0',
  Indigo: '#283593',
  Pink: '#AD1457',
  Teal: '#00695C',
  Vue: '#41b883',
  'Steel Blue': '#4682b4',
  'Light Blue': '#0277BD',
  Blue: '#1565C0'
}

export default ({ name, baseColor, valueColor }) => {
  valueColor = valueColor || '#09622a'

  let hslValueColor = hexToHsl(valueColor)
  let hslColor = hexToHsl(name ? colors[name] : baseColor)
  let palette = []
  let step = 3

  for (let i = 0; i < 10; i++) {
    let color = `hsl(${hslColor[0]}, ${hslColor[1]}%, ${hslColor[2] + i * step}%)`
    palette.push(color)
  }

  return {
    palette: palette,
    headerText: '#FFFFFF',
    headerBorder: palette[0],
    cornerBorder: palette[1],
    bodyText: '#666666',
    bodyBorder: '#DADADA',
    bodyPrimary: '#FFFFFF',
    bodySecondary: '#F2F2F2',
    valueToColor: (value, maxValue) => {
      let valuePercent = value / maxValue
      let color = `hsl(${hslValueColor[0]}, ${hslValueColor[1]}%, ${Math.round(70 - 50 * valuePercent)}%)`

      return color
    }
  }
}

function hexToRgb (hex) {
  if (hex.charAt && hex.charAt(0) === '#') {
    hex = removeHash(hex)
  }

  if (hex.length === 3) {
    hex = expand(hex)
  }

  let bigint = parseInt(hex, 16)
  let r = (bigint >> 16) & 255
  let g = (bigint >> 8) & 255
  let b = bigint & 255

  return [r, g, b]
}

function removeHash (hex) {
  let arr = hex.split('')
  arr.shift()
  return arr.join('')
}

function expand (hex) {
  return hex
    .split('')
    .reduce(function (accum, value) {
      return accum.concat([value, value])
    }, [])
    .join('')
}

function hexToHsl (hex) {
  let hsl = rgbToHsl.apply(rgbToHsl, hexToRgb(hex))
  return [hsl[0], parseInt(hsl[1], 10), parseInt(hsl[2], 10)]
}

function rgbToHsl (r, g, b) {
  let d, h, l, max, min, s
  r /= 255
  g /= 255
  b /= 255
  max = Math.max(r, g, b)
  min = Math.min(r, g, b)
  h = 0
  s = 0
  l = (max + min) / 2
  if (max === min) {
    h = s = 0
  } else {
    d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0)
        break
      case g:
        h = (b - r) / d + 2
        break
      case b:
        h = (r - g) / d + 4
    }
    h /= 6
  }
  h = Math.ceil(h * 360)
  s = (Math.ceil(s * 100)) + '%'
  l = (Math.ceil(l * 100)) + '%'
  return [h, s, l]
}
