import { beforeAll, vi } from 'vitest'

// Clipboard mock
Object.defineProperty(navigator, 'clipboard', {
    value: {
        writeText: vi.fn(),
        readText: vi.fn()
    },
    configurable: true
})

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
