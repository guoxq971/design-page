import { Core } from './core.js';

export class MyThree extends Core {
  constructor(_param) {
    const param = {
      id: '',
    };
    Object.assign(param, _param);
    super(param.id);
  }
}
