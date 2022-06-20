// const { reactive, effect } = require("@vue/reactivity");
import { reactive, effectWatch } from "./core/reactivity/index.js";
// const { reactive, effectWatch } = require("./core/reactivity/index.js");
// import { reactive, effect } from "./node_modules/@vue/reactivity";

let a = reactive({
    value: 1,
});
let b;
// 自动执行一次
effectWatch(() => {
    b = a.value + 10;
    console.log(b);
});
a.value = 10; // 响应式对象变化时effect执行

// 第一步
// const App = {
//     render(context) {
//         effectWatch(() => {
//             // reset
//             document.body.innerText = '';
//             const div = document.createElement("div");
//             div.innerText = context.state.count;
//             // root
//             document.body.append(div);
//         });
//     },
//     setup() {
//         const state = reactive({
//             count: 0,
//         });
//         window.state = state; // 用于调试
//         return {
//             state
//         };
//     }
// }


// 第二步
// export default {
//     render(context) {
//             // reset
//             const div = document.createElement("div");
//             div.innerText = context.state.count;
//             // root
//             return div;
//     },
//     setup() {
//         const state = reactive({
//             count: 0,
//         });
//         window.state = state;
//         return { state };
//     },
// }


// 第三步
import h from './core/h.js';
export default {
    render(context) {
        // return h('div', { id: 'appId', class: 'name' }, String(context.state.count));
        return h(
            'div',
            { id: 'appId'+context.state.count, class: 'name' },
            [h('p', { class: 'text' }, String(context.state.count)),
            h('span', null, 'span标签')]
        );
    },
    setup() {
        const state = reactive({
            count: 0,
        });
        window.state = state;
        return { state };
    }
}