<template>
  <div class="filter-locale-dialog">
    <NCard title="Choose which locales to hide">
      <NList>
        <NListItem>
          <template v-for="column in columnsList" :key="column.key">
            <NCheckbox v-model:checked="hideColumns[column.key]">
              {{ column.title }}
            </NCheckbox>
            <br>
          </template>
        </NListItem>
      </NList>
    </NCard>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { DataTableColumns } from "naive-ui";
import { NCard, NCheckbox, NList, NListItem } from "naive-ui";

interface FilterLocaleDialogProps {
  columns: DataTableColumns
}
const props = defineProps<FilterLocaleDialogProps>();
const columnsList = computed(() => {
  return props.columns.filter(column => column.key !== "key");
});
const hideColumns = defineModel<Record<string, boolean>>({ default: {} });
</script>
