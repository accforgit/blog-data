<template>
<div class="box">
  <div class="search-box">
    <Search
      :style="{ width:'260px' }"
      search-button
      :disabled="state.context.loading"
      @keyup.enter="handleSearch(($event.target as any as HTMLInputElement).value)"
      @search="handleSearch" />
  </div>
  <Table
    :columns="columns"
    :data="state.context.list"
    :loading="state.context.loading"
    :pagination="{
      total: state.context.total,
      current: state.context.page,
      showTotal: true
    }"
    @page-change="handlePageChange" />
</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { createModel } from 'xstate/lib/model';
import { useMachine } from '@xstate/vue'
import { Table, Input, Empty, Message } from '@arco-design/web-vue'
import { getTableData, columns, TData } from './util'

const model = createModel({
  searchValue: '',
  loading: false,
  list: [] as TData['list'],
  page: 1,
  total: 0
}, {
  events: {
    // 加载数据
    LOAD: (params: { page: number, searchValue: string }) => params
  }
})

const machine = model.createMachine({
  context: model.initialContext,
  initial: 'idle',
  states: {
    idle: {
      on: {
        LOAD: {
          target: 'pending',
          actions: ['setContext']
        }
      }
    },
    pending: {
      invoke: {
        id: 'pending-data',
        src: context => getTableData(context.page, context.searchValue),
        onDone: {
          target: 'success',
          actions: model.assign({
            loading: () => false,
            total: (_, event) => ((event as any).data as TData).total,
            list: (_, event) => ((event as any).data as TData).list
          })
        },
        onError: {
          target: 'failure',
          actions: [
            model.assign({
              loading: false,
            }),
            () => Message.error('获取数据出错')
          ]
        }
      }
    },
    success: {
      on: {
        LOAD: {
          target: 'pending',
          actions: ['setContext']
        }
      }
    },
    failure: {
      on: {
        LOAD: {
          target: 'pending',
          actions: ['setContext']
        }
      }
    }
  }
}, {
  actions: {
    setContext: model.assign({
      loading: () => true,
      page: (_, event) => event.page,
      searchValue: (_, event) => event.searchValue
    })
  }
})

export default defineComponent({
  components: {
    Empty,
    Table,
    Search: Input.Search
  },
  setup() {
    const { state, send } = useMachine(machine)
    
    send('LOAD', { page: state.value.context.page, searchValue: state.value.context.searchValue })

    const methods = {
      handleSearch(v: string) {
        send('LOAD', { page: 1, searchValue: v })
      },
      handlePageChange(page: number) {
        send('LOAD', { page: page, searchValue: state.value.context.searchValue })
      }
    }

    return {
      state,
      columns,
      ...methods
    }
  }
})
</script>
