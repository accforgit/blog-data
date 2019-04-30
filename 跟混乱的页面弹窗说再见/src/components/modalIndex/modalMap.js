export default {
  index: {
    modalList: [{
      id: 1,
      condition: 'condition_1',
      level: 100,
      feShow: true
    }, {
      id: 2,
      condition: 'condition_2',
      level: 22,
      feShow: true
    }, {
      id: 3,
      condition: 'condition_3',
      level: 70,
      feShow: true
    }],
    children: {
      child1: {
        modalList: [{
          id: 11,
          condition: 'condition_1_1',
          level: 82,
          feShow: true
        }, {
          id: 12,
          condition: ['condition_1_2', 'condition_1_3', 'condition_1_4'],
          level: 1200,
          feShow: false
        }],
        children: {
          child1_1: {
            modalList: [{
              id: 21,
              condition: ['condition_1_1_1', 'condition_1_1_2'],
              level: 320,
              feShow: true
            }, {
              id: 22,
              condition: 'condition_1_1_3',
              level: 300,
              feShow: true
            }]
          }
        }
      }
    }
  }
}
