<template>
    <div class="snb-panel" :style="rect">
        <slot></slot>
    </div>
</template>

<script>
import emitter from '../../../mixins/emitter';
import interact from 'interactjs';
export default {
    name: "Panel",
    componentName: 'Panel',
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
        }
    },
    data() {
        return {
            ready: false,
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
            }
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
            await this.ready;
            const children = this.$children;
            if (children.length >= 1) {
                const initWidths = children.map(child => child.initWidth);
                const initHeights = children.map(child => child.initHeight);
                let assignedWidth = 0, assignedHeight = 0;
                initWidths.forEach(w => {
                    assignedWidth = (w > -1) ? (assignedWidth + w) : assignedWidth
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
                        toAssignedChildren.reduce((a, b) => total = a + b);

                        child.width = this.width;
                        child.height = Math.max(child.minHeight, child.initHeight > -1 ? child.initHeight : canAssignedHeight * child.weight / total);
                        child.top = assigned;
                        child.left = 0;
                        assigned += child.height;
                        if (index < children.length) {
                            interact(child.$el)
                                .resizable({
                                    edges: {
                                        top: false,
                                        left: false,
                                        bottom: true,
                                        right: false
                                    }
                                });
                        }
                    } else {
                        let total = 0, canAssignedWidth = (this.width - assignedWidth) || 0;
                        let toAssignedChildren = children.filter(item => item.initWidth < 0).map(item => item.weight);
                        toAssignedChildren.reduce((a, b) => total = a + b);

                        child.width = Math.max(child.minWidth, child.initWidth > -1 ? child.initWidth : canAssignedWidth * child.weight / total);
                        child.height = this.height;
                        child.left = assigned;
                        child.top = 0;
                        assigned += child.width;
                        if (index < children.length -1) {
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
                                    children[index+1].width = children[index+1].width - dist;
                                    children[index+1].left = children[index+1].left + dist;

                                    child.width = e.rect.width;

                                    // this.updateChildren();
                                })
                            ;
                        }
                    }

                });
            }
        },
        handleResize() {
            clearTimeout(this.timer);
            this.timer = setTimeout(() => {
                this.init();
                this.updateChildren();
            }, 500);
        }
    },
    async updated() {
        await this.updateChildren();
    },
    created() {
        this.$on('panel-added', () => {
            this.updateChildren();
        });
    },
    mounted() {
        this.init();
        this.dispatch('Panel', 'panel-added', this);
        window.addEventListener('resize', this.handleResize);
        requestAnimationFrame(() => {
            this.ready = Promise.resolve();
        });
    },
    beforeDestroy() {
        this.dispatch('Panel', 'panel-minus', this);
        window.removeEventListener('resize', this.handleResize);
    }
}
</script>

<style lang="scss" scoped>
    .snb-panel {
        position: absolute;
        border: 1px solid #dedede;
    }
</style>
