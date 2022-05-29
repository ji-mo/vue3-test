// 第一步
// let effectWatch;
// class Dep {
//     constructor(val) {
//         this.effects = new Set(); // 储存依赖当前变量的函数，并去重
//         this._val = val;
//     }
//     get value() {
//         return this._val;
//     }
//     set value(newVal) {
//         this._val = newVal
//     }
// }
// const dep = new Dep(10);
// console.log('取值：', dep.value);
// dep.value = 20;
// console.log('赋值：', dep.value);


// 第二步
// let currentEffect;
// class Dep {
//     constructor(val) {
//         this.effects = new Set(); // 储存依赖当前变量的函数，并去重
//         this._val = val;
//     }
//     get value() {
//         this.depend();
//         return this._val;
//     }
//     set value(newVal) {
//         this._val = newVal
//         this.notice(); // 赋值时触发依赖
//     }
//     // 收集依赖
//     depend() {
//         if(currentEffect) { // 要记得判空
//             this.effects.add(currentEffect);
//         }
//     }
//     // 触发依赖
//     notice() {
//         this.effects.forEach(effect => {
//             effect();
//         });
//     }
// }
// const effectWatch = (effect) => {
//     currentEffect = effect;
//     effect(); // 别忘了首先就会执行一次
//     currentEffect = null;
// }

// const dep = new Dep(10);
// let b;
// effectWatch(() => {
//      b = dep.value + 10;
//      console.log('effectWatch', b);
// });
// dep.value = 20;


// 第三步
// let currentEffect;
// class Dep {
//     constructor(val) {
//         this.effects = new Set(); // 储存依赖当前变量的函数，并去重
//         this._val = val;
//     }
//     get value() {
//         this.depend();
//         return this._val;
//     }
//     set value(newVal) {
//         this._val = newVal
//         this.notice(); // 赋值时触发依赖
//     }
//     // 收集依赖
//     depend() {
//         if(currentEffect) { // 要记得判空
//             this.effects.add(currentEffect);
//         }
//     }
//     // 触发依赖
//     notice() {
//         this.effects.forEach(effect => {
//             effect();
//         });
//     }
// }
// const effectWatch = (effect) => {
//     currentEffect = effect;
//     effect(); // 别忘了首先就会执行一次
//     currentEffect = null;
// }
// const targetMap = new Map(); // 
// const reactive = (raw) => {
//     return new Proxy(raw, {
//         get(target, key) {
//             console.log('get----', target[key]);
//             return Reflect.get(target, key);
//         },
//         set(target, key, value) {
//             console.log('set----', key, value);
//             return Reflect.set(target, key, value);
//         }
//     });
// }
// const user = reactive({
//     name: '春赏百花冬观雪',
// });
// user.name;
// user.age = 24;
// user.age;


// 第四步
let currentEffect;
class Dep {
    constructor(val) {
        this.effects = new Set(); // 储存依赖当前变量的函数，并去重
        this._val = val;
    }
    get value() {
        this.depend();
        return this._val;
    }
    set value(newVal) {
        this._val = newVal
        this.notice(); // 赋值时触发依赖
    }
    // 收集依赖
    depend() {
        if(currentEffect) { // 要记得判空
            this.effects.add(currentEffect);
        }
    }
    // 触发依赖
    notice() {
        this.effects.forEach(effect => {
            effect();
        });
    }
}
const effectWatch = (effect) => {
    currentEffect = effect;
    effect(); // 别忘了首先就会执行一次
    currentEffect = null;
}
const targetMap = new Map();
const getDep = (target, key) => {
    let depsMap = targetMap.get(target); // target也需要一个容器储存
    if (!depsMap) {
        depsMap = new Map();
        targetMap.set(target, depsMap);
    }
    let dep = depsMap.get(key); // 并将dep与key建立连接
    if (!dep) {
        dep = new Dep();
        depsMap.set(key, dep);
    }
    return dep;
};
const reactive = (raw) => {
    return new Proxy(raw, {
        get(target, key) {
            // console.log('get----', target[key]);
            const dep = getDep(target, key);
            dep.depend(); // 当我们访问对象每个属性时，都会收集依赖
            return Reflect.get(target, key);
        },
        set(target, key, value) {
            // console.log('set----', key, value);
            const dep = getDep(target, key);
            const result = Reflect.set(target, key, value);
            dep.notice();
            return result;
        }
    });
}
const user = reactive({
    name: '春赏百花冬观雪',
});
effectWatch(() => {
    // user.name;
    console.log('effect---', user.name);
});
user.name = '晓看天色暮观云';