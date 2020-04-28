var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
define(["require", "exports", "TFS/WorkItemTracking/RestClient", "TFS/WorkItemTracking/Contracts", "../dist/relations", "VSS/WebApi/Contracts"], function (require, exports, WorkItemTracking, Contracts_1, relations_1, Contracts_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var noncopy = ["System.AreaPath", "System.AreaID", "System.IterationId",
        ,
        "System.TeamProject", "System.IterationPath", "System.WorkItemType", "System.CreatedDate", "System.CreatedBy",
        "System.ChangedDate", "System.ChangedBy", "Microsoft.VSTS.Common.StateChangeDate", "Microsoft.VSTS.Common.Priority", "System.BoardColumn",
        "System.BoardColumnDone"];
    exports.rel = new relations_1.Relations();
    exports.witClient = WorkItemTracking.getClient();
    var _workItem = /** @class */ (function () {
        function _workItem(id, name) {
            this.id = id;
            this.name = name;
        }
        return _workItem;
    }());
    exports._workItem = _workItem;
    function getWorkItemIDs(project) {
        return new Promise(function (resolve) {
            var ids = [];
            var wiql = {
                query: "Select [State], [Title] " +
                    "From WorkItems " +
                    "Where [System.TeamProject] = '" + project + "' " +
                    "And [System.State] <> 'Closed' " +
                    "Order By [State] Asc, [Changed Date] Desc"
            };
            var x = exports.witClient.queryByWiql(wiql).then(function (workItemQueryResult) {
                if (workItemQueryResult.workItems.length != 0) {
                    workItemQueryResult.workItems.forEach(function (workItem) {
                        ids.push(workItem.id);
                    });
                    resolve(ids);
                }
                else {
                    resolve(ids);
                }
            });
        });
    }
    exports.getWorkItemIDs = getWorkItemIDs;
    function createHierarchy(ids) {
        return new Promise(function (resolve) {
            exports.witClient.getWorkItems(ids, null, null, Contracts_1.WorkItemExpand.Relations).then(function (workItems) {
                exports.rel.createWiHierarchy(workItems).then(function () { resolve(); });
            });
        });
    }
    exports.createHierarchy = createHierarchy;
    //export function getEpics(ids: number[]): Promise<_workItem[]> {
    //    return new Promise((resolve) => {
    //        var epics: _workItem[] = [];
    //        var epicIDs: number[] = []
    //        if (ids.length != 0) {
    //            witClient.getWorkItems(ids, null, null, WorkItemExpand.Relations).then((workItems) => {
    //                rel.createWiHierarchy(workItems);
    //                workItems.forEach((workItem) => {
    //                    if (workItem.fields["System.WorkItemType"] == "Epic") {
    //                        let epic = new _workItem(workItem.id, workItem.fields["System.Title"])
    //                        epics.push(epic);
    //                        epicIDs.push(epic.id);
    //                    }
    //                });
    //                resolve(epics);
    //            });
    //        }
    //        else {
    //            resolve(epics);
    //        }
    //    });
    //}
    function createworkItems(data, project) {
        var _this = this;
        var IDLinks = new Map();
        var newIds = [];
        data.forEach(function (priority, id) {
            newIds.push(new Promise(function (resolve) { return __awaiter(_this, void 0, void 0, function () {
                var sourceItem, patchDoc, fields, _loop_1, key, targetItem, patchOp, patch, err_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, exports.witClient.getWorkItem(id, null, null, Contracts_1.WorkItemExpand.Relations)];
                        case 1:
                            sourceItem = _a.sent();
                            patchDoc = [];
                            fields = sourceItem.fields;
                            _loop_1 = function (key) {
                                if (noncopy.findIndex(function (noncopyitem) { return noncopyitem == key; }) == -1) {
                                    var patchOp_1 = {
                                        value: fields[key],
                                        op: Contracts_2.Operation.Add,
                                        path: "/fields/" + key,
                                        from: null
                                    };
                                    patchDoc.push(patchOp_1);
                                }
                            };
                            for (key in fields) {
                                _loop_1(key);
                            }
                            patchDoc = assignPriority(patchDoc, priority);
                            return [4 /*yield*/, exports.witClient.createWorkItem(patchDoc, project, fields["System.WorkItemType"])];
                        case 2:
                            targetItem = _a.sent();
                            newIds.push(targetItem.id);
                            IDLinks.set(sourceItem.id, targetItem.id);
                            _a.label = 3;
                        case 3:
                            _a.trys.push([3, 5, , 6]);
                            return [4 /*yield*/, exports.rel.createRelations(IDLinks, sourceItem, targetItem)];
                        case 4:
                            patchOp = _a.sent();
                            patch = [];
                            patch.push(patchOp);
                            exports.witClient.updateWorkItem(patch, targetItem.id);
                            return [3 /*break*/, 6];
                        case 5:
                            err_1 = _a.sent();
                            return [3 /*break*/, 6];
                        case 6:
                            resolve(targetItem.id);
                            return [2 /*return*/];
                    }
                });
            }); }));
        });
        return Promise.all(newIds);
    }
    exports.createworkItems = createworkItems;
    function assignPriority(patchDoc, priority) {
        var patchOp = {
            value: priority,
            op: Contracts_2.Operation.Add,
            path: "/fields/Microsoft.VSTS.Common.Priority",
            from: null
        };
        patchDoc.push(patchOp);
        return patchDoc;
    }
    exports.assignPriority = assignPriority;
});
