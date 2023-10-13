import { ProdStoreItem, ProdType } from './interface/prodItem';

export class ProdStore {
  list = [];

  add(prodItem, type = ProdType.common, size = '') {
    const prodStoreItem = new ProdStoreItem();
    prodStoreItem.templateNo = prodItem.detail.templateNo;
    prodStoreItem.type = type;
    prodStoreItem.size = size;
    prodStoreItem.prodItem = prodItem;
    this.list.push(prodStoreItem);
  }

  clear() {
    this.list = [];
  }
}
