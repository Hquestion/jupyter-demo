<template>
    <div class="sidebar-tracker">
        <div class="sidebar-tracker-header">
            <slot name="header"></slot>
        </div>

        <div class="sidebar-tracker-footer">
            <slot name="footer"></slot>
        </div>
    </div>
</template>

<script>
export default {
    name: "SidebarTracker"
}
</script>

<style lang="scss" scoped>
.sidebar-tracker {
    position: absolute;
    
}
</style>
