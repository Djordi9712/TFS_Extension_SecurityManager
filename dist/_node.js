define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Node = /** @class */ (function () {
        function Node(id, parent, children, title, type, ancestor) {
            this.id = id;
            this.parent = parent;
            this.children = children;
            this.title = title;
            this.type = type;
            this.ancestor = ancestor;
        }
        return Node;
    }());
    exports.Node = Node;
});
//
