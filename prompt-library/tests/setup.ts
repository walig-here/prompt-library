import { beforeAll } from 'vitest'

beforeAll(() => {
    // Polyfill HTMLDialogElement methods for JSDOM
    HTMLDialogElement.prototype.show = function () {
        this.open = true
    }

    HTMLDialogElement.prototype.showModal = function () {
        this.open = true
    }

    HTMLDialogElement.prototype.close = function () {
        this.open = false
    }
})
