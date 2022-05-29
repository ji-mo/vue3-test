// dom -do-> vdom
export function mountElement(vnode, container) {
    const { tag, props, children} = vnode;
    // 创建tag标签
    const el  = document.createElement(tag);

    // 创建props属性
    if (props) {
        for(const key in props) {
            const val = props[key];
            el.setAttribute(key, val);
        }
    }

    // 创建children
    // 1. 字符
    if (typeof children === 'string') {
        const textNode = document.createTextNode(children);
        el.append(textNode);
    } else if (Array.isArray(children)) {
        // 2. 数组
        children.forEach(child => {
            mountElement(child, el);
        })
    }

    // 插入根元素
    container.append(el);
}
