<template>
    <div class="sidebar-content" v-show="visible">
        <slot></slot>
    </div>
</template>

<script>
export default {
    name: "SideBarContent",
    data() {
        return {};
    },
    inject: {
        sidebarManager: {
            default: {}
        }
    },
    props: {
        name: {
            type: String,
            default: ''
        }
    },
    computed: {
        visible() {
            return this.name === this.sidebarManager.active;
        }
    }
}
</script>

<style scoped>

</style>
