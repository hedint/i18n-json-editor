<template>
  <NFlex vertical>
    <NUpload
      multiple
      :max="20"
      :default-upload="false"
      @change="onFileUpload"
    >
      <NUploadDragger>
        <div style="margin-bottom: 12px">
          <NIcon size="48" :depth="3">
            <ArchiveIcon />
          </NIcon>
        </div>
        <NText style="font-size: 16px">
          Click or drag your json locale files to this area to upload.
        </NText>
        <br>
        <NText style="font-size: 16px">
          The name of the file should match the locale code.
        </NText>
      </NUploadDragger>
    </NUpload>
    <NDivider />
    <NFlex v-if="locales.length" size="medium" :wrap="false" align="center">
      <NText :code="true">
        Select the main locale
      </NText>
      <NSelect style="width: 300px;" :value="translationsStore.mainLocale" placeholder="Select the main locale" :options="locales" @update:value="onMainLocaleChange" />
    </NFlex>
    <NDivider />
    <NFlex justify="center">
      <NButton type="primary" size="large" @click="translationsStore.showTable">
        GO TO EDITOR
      </NButton>
    </NFlex>
  </NFlex>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { NButton, NDivider, NFlex, NIcon, NSelect, NText, NUpload, NUploadDragger } from "naive-ui";
import { ArchiveOutline as ArchiveIcon } from "@vicons/ionicons5";
import type { UploadFileInfo } from "naive-ui";
import { readFile } from "@/helpers/read-file";
import { useTranslationsStore } from "@/stores/translations";

// download file https://gist.github.com/sergiy24ok/ab0e497f41d74beb31c32b7f81dff0c3
const translationsStore = useTranslationsStore();

const locales = computed(() => {
  if (!translationsStore.translations || Object.keys(translationsStore.translations).length === 0) {
    return [];
  }
  return Object.keys(translationsStore.translations).map((locale) => {
    return { label: locale, value: locale };
  });
});

const onMainLocaleChange = (value: string) => {
  translationsStore.setMainLocale(value);
};
const onFileUpload = async ({ file }: { file: UploadFileInfo, fileList: Array<UploadFileInfo> }) => {
  if (!file.file) {
    return false;
  }
  const response = await readFile(file.file) as string;
  translationsStore.addTranslation(file.name.split(".")[0], JSON.parse(response));
  return false;
};
</script>
