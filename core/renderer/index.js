/**
 * diff比对更新对应节点
 * @param {*} n1 旧的节点
 * @param {*} n2 新的节点
 */
export function diff(n1, n2) {
    if (n1.tag !== n2.tag) {
        //  前后两次的标签不一样，则更新标签
        n1.el.replaceWith(document.createElement(n2.tag));
    } else {
        n2.el = n1.el;

        const { props: newProps, children: newChildren } = n2;
        const { props: oldProps, children: oldChildren } = n1;
        if (newProps && oldProps) {
            Object.keys(newProps).forEach(key => {
                const newVal = newProps[key];
                const oldVal = oldProps[key];
                if (newVal !== oldVal) {
                    n1.el.setAttribute(key, newVal);
                }
            });
        }
        if (oldProps) {
            Object.keys(oldProps).forEach(key => {
                if (!newProps[key]) {
                    n1.el.removeAttribute(key);
                }
            });
        }
    }
}

// dom -do-> vdom
export function mountElement(vnode, container) {
    const { tag, props, children} = vnode;
    // 创建tag标签
    const el  = (vnode.el = document.createElement(tag));

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
