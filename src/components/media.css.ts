// Media query definitions - separate file to avoid circular dependencies
const breakpoints = ["40em", "52em", "64em"]

export const media = {
  small: `screen and (min-width: ${breakpoints[0]})`,
  medium: `screen and (min-width: ${breakpoints[1]})`,
  large: `screen and (min-width: ${breakpoints[2]})`,
}
