export type TData = {
  list: {
    name: string
    age: number
  }[]
  total: number
}

// 模拟远程数据请求
export const getTableData = async (page: number, searchValue = '') => {
  return new Promise<TData>((resolve, reject) => {
    setTimeout(() => {
      if (page === 3) {
        reject()
        return
      }
      resolve({
        list: Array.from({ length: 10 }).fill(1).map((_, i) => ({
          name: page + '__' + searchValue + '__' + Math.random().toString(36).substring(2),
          age: Math.round(Math.random() * 100)
        })),
        total: 100
      })
    }, (Math.random() * 1 + 0.5) * 1000)
  })
}

export const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
  },
  {
    title: 'Age',
    dataIndex: 'age',
  },
]
