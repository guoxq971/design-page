// 使用到的数据
export class UseProdDetail {
  seqId; //主键
  templateName; // 模板名称
  templateNo; // 模板编号
  templateNameShow; // 模板显示的title
  templateModel; // 模板型号
  dpi; // dpi
  imgFull; // 是否全幅
  views; // 视图 Array
  appearances; // 颜色 Array
  sizes; // 尺码 Array
  printAreas; // 印刷区域 Array
  pointoutPrintAreas; // Array 指定印刷区域
}

// 没用到的数据
class NoUseProdDetail extends UseProdDetail {
  id; // 产品id(模板编号)
  name; // 产品名称
  cnName; // 产品名称
  shortDescription; // 产品名称(一般是空)
  description; // 产品描述(一般是空)
  brand; // 品牌(一般是空)
  defaultValues; // 默认值 Object
  designWidth; // 设计宽度(没用到)
  designHeight; // 设计高度(没用到)
  amType; // 类型(一般是空)
  hasDetail; // 是否有详情(没用到)
  proembryoFlag; // 是否有详情(没用到)
  isHotStamping; // 是否有烫金(没用到)
  secondCalculateNum; // 第二次计算数量(没用到)
  thirdCalculateNum; // 第三次计算数量(没用到)
  templateType; // 模板类型(没用到)
  collectFlag; // 是否收藏(没用到)
  collectId; // 收藏id (没用到)
  configDesign; // 配置设计(没用到) Object
  isCanSynthesi; // 是否可以合成(没用到)
}

// 产品详情数据
export class ProdItemDetail extends NoUseProdDetail {}
