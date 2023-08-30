const list = new Set;

export default {
    on(fn) {
        list.add(fn);
    },
    off(fn) {
        list.delete(fn);
    },
    emit(data) {
        [...list].map(fn => fn(data));
    },
};