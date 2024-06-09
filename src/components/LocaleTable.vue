<template>
  <div>
    <NButton @click="openFilterModal">
      Filter: hide locales
    </NButton>
    <NButton type="primary" @click="downloadFiles">
      Download files
    </NButton>
    <NModal v-model:show="filterModalOpened">
      <FilterLocaleDialog v-model="hideColumns" :columns="columns" />
    </NModal>
    <NDataTable
      :columns="visibleColumns"
      :data="locales"
      :pagination="pagination"
      :scroll-x="1800"
      :max-height="1000"
      :bordered="false"
      :striped="true"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, h, ref } from "vue";
import { NButton, NDataTable, NInput, NModal } from "naive-ui";
import type { Ref } from "vue";
import type { DataTableColumns } from "naive-ui";
import FilterLocaleDialog from "./FilterLocaleDialog.vue";

interface LocaleTableProps {
  locales: Record<string, string | number>[]
  mainLocale: string
}
const props = defineProps<LocaleTableProps>();
const emit = defineEmits(["download", "edit"]);
const columns: Ref<DataTableColumns> = ref((() => {
  const keys = Object.keys(props.locales[0]);
  const result: DataTableColumns = [{
    title: "key",
    key: "key",
    fixed: "left",
    resizable: true,
  }];
  for (const key of keys) {
    if (key === "key") {
      continue;
    }
    result.push({
      title: key.toLowerCase(),
      key,
      resizable: true,
      fixed: key === props.mainLocale ? "left" : undefined,
      render(row) {
        return h(NInput, {
          type: "textarea",
          autosize: true,
          value: row[key],
          onUpdateValue: (value) => {
            emit("edit", { key: row.key, locale: key, value });
          },
        });
      },
    });
  }
  return result;
})());
const hideColumns: Ref<Record<string, boolean>> = ref({});

const visibleColumns = computed(() => {
  return columns.value.filter(column => !hideColumns.value[column.key]);
});
const filterModalOpened = ref(false);
const pagination = {
  pageSize: 30,
};
const openFilterModal = () => {
  filterModalOpened.value = true;
};
const downloadFiles = () => {
  emit("download");
};
</script>
