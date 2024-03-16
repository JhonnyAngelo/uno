export default function ObjectList() {
    this.list = [];
}

ObjectList.prototype.add = function(object) {
    this.list.push(object);
}

ObjectList.prototype.getByIndex = function(index) {
    return this.list[index];
}

ObjectList.prototype.getAll = function() {
    return this.list;
}

ObjectList.prototype.deleteByIndex = function(index) {
    this.list.splice(index, 1);
}