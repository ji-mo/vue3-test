import { effectWatch } from "./reactivity/index.js";
import { mountElement } from "./renderer/index.js";
export function createApp(rootComponent) {
    return {
        mount(rootContainer) {
            // 将{ state }对象拿到
            const context = rootComponent.setup();
            effectWatch(() => {
                rootContainer.innerHTML = ``;
                // 将state渲染到容器中
                const subTree = rootComponent.render(context);
                console.log('subTree----', subTree);
                mountElement(subTree, rootContainer);
                // rootContainer.append(element);
            });
        }
    }
}