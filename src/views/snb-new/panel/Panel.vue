<template>
    <div class="resizable-panel" :style="rect">
        <slot></slot>
    </div>
</template>

<script>
import emitter from '@sdx/utils/src/mixins/emitter';
import interact from 'interactjs';
export default {
    name: 'ResizablePanel',
    componentName: 'ResizablePanel',
    mixins: [emitter],
    props: {
        childDirection: {
            type: String,
            default: 'vertical'
        },
        weight: {
            type: Number,
            default: 1
        },
        initWidth: {
            type: Number,
            default: -1
        },
        initHeight: {
            type: Number,
            default: -1
        },
        minWidth: {
            type: Number,
            default: 20
        },
        minHeight: {
            type: Number,
            default: 20
        },
        order: {
            type: Number,
            default: 1
        },
        fixed: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            ready: new Promise(resolve => {
                this.resolve = resolve;
            }),
            width: 0,
            height: 0,
            left: 0,
            top: 0
        };
    },
    computed: {
        rect() {
            return {
                width: `${this.width}px`,
                height: `${this.height}px`,
                left: `${this.left}px`,
                top: `${this.top}px`
            };
        }
    },
    methods: {
        init() {
            // step1. 获取父节点宽度高度，设置父容器定位
            // step2. 获取所有子panel， 根据ratio和initWidth分配宽度
            const parentBox = this.$el.parentNode.getBoundingClientRect();
            this.width = parentBox.width;
            this.height = parentBox.height;
        },
        async updateChildren() {
            if (!this.isRootPanel()) {
                await this.$parent.ready;
            }
            const children = this.$children;
            if (children.length >= 1 && children[0].$options.componentName === 'ResizablePanel') {
                const initWidths = children.map(child => child.initWidth);
                const initHeights = children.map(child => child.initHeight);
                let assignedWidth = 0, assignedHeight = 0;
                initWidths.forEach(w => {
                    assignedWidth = (w > -1) ? (assignedWidth + w) : assignedWidth;
                });
                initHeights.forEach(h => {
                    assignedHeight = (h > -1) ? (assignedHeight + h) : assignedHeight;
                });
                let assigned = 0;
                children.forEach((child, index) => {
                    // 垂直的分配高度，水平的分配宽度
                    if (this.childDirection === 'vertical') {
                        let total = 0, canAssignedHeight = (this.height - assignedHeight) || 0;
                        let toAssignedChildren = children.filter(item => item.initHeight < 0).map(item => item.weight);
                        toAssignedChildren.forEach(item => total = total + item);

                        child.width = this.width;
                        if (!child.assigned) {
                            child.height = Math.max(child.minHeight, child.initHeight > -1 ? child.initHeight : canAssignedHeight * child.weight / total);
                        }
                        child.top = assigned;
                        child.left = 0;
                        child.assigned = true;
                        assigned += child.height;
                        if (index < children.length - 1) {
                            child.$el.style.borderBottom = '1px solid #dedede';
                            let nextChild = children[index+1];
                            if (child.fixed || nextChild.fixed) {
                                return;
                            }
                            interact(child.$el)
                                .resizable({
                                    edges: {
                                        top: false,
                                        left: false,
                                        bottom: true,
                                        right: false
                                    }
                                })
                                .on('resizemove', (e) => {
                                    let dist = e.rect.height - child.height;
                                    let height = nextChild.height - dist;
                                    if (height > nextChild.minHeight && e.rect.height > this.minHeight) {
                                        nextChild.height = nextChild.height - dist;
                                        nextChild.top = nextChild.top + dist;

                                        child.height = e.rect.height;
                                    }
                                });
                        }
                    } else {
                        let total = 0, canAssignedWidth = (this.width - assignedWidth) || 0;
                        let toAssignedChildren = children.filter(item => item.initWidth < 0).map(item => item.weight);
                        toAssignedChildren.forEach(item => total = total + item);

                        if (!child.assigned) {
                            child.width = Math.max(child.minWidth, child.initWidth > -1 ? child.initWidth : canAssignedWidth * child.weight / total);
                        }
                        child.height = this.height;
                        child.left = assigned;
                        child.top = 0;
                        child.assigned = true;
                        assigned += child.width;
                        if (index < children.length -1) {
                            child.$el.style.borderRight = '1px solid #dedede';
                            let nextChild = children[index+1];
                            if (child.fixed || nextChild.fixed) {
                                return;
                            }
                            interact(child.$el)
                                .resizable({
                                    edges: {
                                        top: false,
                                        left: false,
                                        bottom: false,
                                        right: true
                                    }
                                })
                                .on('resizemove', (e) => {
                                    let dist = e.rect.width - child.width;
                                    let width = nextChild.width - dist;
                                    if (width > nextChild.minWidth && e.rect.width > this.minWidth) {
                                        nextChild.width = nextChild.width - dist;
                                        nextChild.left = nextChild.left + dist;

                                        child.width = e.rect.width;
                                    }
                                })
                            ;
                        }
                    }

                });
            }
            requestAnimationFrame(() => {
                this.resolve(true);
            });
        },
        handleResize() {
            clearTimeout(this.timer);
            this.timer = setTimeout(() => {
                this.init();
                this.updateChildren();
            }, 200);
        },
        isRootPanel() {
            return !this.$parent || this.$parent.$options.componentName !== 'ResizablePanel';
        }
    },
    updated() {
        this.updateChildren();
    },
    created() {
        this.$on('panel-added', () => {
            clearTimeout(this.changeTimer);
            this.changeTimer = setTimeout(() => {
                this.updateChildren();
            }, 500);
        });
        this.$on('panel-minus', () => {
            clearTimeout(this.changeTimer);
            this.changeTimer = setTimeout(() => {
                this.updateChildren();
            }, 500);
        });
    },
    mounted() {
        if (this.isRootPanel()) {
            this.init();
        }
        this.dispatch('ResizablePanel', 'panel-added', this);
        window.addEventListener('resize', this.handleResize);
    },
    beforeDestroy() {
        this.dispatch('ResizablePanel', 'panel-minus', this);
        window.removeEventListener('resize', this.handleResize);
    }
};
</script>

<style lang="scss" scoped>
    .resizable-panel {
        position: absolute;
        touch-action: none;
    }
</style>
