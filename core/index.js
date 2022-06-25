import { effectWatch } from "./reactivity/index.js";
import { diff, mountElement } from "./renderer/index.js";
export function createApp(rootComponent) {
    return {
        mount(rootContainer) {
            const context = rootComponent.setup(); // 将setup返回值拿到
            let isMounted = false; // 是否首次挂载，否则diff算法比对
            let prevSubTree = null; // 储存老的vdom
            effectWatch(() => {
                if (!isMounted) {
                    isMounted = true; // 置为true
                    rootContainer.innerHTML = ``;
                    // 将setup返回值渲染到容器中
                    const subTree = rootComponent.render(context);
                    console.log('subTree----', subTree);
                    mountElement(subTree, rootContainer);
                    prevSubTree = subTree; // 储存当前vdom
                } else {
                    const subTree = rootComponent.render(context);
                    diff(prevSubTree, subTree);
                    prevSubTree = subTree; // 储存当前vdom
                }
            });
        }
    }
}