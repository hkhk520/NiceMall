import Vue from 'vue';
import { Toast } from 'vant';

Vue.use(Toast);

class ValidForm{
  constructor(){}
  valid(o){
    for(let key in o){
      // 正则表达式的表单验证
      if(!o[key].reg.test(o[key].value)){
        Toast(o[key].errorMsg);
        return false;
      }
    }
    return true;
  }
}

export const validForm = new ValidForm();