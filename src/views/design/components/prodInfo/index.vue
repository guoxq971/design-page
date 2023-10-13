<template>
  <el-card class="container" style="margin: 20px 0">
    <div>模板号: {{ prod.detail.templateNo }}</div>
    <div>模板名称: {{ prod.detail.templateName }}</div>
    <div>激活尺码: {{ prod.activeSize.name }}</div>
    <div>激活颜色: {{ prod.activeColor.name }}</div>
    <div>
      <div>尺码列表:</div>
      <el-row type="flex">
        <el-col :span="3" v-for="item in prod.sizeList" :key="item.id">
          {{ item.name }}
        </el-col>
      </el-row>
    </div>
    <div>
      <div>颜色列表:</div>
      <el-row type="flex">
        <el-col :span="3" v-for="item in prod.colorList" :key="item.id">
          {{ item.name }}
        </el-col>
      </el-row>
    </div>
  </el-card>
</template>

<script>
export default {
  props: {
    prod: { type: Object, default: () => {} },
  },
};
</script>

<style scoped lang="less"></style>
