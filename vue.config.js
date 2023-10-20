const { defineConfig } = require('@vue/cli-service');
module.exports = defineConfig({
  transpileDependencies: true,
  // 控制台输出具体代码位置
  configureWebpack: {
    // 选项：
    // devtool: 'source-map',
    devtool: 'cheap-module-source-map',
  },
});
