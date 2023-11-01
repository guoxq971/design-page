<template>
  <div class="popover-wrap">
    <el-popover v-if="activeProd.priceList && activeProd.priceList.length" placement="left" :width="width" trigger="click">
      <!--表格-->
      <centerPriceIconTable :data="activeProd.priceList" :isSpecial="activeProd.isSpecial" :getHeaderObj="getHeaderObj" />

      <!--产品毛利-->
      <el-popover placement="bottom" width="240" trigger="click">
        <template slot="reference">
          <el-button type="primary" class="ml-wrap" size="mini">
            产品毛利
            <span class="el-icon-arrow-down" />
          </el-button>
        </template>
        <!--毛利计算器-->
        <!--<grossProfitCalculator v-if="false" :detail="detail" :isShowDel="false" />-->
      </el-popover>

      <!--icon-->
      <div slot="reference" class="el-icon-question icon"></div>
    </el-popover>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import centerPriceIconTable from './centerPriceIconTable.vue';

export default {
  name: 'centerPriceIcon',
  components: {
    centerPriceIconTable,
  },
  computed: {
    ...mapGetters({
      activeProd: 'designApplication/activeProd',
    }),
    width() {
      let num = 200;
      if (this.activeProd.priceList.length > 0) {
        const headerObj = this.getHeaderObj(this.activeProd.priceList);
        num = 100 + 100 * Object.keys(headerObj).length;
        const maxLen = Math.max(...Object.values(headerObj).map((e) => e.length));
        if (maxLen > 3) {
          num += (maxLen - 3) * 24;
        }
      }
      return num;
    },
  },
  methods: {
    /**
     * 获取重组后的表头
     * @param {import('@/design').ProdItemData.priceList} list 模板价格列表
     * @returns {Object}
     * */
    getHeaderObj(list) {
      const headerObj = {};
      for (const item of list) {
        // 区分尺码 | 颜色;
        const str = item.list.reduce((pre, cur) => {
          return pre + cur.num + '、' + cur.price + '、';
        }, '');
        if (!headerObj[str]) headerObj[str] = [item.prop];
        else headerObj[str].push(item.prop);
      }
      return headerObj;
    },
  },
};
</script>

<style scoped lang="less"></style>
