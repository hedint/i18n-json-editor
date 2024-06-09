<template>
  <div class="main">
    <Upload v-if="!translationsStore.isShown" />
    <LocaleTable
      v-if="translationsStore.isShown"
      :locales="translationsStore.translationsTable"
      :main-locale="translationsStore.mainLocale"
      @download="downloadFiles"
      @edit="editRow"
    />
  </div>
</template>

<script setup lang="ts">
import { downloadZip } from "client-zip";
import { useTranslationsStore } from "@/stores/translations";
import LocaleTable from "@/components/LocaleTable.vue";
import Upload from "@/components/Upload.vue";

const translationsStore = useTranslationsStore();
const downloadFiles = async () => {
  const files = translationsStore.tableToJson(translationsStore.translationsTable);
  const blob = await downloadZip(Object.keys(files).map((key) => {
    return { name: `${key}.json`, input: new Blob([JSON.stringify(files[key], undefined, 2)], { type: "application/json" }) };
  })).blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "locales.zip";
  a.click();
  window.URL.revokeObjectURL(url);
};
const editRow = ({ key, locale, value }: { key: string, locale: string, value: string }) => {
  translationsStore.translations[locale][key] = value;
};
</script>
