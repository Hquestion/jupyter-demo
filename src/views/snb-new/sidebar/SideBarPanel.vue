<template>
    <div class="sidebar-panel"
         :class="[
            collapse ? 'is-collapse': '',
            `is-sidebar-${sidebarPosition}`
         ]"
    >
        <div class="sidebar-track">
            <slot name="menu"></slot>
        </div>
        <div class="sidebar-content" v-show="contentVisible">
            <slot name="content"></slot>
        </div>
    </div>
</template>

<script>
export default {
    name: "SideBarPanel",
    inject: {
        app: {
            default: {}
        }
    },
    provide() {
        return {
            sidebarManager: this
        };
    },
    props: {
        collapse: {
            type: Boolean,
            default: false
        },
        value: {
            type: String,
            default: ''
        }
    },
    data() {
        return {

        };
    },
    computed: {
        contentVisible: {
            get() {
                return !this.collapse && this.active !== '';
            },
            set(val) {
                this.$emit('update:collapse', !val);
                !val && (this.active = '');
            }
        },
        sidebarPosition() {
            return this.app.config.position.sidebar;
        },
        active: {
            get() {
                return this.value;
            },
            set(val) {
                if (val) {
                    this.contentVisible = true;
                }
                this.$emit('input', val);
            }
        }
    },
    watch: {
        contentVisible(val) {
            this.$emit('update:collapse', !val);
        }
    },
    mounted() {
        console.log(this.app);
    }
}
</script>

<style lang="scss" scoped>
    .sidebar-panel {
        width: 280px;
        position: absolute;
        top: 0;
        bottom: 0;
        .sidebar-track {
            position: absolute;
            width: 56px;
            top: 0;
            bottom: 0;
            background: #191F36;
        }
        .sidebar-content {
            position: absolute;
            width: 224px;
            top: 0;
            bottom: 0;
            background: #404965;
        }
        &.is-collapse {
            width: 56px;
        }
        &.is-sidebar-left {
            left: 0;
            .sidebar-track {
                left: 0;
            }
            .sidebar-content {
                left: 56px;
            }
        }
        &.is-sidebar-right {
            right: 0;
            .sidebar-track {
                right: 0;
            }
            .sidebar-content {
                right: 56px;
            }
        }

    }
</style>
