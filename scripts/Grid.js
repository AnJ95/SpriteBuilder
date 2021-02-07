import { ItemManager } from "./ItemManager.js";
import { getBlockSize } from "./ui.js";

const MARGIN = 5
class _Grid {
    constructor () {
        this.grid = null
        this.element = null
        // default values get overwritten by reset
        this.rows = 4
        this.columns = 4
        this.itemCount = 1
        this.currentBlockSize = 32
    }

    init (element) {
        this.element = element
        this.grid = new Muuri(element, {
            dragEnabled: true,
            items: ".item",
            dragPlaceholder: {
                enabled: true
            },
            dragSortPredicate: {
                action: "swap",
                migrateAction: "swap"
            }
        })

        this.grid.on("dragStart", evt => {
            globalThis.dragging = true
        })

        this.grid.on("dragEnd", evt => {
            globalThis.dragging = false
        })

        this.reset()
    }

    getLayout () {
        return {
            rows: this.rows,
            columns: this.columns,
            blockSize: this.currentBlockSize,
            margin: MARGIN
        }
    }

    getContainer () {
        return this.element
    }

    reset () {
        this.rows = 4
        this.columns = 4
        this.itemCount = 1
        this.currentBlockSize = getBlockSize()
        this.removeAllItems()
        this.updateContainerSize()
        this.addPlaceholder(16)
    }

    removeAllItems() {
        const items = this.grid.getItems()
        this.grid.remove(items, { layout: false, removeElements: true })
        ItemManager.reset()
    }

    setDraggable (value) {
        this.grid.updateSettings({ //todo dev version
            dragEnabled: !!value
        })
    }

    addRow () {
        this.rows += 1
        this.updateContainerSize()
        this.addPlaceholder(this.columns)
    }

    addColumn () {
        const indexList = new Array(this.rows).fill(0).map((value, index) => {
            return this.columns * (index + 1) + index
        })
        this.columns += 1
        this.updateContainerSize()
        this.addPlaceholder(this.rows, indexList)
    }

    removeItems (elements) {
        this.itemCount -= elements.length
        const items = this.grid.getItems(elements)
        this.grid.remove(items, { layout: false, removeElements: true });
    }

    addItem (element) {
        this.grid.add(element, { layout: false, index: -1 })
        this.itemCount += 1
    }

    addPlaceholder (items, indexList) {
        for(let i = 0; i < items; i++) {
            const item = ItemManager.createItem()
            item.classList.add("empty-item")

            const itemContent = item.querySelector(".item-content")
            itemContent.innerText = i + this.itemCount

            const index = Array.isArray(indexList) ? indexList[i] : -1
            this.grid.add(item, { layout: false, index: index })
        }
        this.itemCount += items
        this.grid.layout()
    }

    updateContainerSize (ignoreMargin = false) {
        const margin = ignoreMargin ? 0 : MARGIN
        this.element.style.width = this.currentBlockSize * this.columns + margin * 2 * this.columns + "px"
        this.element.style.height = this.currentBlockSize * this.rows + margin * 2 * this.rows + "px"
    }

    updateLayout () {
        this.grid.layout()
    }

    refreshAll () {
        const items = this.grid.getItems()

        this.grid.hide(items, { instant: true })
        this.grid.show(items, { instant: true, layout: "instant" })
    }

    getItemPosition (element) {
        const item = this.grid.getItem(element)
        return {
            top: item.top,
            left: item.left,
        }
        // return item && item.getPosition() //todo dev version
    }
}

export const Grid = new _Grid()