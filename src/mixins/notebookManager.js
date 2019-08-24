let order = 0;

export class Cell {
    constructor(options) {
        this.order = options.order || 0;
        this.cell_type = options.mode || 'python';
        this.status = options.status || 'idle';
        this.code = options.code || '';
        this.result = options.result || '';
        this.execCount = options.execCount || 0;
        this.editable = options.editable || true;
    }
}

function generateOrder() {
    return order++;
}

export default {
    methods: {
        createCell() {
            return new Cell({
                order: generateOrder()
            });
        },
        insertCell(list, index) {
            const cell = this.createCell();
            if (typeof index === 'undefined' || index < 0) {
                list.push(cell);
            } else {
                list.splice(index, 1, cell);
            }
        },
        moveCell(list, cell, index) {
            let cellIndex = list.findIndex(item => item.order === cell.order);
            if (cellIndex === index) return;
            if (cellIndex > index) {
                list.splice(cellIndex, 1);
                list.splice(index, 1, cell);
            } else {
                list.splice(index, 1, cell);
                list.splice(cellIndex, 1);
            }
        }
    }
}
