// 从 moalMap中读取所有的 modal项
export const getAllModalList = modalInfo => {
  let currentList = []
  if (modalInfo.modalList) {
    currentList = currentList.concat(
      modalInfo.modalList.reduce((t, c) => t.concat(c.name), [])
    )
  }
  if (modalInfo.children) {
    currentList = currentList.concat(
      Object.keys(modalInfo.children).reduce((t, c) => {
        return t.concat(getAllModalList(modalInfo.children[c]))
      }, [])
    )
  }
  return currentList
}
