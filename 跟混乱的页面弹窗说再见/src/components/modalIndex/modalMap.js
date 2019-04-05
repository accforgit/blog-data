export default {
  index: {
    modalList: [{
      name: 'modal_1',
      level: 10,
      show: true
    }, {
      name: 'modal_2',
      level: 22,
      show: true
    }, {
      name: 'modal_3',
      level: 70,
      show: false
    }],
    children: {
      child1: {
        modalList: [{
          name: 'modal_1_1',
          level: 8,
          show: true
        }, {
          name: 'modal_1_2',
          level: 62,
          show: true
        }],
        children: {
          child1_1: {
            modalList: [{
              name: 'modal_1_1_1',
              level: 8,
              show: true
            }, {
              name: 'modal_1_1_2',
              level: 90,
              show: false
            }]
          }
        }
      }
    }
  }
}
