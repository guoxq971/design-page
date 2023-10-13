import { prod3dData, prodData } from '@/views/design/test/prodData';
import { ProdItem2 } from '@/views/design/interface/prodItem2';
import { Prod3dItem } from '@/views/design/interface/prod3dItem';
import { initProd } from '@/views/design/test/dispose/getProdItem';

export const prodList = prodData.map((e) => {
  // return new ProdItem2(e);
  return initProd(e);
});

export const prod3dList = prod3dData.map((e) => new Prod3dItem(e));
