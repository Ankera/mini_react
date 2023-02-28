import React, { PureComponent } from "react";
import { getCurrentTime } from "@/utils/date";
import money from '@/assets/money.png';
import './decor.less';

// 装饰器为,组件添加age属性
function addAge(Target: Function) {
  Target.prototype.age = 18;
}
// 使用装饰圈
@addAge
class Decor extends PureComponent {

  age?: number

  render() {
    return (
      <div>
        <h1>我是类组件---{this.age}</h1>

        <img src={money} alt="" />
        <p>{getCurrentTime()}</p>
        <div className='smallImg'></div>
      </div>
    )
  }
}

export default Decor