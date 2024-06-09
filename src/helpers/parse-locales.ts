import { flatten, unflatten } from "flat";

function isObject(val: unknown) {
  if (val === null) {
    return false;
  }
  return ((typeof val === "function") || (typeof val === "object"));
}
const arrayLikeObjectsToArrays = (jsonContent: Record<string, unknown>) => {
  Object.keys(jsonContent).forEach((key) => {
    if (isObject(jsonContent[key])) {
      if (Object.prototype.hasOwnProperty.call(jsonContent[key], "0")) {
        jsonContent[key] = Object.values(jsonContent[key] as Record<string, unknown>);
      } else {
        arrayLikeObjectsToArrays(jsonContent[key] as Record<string, unknown>);
      }
    }
  });
};

const formatLocales = (locales: Record<string, Record<string, string | number>>, mainLocale: string = "en"): Record<string, string | number>[] => {
  const allKeys = new Set<string>();
  for (const locale in locales) {
    for (const key in locales[locale]) {
      allKeys.add(key);
    }
  }
  const locale = locales[mainLocale];
  const result = [];
  for (const key of allKeys) {
    const item: Record<string, string | number> = { key };
    item[mainLocale] = locale[key];
    for (const localeKey in locales) {
      item[localeKey] = locales[localeKey][key];
    }
    result.push(item);
  }
  return result;
};
const tableToLocales = (table: Record<string, string | number>[]): Record<string, Record<string, string | number>> => {
  return table.reduce((result: Record<string, Record<string, string | number>>, item) => {
    const key = item.key;
    for (const locale in item) {
      if (locale === "key") {
        continue;
      }
      if (!result[locale]) {
        result[locale] = {};
      }
      result[locale][key] = item[locale];
    }
    return result;
  }, {});
};
const parseLocale = (jsonContent: Record<string, unknown>): Record<string, string | number> => {
  return flatten(jsonContent);
};
const localeToJson = (locale: Record<string, string | number>): Record<string, unknown> => {
  const result: Record<string, unknown> = unflatten(locale, { object: true });
  arrayLikeObjectsToArrays(result);
  return result;
};
export { parseLocale, formatLocales, tableToLocales, localeToJson };
