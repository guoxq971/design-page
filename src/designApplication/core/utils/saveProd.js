import { DesignerUtil } from '@/designApplication/core/utils/designerUtil';
import { isTemplateCanUse } from '@/designApplication/store/util';
import { ConfigurationItem, SubmitParamType } from '@/designApplication/interface_2/params';
import store from '@/store';
import { DesignImageUtil } from '@/designApplication/core/utils/designImageUtil';
import { canvasDefine } from '@/designApplication/core/canvas_2/define';
import { textToImageUpload } from '@/designApplication/core/utils/textToImage';
import lodash from 'lodash';
import { ProdType } from '@/designApplication/interface/prodItem';
import { Message } from 'element-ui';

/**
 * 组装保存产品的提交参数
 * @param {number|string} type 保存类型 0:保存产品 1:全颜色合成 2:原胚设计
 * @param {import('@/design').ProdItemData} prodItem 产品信息
 * @return {SubmitParamType} submitParam 提交参数
 */
export async function getSaveProdParam(type = '', prodItem = null) {
  const customObj = {
    static_batchid: '', //批量设计id
    asyncFlag: false, //同步-true|异步-false
    isSelf: true, //自产-true|外采-false
    adminImage: '', //是否有管理图库的设计图参与
    saveNumBtn: type, //保存类型 0:保存产品 1:全颜色合成 2:原胚设计
    isUseMirror: '0', //是否镜像设计(这个没用到) 0:否 1:是
    isNeedCopy: '0', //是否空拷贝(多面设计) 0:否 1:是
  };

  // 当前的产品数据
  prodItem = prodItem || DesignerUtil.getActiveProd();

  // 判断当前产品的设计类型是否可用
  if (!isTemplateCanUse(prodItem.config3d)) {
    Message.warning('该产品当前设计类型的模板已关闭，请更换其他产品设计！');
    return;
  }

  // 批量设计判断
  customObj.static_batchid = localStorage.getItem('static_batchid') || '';
  customObj.asyncFlag = true; //异步-true|同步-false
  if (customObj.static_batchid) {
    if (customObj.saveNumBtn == 1) {
      Message.warning('批量设计时，禁用全颜色合成！');
      return;
    }
    customObj.asyncFlag = false;
  }

  // 判断是 自产|外采
  if (prodItem.detail.templateType == 1) customObj.isSelf = false;
  if (customObj.saveNumBtn == 2) customObj.isSelf = false;

  // 设计图数量检测
  switch (customObj.isSelf) {
    // 自产
    case true:
      // 设计图数量不能为空
      const designViewList = prodItem.viewList.filter((view) => view.canvas.getImageList().length);
      if (designViewList.length === 0) {
        Message.warning('请至少选择一个视图进行设计，再进行保存操作！');
        return;
      }

      // 多面设计判断 (当前产品是对面设计,并且只设计了一个视图) isNeedCopy=空拷贝
      customObj.isNeedCopy = prodItem.detail.emptyCopy && prodItem.viewList.length > 1 && designViewList.length === 1 ? '1' : '';
      break;

    // 外采
    case false:
      if (customObj.saveNumBtn == 2) {
        // 原胚设计
        const isSomeImage = prodItem.viewList.some((view) => view.canvas.getImageList().length);
        if (isSomeImage) {
          Message.warning('原胚设计，不可以选择设计图！');
          return;
        }
      }
      break;
  }

  // 设计图碰撞检测
  const isCollide = prodItem.viewList.some((view) => view.canvas.getImageList().some((image) => image.attrs.isCollide));
  if (isCollide) {
    Message.warning('你所设计的图案超过了打印的区域');
    return;
  }

  // 是否有管理图库的设计图参与设计
  customObj.adminImage = prodItem.viewList.some((view) => view.canvas.getImageList().some((image) => image.attrs?.detail?.isAdminOrg));

  // 组装 接口提交的参数
  const submitParam = new SubmitParamType();
  submitParam.appearance.id = store.state.designApplication.activeColorId; //颜色id
  submitParam.defaultValues.defaultView.id = store.state.designApplication.activeViewId; //视图id
  submitParam.productType.id = prodItem.detail.id; //产品id
  submitParam.templateType = prodItem.detail.templateType; //模板类型 0:自产 1:外采
  submitParam.isUseMirror = customObj.isUseMirror; //镜像设计
  submitParam.isNeedCopy = customObj.isNeedCopy; //空拷贝
  submitParam.static_batchid = customObj.static_batchid; //批量设计id
  submitParam.saveNumBtn = customObj.saveNumBtn; //保存类型 0:保存产品 1:全颜色合成 2:原胚设计
  submitParam.adminImage = customObj.adminImage ? 1 : ''; //是否有管理图库的设计图参与设计
  submitParam.configurations = [];
  // 如果是精细产品
  if (prodItem.type === ProdType.refine) {
    submitParam.productType.size = prodItem.size;
    submitParam.productType.sizeType = prodItem.sizeType;
  }

  // 组装设计图
  for (let view of prodItem.viewList.toReversed()) {
    for (let image of view.canvas.getImageList()) {
      // 跳过不可见的设计
      if (!image.visible()) continue;

      // 组装设计信息
      const configurationItem = new ConfigurationItem();
      configurationItem.content.dpi = prodItem.detail.dpi; //产品dpi
      configurationItem.printArea.id = view.id; //当前设计所在的视图id

      // 获取设计信息 (设计图、文字用到)
      const result = DesignImageUtil.getImageInfo(image);
      const imgWidth = result?.width;
      const imgHeight = result?.height;
      const angle = result?.rotation;

      switch (image.attrs.name) {
        // 背景色
        case canvasDefine.bgc:
          configurationItem.type = image.attrs.name; //类型
          configurationItem.content.svg = image.attrs.fill;

          // 背景色 - offset (固定值)
          configurationItem.offset.x = 1;
          configurationItem.offset.y = 1;

          // 自定义参数 bmParam
          configurationItem.bmParam.type = canvasDefine.bgc;

          break;

        // 文字------------------------------------start
        case canvasDefine.text:
          configurationItem.type = canvasDefine.image; //类型

          // 将文字转成图片上传到服务器, 得到designId
          const { checkRes, textParam, viewWidth, viewHeight } = await textToImageUpload(image);

          // 文字 - offset (固定值)
          configurationItem.offset.x = 1;
          configurationItem.offset.y = 1;

          // 标识为 文字
          configurationItem.isText = true;
          configurationItem.textId = checkRes.seqId;

          // 自定义参数 bmParam
          configurationItem.bmParam.designId = checkRes.seqId;
          configurationItem.bmParam.type = canvasDefine.text;
          configurationItem.bmParam.textParam = textParam;

          // content 参数
          configurationItem.content.svg.image.designId = checkRes.seqId;
          configurationItem.content.svg.image.width = viewWidth;
          configurationItem.content.svg.image.height = viewHeight;
          configurationItem.content.svg.image.isBg = 0;
          configurationItem.content.svg.image.transform = `rotate(0,${viewWidth / 2},${viewHeight / 2})`;
          //文字------------------------------------end
          break;

        //设计图------------------------------------start
        case canvasDefine.image:
          configurationItem.type = image.attrs.name; //类型

          // 自定义参数 bmParam
          configurationItem.bmParam.imageCode = image.attrs.detail.imageCode;
          configurationItem.bmParam.designId = image.attrs.detail.id;

          // 设计图 - offset (x,y 的坐标)
          configurationItem.offset.x = result.x;
          configurationItem.offset.y = result.y;

          // TODO: 这个要考虑 翻转、平铺的 情况
          // 设计图 - content (width,height,scale,id等)
          configurationItem.content.svg.image.designId = image.attrs.detail.id;
          configurationItem.content.svg.image.width = imgWidth;
          configurationItem.content.svg.image.height = imgHeight;
          configurationItem.content.svg.image.isBg = Number(image.attrs.detail.isBg);
          configurationItem.content.svg.image.transform = `rotate(${angle},${imgWidth / 2},${imgHeight / 2})`;
          //设计图------------------------------------end
          break;
      }

      submitParam.configurations.unshift(configurationItem);
    }
  }

  // 空拷贝, 进入这个判断只会有一个view设计了图案
  if (customObj.isNeedCopy && customObj.isSelf) {
    // 有设计的view
    const tempView = prodItem.viewList.find((view) => view.canvas.getImageList().length);
    const tempCgs = submitParam.configurations.find((e) => e.printArea.id === tempView.id);
    for (let view of prodItem.viewList.toReversed()) {
      const imageList = view.canvas.getImageList();
      // 跳过有设计的view
      if (view.id === tempView.id) continue;

      // 复制一份
      const configurationItem = lodash.cloneDeep(tempCgs);
      configurationItem.isCopy = '1';
      configurationItem.printArea.id = view.id; //当前设计所在的视图id

      submitParam.configurations.unshift(configurationItem);
    }
  }

  return submitParam;
}
