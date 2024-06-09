import { computed, ref } from "vue";
import type { Ref } from "vue";
import { defineStore } from "pinia";
import { formatLocales, localeToJson, parseLocale, tableToLocales } from "@/helpers/parse-locales";

export const useTranslationsStore = defineStore("counter", () => {
  const translations: Ref<Record<string, Record<string, string | number>>> = ref({});
  const isShown = ref(false);
  const mainLocale = ref("");
  const isMainLocaleSet = ref(false);
  function addTranslation(name: string, jsonContent: Record<string, Record<string, unknown>>) {
    translations.value[name] = parseLocale(jsonContent);
    if (!isMainLocaleSet.value) {
      const locales = Object.keys(translations.value);
      const priorityLocales = ["en", "en-US", "en_US"];
      for (const locale of priorityLocales) {
        if (locales.includes(locale)) {
          mainLocale.value = locale;
          break;
        }
      }
      if (!mainLocale.value) {
        mainLocale.value = locales[0];
      }
    }
  }
  const translationsTable = computed(() => {
    return formatLocales(translations.value, mainLocale.value);
  });

  const setMainLocale = (locale: string) => {
    isMainLocaleSet.value = true;
    mainLocale.value = locale;
  };
  const showTable = () => {
    isShown.value = true;
  };
  const hideTable = () => {
    isShown.value = false;
  };
  const tableToJson = (table: Record<string, string | number>[]): Record<string, unknown> => {
    const flatLocales = tableToLocales(table);
    const unflatLocales: Record<string, unknown> = {};
    for (const locale in flatLocales) {
      unflatLocales[locale] = localeToJson(flatLocales[locale]);
    }
    return unflatLocales;
  };

  return {
    translations,
    translationsTable,
    isShown,
    showTable,
    mainLocale,
    setMainLocale,
    hideTable,
    addTranslation,
    tableToJson,
  };
});
