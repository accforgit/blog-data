<template>
<div class="box">
  <div class="search-box">
    <Search
      v-model="searchValue"
      :style="{ width:'260px' }"
      search-button
      :disabled="loading"
      @keyup.enter="handleSearch"
      @search="handleSearch" />
  </div>
  <Table
    :columns="columns"
    :data="list"
    :loading="loading"
    :pagination="{
      total,
      current: page,
      showTotal: true
    }"
    @page-change="handlePageChange" />
</div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue'
import { Table, Input, Empty, Message } from '@arco-design/web-vue'
import { getTableData, columns, TData } from './util'

export default defineComponent({
  components: {
    Empty,
    Table,
    Search: Input.Search
  },
  setup() {
    const data = reactive({
      loading: false,
      page: 1,
      total: 0,
      searchValue: '',
      columns,
      list: [] as TData['list']
    })

    const methods = {
      async freshData() {
        if (data.loading) return
        data.loading = true
        try {
          const respData = await getTableData(data.page, data.searchValue)
          data.total = respData.total
          data.list = respData.list
        } catch(e) {
          Message.error('获取数据出错')
        }
        data.loading = false
      },
      handleSearch() {
        methods.freshData()
      },
      handlePageChange(page: number) {
        data.page = page
        methods.freshData()
      }
    }

    methods.freshData()

    return {
      ...toRefs(data),
      ...methods
    }
  }
})
</script>
