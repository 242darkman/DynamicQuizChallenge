import { levels, themes } from "./settingsOptions";

export function translateLevelValueToFrench(value) {
  const item = levels.find(item => item.value === value);
  return item ? item.label : 'Non trouvé';
}

export function translateThemeValueToFrench(value) {
  const item = themes.find(item => item.value === value);
  return item ? item.label : 'Non trouvé';
}