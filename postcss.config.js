
const functions = {
  units: multiplier => `${multiplier / 2}rem`,
}


export default {
  plugins: {
    'postcss-functions': { functions },
  }
}

