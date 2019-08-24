<template>
    <div class="CellWrapper">
        <Cell
            v-for="item in cells"
            :key="item.order"
            v-model="item.code"
            :meta="item"
            :read-only="mode === 'debug'"
            @run="handleCellRun"
        />
    </div>
</template>

<script>
import Cell from './Cell';
export default {
    name: 'CellWrapper',
    componentName: 'CellWrapper',
    data() {
        return {
            focus: 0,
            active: 0
        };
    },
    provide() {
        return {
            cellManager: this
        }
    },
    components: {
        Cell
    },
    props: {
        cells: {
            type: Array,
            default: () => []
        },
        mode: {
            type: String,
            default: 'edit'
        }
    },
    methods: {
        handleCellRun() {}
    },
    mounted() {
    }
}
</script>

<style lang="scss" scoped>

</style>
