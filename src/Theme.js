const palette = {
  Blue: [
    '#1565C0',
    '#1976D2',
    '#1E88E5',
    '#2196F3',
    '#42A5F5',
    '#64B5F6',
    '#90CAF9'
  ],
  'Light Blue': [
    '#0277BD',
    '#0288D1',
    '#039BE5',
    '#03A9F4',
    '#29B6F6',
    '#4FC3F7',
    '#81D4FA'
  ],
  Teal: [
    '#00695C',
    '#00796B',
    '#00897B',
    '#009688',
    '#26A69A',
    '#4DB6AC',
    '#80CBC4'
  ],
  Pink: [
    '#AD1457',
    '#C2185B',
    '#D81B60',
    '#E91E63',
    '#EC407A',
    '#F06292',
    '#F48FB1'
  ],
  Indigo: [
    '#283593',
    '#303F9F',
    '#3949AB',
    '#3F51B5',
    '#5C6BC0',
    '#7986CB',
    '#9FA8DA'
  ],
  'Deep Purple': [
    '#4527A0',
    '#512DA8',
    '#5E35B1',
    '#673AB7',
    '#7E57C2',
    '#9575CD',
    '#B39DDB'
  ]
}

export default (themeName) => {
  return {
    palette: palette[themeName],
    headerText: '#FFFFFF',
    headerBorder: palette[themeName][0],
    cornerBorder: palette[themeName][1],
    bodyText: '#666666',
    bodyBorder: '#DADADA',
    bodyPrimary: '#FFFFFF',
    bodySecondary: '#F2F2F2'
  }
}
