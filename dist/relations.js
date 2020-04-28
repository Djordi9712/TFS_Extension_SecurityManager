define(["require", "exports", "./_node", "VSS/WebApi/Contracts", "../dist/_workItems"], function (require, exports, _node_1, Contracts_1, wi) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Relations = /** @class */ (function () {
        function Relations() {
        }
        Relations.prototype.createWiHierarchy = function (workitems) {
            var _this = this;
            return new Promise(function (resolve) {
                var order = ["Epic", "Feature", "User Story", "Task", "Bug"];
                var hierarchy = [];
                workitems.forEach(function (workitem) {
                    var id = workitem.id;
                    var parent = null;
                    var children = [];
                    if (workitem.relations != null) {
                        workitem.relations.forEach(function (relation) {
                            if (relation.rel == "System.LinkTypes.Hierarchy-Reverse") {
                                parent = parseInt(relation.url.split("workItems/")[1]);
                            }
                            else if (relation.rel == "System.LinkTypes.Hierarchy-Forward") {
                                children.push(parseInt(relation.url.split("workItems/")[1]));
                            }
                        });
                    }
                    var title = workitem.fields["System.Title"];
                    var type = workitem.fields["System.WorkItemType"];
                    var ancestor = "";
                    var node = new _node_1.Node(id, parent, children, title, type, ancestor);
                    hierarchy.push(node);
                });
                hierarchy.sort(function (a, b) {
                    return order.indexOf(a.type) - order.indexOf(b.type);
                });
                _this.workItemHierarchy = _this.setAncestors(hierarchy);
                resolve(_this.workItemHierarchy);
            });
        };
        Relations.prototype.setAncestors = function (hierarchy) {
            hierarchy.forEach(function (item) {
                function searchNodes(node) {
                    var parent = node.parent;
                    if (parent == null) {
                        item.ancestor = node.title;
                    }
                    else {
                        var parentNode = hierarchy.find(function (x) { return x.id == parent; });
                        searchNodes(parentNode);
                    }
                }
                searchNodes(item);
            });
            return hierarchy;
        };
        Relations.prototype.getDescendants = function (epics, relations) {
            var children = [];
            var temp = epics;
            var final = epics;
            console.log(relations);
            while (temp.length > 0) {
                temp.forEach(function (id) {
                    console.log(id);
                    var node = relations.find(function (i) { return i.id == id; });
                    if (node.children.length > 0) {
                        node.children.forEach(function (child) {
                            final.push(child);
                            children.push(child);
                        });
                    }
                });
                temp = [];
                children.forEach(function (child) {
                    temp.push(child);
                });
                children = [];
            }
            console.log(final);
            wi.rel.workItemHierarchy.sort(function (a, b) {
                console.log(final.indexOf(a.id) - final.indexOf(b.id));
                return final.indexOf(a.id) - final.indexOf(b.id);
            });
            return final;
        };
        Relations.prototype.createRelations = function (IDLinks, sourceItem, targetItem) {
            return new Promise(function (resolve, reject) {
                if (sourceItem.relations != null) {
                    var sourceParent = sourceItem.relations.find(function (i) { return i.rel == "System.LinkTypes.Hierarchy-Reverse"; });
                    if (sourceParent != null) {
                        var s_linkID = parseInt(sourceParent.url.split("workItems/")[1]);
                        var t_linkID = IDLinks.get(s_linkID);
                        var patchOp = {
                            op: Contracts_1.Operation.Add,
                            "path": "/relations/-",
                            "value": {
                                "rel": "System.LinkTypes.Hierarchy-Reverse",
                                "url": sourceParent.url.split("workItems/")[0] + "workItems/" + t_linkID.toString()
                            },
                            from: null
                        };
                        resolve(patchOp);
                    }
                    else {
                        reject("no source parent");
                    }
                }
                else {
                    reject("no relation");
                }
            });
        };
        return Relations;
    }());
    exports.Relations = Relations;
});
