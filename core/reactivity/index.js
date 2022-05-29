// 依赖
let currentEffect;
class Dep {
    // 储存依赖并去重
    constructor(val) {
        this.effects = new Set();
        this._val = val;
    }
    get value() {
        this.depend();
        return this._val;
    }
    set value(newVal) {
        this._val = newVal;
        this.notice();
    }
    // 收集依赖
    depend() {
        if (currentEffect) {
            this.effects.add(currentEffect);
        }
    }
    // 触发依赖
    notice() {
        this.effects.forEach((effect) => {
            effect();
        });
    }
}
const dep = new Dep(10);
export const effectWatch = (effect) => {
    currentEffect = effect;
    effect(); // 首次自动调用
    // dep.depend(); // 能不能不手动调用
    currentEffect = null;
}
// let b;
// effectWatch(() => {
//      b = dep.value + 10;
//      console.log(b);
// });
// dep.value = 20;
// dep.notice(); // 能不能不手动调用


// reactive实现
const targetMap = new Map();
function getDep(target, key) {
    let depsMap = targetMap.get(target);
    if (!depsMap) {
        depsMap = new Map();
        targetMap.set(target, depsMap);
    }
    // console.log(target, key, targetMap, targetMap.get(target), Reflect.get(target, key));
    let dep = depsMap.get(key);
    if (!dep) {
        dep = new Dep();
        depsMap.set(key, dep);
    }
    return dep;
}
export function reactive(raw) {
    return new Proxy(raw, {
        get(target, key) {
            // console.log(target, key);
            // dep存储
            const dep = getDep(target, key);
            // 收集依赖
            dep.depend(); // 把对象拆分的每一个key都做响应式处理
            return Reflect.get(target, key);
        },
        set(target, key, value) {
            // 触发依赖
            const dep = getDep(target, key);
            const result = Reflect.set(target, key, value);
            console.log('reactive set', result);
            dep.notice();
            return result;
        },
    });
};
// const user = reactive({
//     name: 'jimo',
// });
// effectWatch(() => {
//     console.log('reactive------', user.name);
// });
// user.name = 'haha';