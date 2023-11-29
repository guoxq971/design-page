import store from '@/store';
import lodash from 'lodash';
import { Message } from 'element-ui';

import { designToImageUpload } from '@/designApplication/core/utils/toImage/designToImage';
import { saveTextWord, textToImageUpload } from '@/designApplication/core/utils/toImage/textToImage';
import { isTemplateCanUse } from '@/designApplication/store/util';
import { ConfigurationItem, SubmitParamType } from '@/designApplication/interface_2/params';
import { ProdType } from '@/designApplication/interface/prodItem';
import { canvasDefine } from '@/designApplication/core/canvas_2/define';
import { DesignerUtil } from '@/designApplication/core/utils/designerUtil';
import { DesignImageUtil } from '@/designApplication/core/utils/designImageUtil';
import { supplementImageList } from '@/designApplication/core/canvas_2/konvaCanvasAddHelp';
import { sleep } from '@/designApplication/core/utils/sleep';

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

  // 【校验】 判断当前产品的设计类型是否可用
  if (!isTemplateCanUse(prodItem.config3d)) {
    Message.warning('该产品当前设计类型的模板已关闭，请更换其他产品设计！');
    return Promise.reject('该产品当前设计类型的模板已关闭，请更换其他产品设计！');
  }

  // 【校验】批量设计判断
  customObj.static_batchid = localStorage.getItem('static_batchid') || '';
  customObj.asyncFlag = true; //异步-true|同步-false
  if (customObj.static_batchid) {
    if (customObj.saveNumBtn == 1) {
      Message.warning('批量设计时，禁用全颜色合成！');
      return Promise.reject('批量设计时，禁用全颜色合成！');
    }
    customObj.asyncFlag = false;
  }

  // 【校验】判断是 自产|外采
  if (prodItem.detail.templateType == 1) customObj.isSelf = false;
  if (customObj.saveNumBtn == 2) customObj.isSelf = false;

  // 【校验】设计图数量检测
  switch (customObj.isSelf) {
    // 自产
    case true:
      // 设计图数量不能为空
      const designViewList = prodItem.viewList.filter((view) => view.canvas.getImageList().length);
      if (designViewList.length === 0) {
        Message.warning('请至少选择一个视图进行设计，再进行保存操作！');
        return Promise.reject('请至少选择一个视图进行设计，再进行保存操作！');
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
          return Promise.reject('原胚设计，不可以选择设计图！');
        }
      }
      break;
  }

  // 【校验】设计图碰撞检测
  const isCollide = prodItem.viewList.some((view) => view.canvas.getImageList().some((image) => image.attrs.isCollide));
  if (isCollide) {
    Message.warning('你所设计的图案超过了打印的区域');
    return Promise.reject('你所设计的图案超过了打印的区域');
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
          const textResult = await textToImageUpload(image);

          // 文字 - offset (固定值)
          configurationItem.offset.x = 1;
          configurationItem.offset.y = 1;

          // 标识为 文字
          configurationItem.isText = true;
          configurationItem.textId = textResult.checkRes.seqId;

          // 自定义参数 bmParam
          configurationItem.bmParam.designId = textResult.checkRes.seqId;
          configurationItem.bmParam.type = canvasDefine.text;
          configurationItem.bmParam.textParam = textResult.textParam;
          configurationItem.bmParam.isFlipX = image.attrs.isFlipX;
          configurationItem.bmParam.isFlipY = image.attrs.isFlipY;

          // content 参数
          configurationItem.content.svg.image.designId = textResult.checkRes.seqId;
          configurationItem.content.svg.image.width = textResult.imgWidth;
          configurationItem.content.svg.image.height = textResult.imgHeight;
          configurationItem.content.svg.image.isBg = 0;
          configurationItem.content.svg.image.transform = `rotate(0,${imgWidth / 2},${imgHeight / 2})`;
          //文字------------------------------------end
          break;

        //设计图------------------------------------start
        case canvasDefine.image:
          configurationItem.type = image.attrs.name; //类型

          let designId = image.attrs.detail.id;
          let flipImageDesignId = '';
          let flipImageCode = '';

          // 如果是翻转 or 平铺需要上传到服务器, 得到designId
          if (image.attrs.isFlipX || image.attrs.isFlipY) {
            const imageResult = await designToImageUpload(image);
            flipImageDesignId = imageResult.checkRes.seqId;
            flipImageCode = imageResult.checkRes.imageCode;
            designId = flipImageDesignId;
          }

          // 自定义参数 bmParam
          configurationItem.bmParam.designId = image.attrs.detail.id;
          configurationItem.bmParam.imageCode = image.attrs.detail.imageCode;
          configurationItem.bmParam.flipImageDesignId = flipImageDesignId;
          configurationItem.bmParam.flipImageCode = flipImageCode;
          configurationItem.bmParam.isFlipX = image.attrs.isFlipX;
          configurationItem.bmParam.isFlipY = image.attrs.isFlipY;

          // 设计图 - offset (x,y 的坐标)
          configurationItem.offset.x = result.x;
          configurationItem.offset.y = result.y;

          // TODO: 这个要考虑 平铺 的情况
          // 设计图 - content (width,height,scale,id等)
          configurationItem.content.svg.image.designId = designId;
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

/**
 * 保存产品
 * @param {
 * {
 *  verify:()=>Promise<any>,
 *  send:(any)=>Promise<import('@/design').SaveProdResponse>
 *}
 * } param
 * @returns {Promise<void>}
 */
export async function saveProd(param) {
  const historyItem = { loading: true, id: '123', imgUrl: '', name: '' };
  try {
    // 打开loading
    store.commit('designApplication/setLoadingSave', true);

    // 添加 历史设计记录 loading
    await store.dispatch('designApplication/addHistoryItem', historyItem);

    // 校验，并组装参数
    const submitParam = await param.verify();

    // 发送接口
    const res = await param.send(submitParam);

    if (res) {
      Message.success('保存成功');

      // 刷新历史设计记录
      store.dispatch('designApplication/getHistoryList');

      // 如果有文字需要保存文字参数信息
      await saveTextWord(res, submitParam);
    }
  } catch (e) {
    console.log('保存产品 saveProd e', e);
    // 移除 历史设计记录 loading
    setTimeout(() => {
      store.dispatch('designApplication/clearHistoryItem', historyItem);
    }, 1000);
  } finally {
    store.commit('designApplication/setLoadingSave', false);
  }
}

/**
 * 精细产品校验,并返回提交参数
 * @param type 保存类型
 * @param prodItem 产品信息
 * @returns {Promise<SubmitParamType[]>}
 */
export async function refineVerify(type, prodItem) {
  store.commit('designApplication/setLoadingSave', true);
  // 补充imageList
  for (let view of prodItem.viewList) {
    supplementImageList(view);
  }

  // 过滤出精细设计中有图片的的尺码视图, 如果没有图片的尺码视图，就用当前的尺码视图
  const resultProdList = store.state.designApplication.prodStore.list.filter((e) => e.type === ProdType.refine && e.viewList.some((e) => e.imageList.length));

  // 如果没有图片的尺码视图，就用当前的尺码视图
  if (resultProdList.length === 0) {
    resultProdList.push(prodItem);
  }

  // 组装提交数据
  const submitList = [];
  for (let prod of resultProdList) {
    // 切换对对应尺码
    await store.dispatch('designApplication/setActiveSizeId', prod.sizeId);

    // 等待切换尺码
    await sleep(0);

    // 获取对应尺码的提交数据
    const param = await getSaveProdParam(type, prod);
    submitList.push(param);
  }

  // 最后切回到当前尺码
  await store.dispatch('designApplication/setActiveSizeId', prodItem.sizeId);

  return submitList;
}
