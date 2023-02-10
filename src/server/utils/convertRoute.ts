export function converRoute(route: string) {
  let routeLowerCase = route.toLowerCase()
  return routeLowerCase.replace(/\s/g, "-");
}
