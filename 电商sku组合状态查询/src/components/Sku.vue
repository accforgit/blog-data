<template>
<div class="spu-selectbox">
  <div class="seleted-info">
    <p class="prod-title">{{baseData.title}}</p>
    <div class="seleted-summary">
      <div class="has-selected">
        <span class="selected-txt">已选</span>
        <ul class="selected-list">
          <li class="selected-item" v-for="(item) in hasSelectedList" :key="item.paramId">{{item.valueValue}}</li>
        </ul>
      </div>
      <br>
      <p class="sku-info">当前所选的 sku 最低价格：{{currentSeletedPrice || '---'}}</p>
      <p class="sku-info">当前所选的 sku 总库存：{{currentTotalCount}}</p>
    </div>
  </div>
  <ul class="spu-list" v-if="baseData.skuParamVoList.length">
    <li class="spu-item" v-for="(item, index) in baseData.skuParamVoList" :key="index">
      <p class="item-title">{{item.paramValue}}</p>
      <span
        :class="['item-tag', item.paramId, v.valueId, {'active-tag': activeSkuTagMap[item.paramId] === v.valueId}, {'disable-tag': emptyMap[item.paramId] && emptyMap[item.paramId].includes(v.valueId) }]"
        @click="selectTag(item.paramId, v.valueId)"
        v-for="(v, k) in item.valueList"
        :key="k">{{v.valueValue}}</span>
    </li>
  </ul>
  <div class="action-btn-box fixed_bottom">
    <button :class="['btn-box', {'btn-disable': hasSelectedList.length !== baseData.skuParamVoList.length}]">
      立即购买
    </button>
  </div>
</div>
</template>
<script lang="ts" src="./index.ts"></script>
<style>
.spu-selectbox {
  --boxPaddingH: 20px;
  position: relative;
  color: #000;
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
  background-color: #fff;
}
.seleted-info {
  overflow: hidden;
}
.prod-title {
  font-size: 14px;
}
.has-selected {
  height: 40px;
  font-size: 12px;
}
.selected-txt {
  display: inline-block;
  color: #7F7F7F;
}
.selected-list {
  list-style: none;
  margin: 0;
  padding: 0;
  max-width: 220px;
}
.selected-item {
  display: inline-block;
  margin-right: 6px;
}
.sku-info {
  margin: 0;
  font-family: myFont;
  font-size: 15px;
}
.spu-list {
  list-style: none;
  overflow: scroll;
  padding: 0 var(--boxPaddingH);
  background-color: #f8f8f8;
}
.spu-list::-webkit-scrollbar {
  display: none;
}
.spu-item {
  /* padding-bottom: 6px; */
  font-size: 13px;
}
.item-title {
  color: #7f7f7f;
  margin-bottom: 10px;
}
.item-tag {
  display: inline-block;
  margin-right: 10px;
  margin-bottom: 10px;
  padding: 9px 12px;
  box-sizing: border-box;
  border: 2px solid #fff;
  color: #000;
  background-color: #fff;
  transition: all .1s;
}
.item-tag.active-tag {
  border-color: #313132;
}
.item-tag.disable-tag {
  color: #aaa;
}
.action-btn-box {
  padding: 9px var(--boxPaddingH);
}
.btn-box {
  width: 100%;
  padding: 12px 0;
  font-size: 15px;
  color: #fff;
  border: none;
  outline: none;
  border-radius: 6px;
  background-color: #ff4e15;
}
.btn-box.btn-disable {
  opacity: 0.4;
}
.btn-type {
  text-align: center;
  font-size: 15px;
}
</style>
