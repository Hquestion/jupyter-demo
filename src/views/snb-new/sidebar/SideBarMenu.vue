<template>
    <div class="sidebar-menu"
         title="tooltip"
         :class="{active: sidebarManager.active === name}"
         @click="checkMenu"
    >
        <i :class="['sdx-icon', icon]"></i>
    </div>
</template>

<script>
export default {
    name: "SideBarMenu",
    props: {
        name: {
            type: String,
            default: ''
        },
        icon: {
            type: String,
            default: ''
        },
        tooltip: {
            type: String,
            default: ''
        },
        label: {
            type: String,
            default: ''
        }
    },
    inject: {
        sidebarManager: {
            default: {}
        },
        app: {
            default: {}
        }
    },
    methods: {
        checkMenu() {
            if (this.sidebarManager) {
                if (this.sidebarManager.active === this.name) {
                    this.sidebarManager.active = '';
                } else {
                    this.sidebarManager.active = this.name;
                }
            } else {
                this.$emit('check-menu', this.name);
            }
        }
    }
}
</script>

<style scoped>

</style>
