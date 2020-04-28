define(["require", "exports", "../dist/_workItems"], function (require, exports, wi) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function deleteWorkItemsProject() {
        wi.getWorkItemIDs("TFS_Target").then(function (res) {
            res.forEach(function (id) {
                wi.witClient.deleteWorkItem(id);
            });
        });
    }
    exports.deleteWorkItemsProject = deleteWorkItemsProject;
    function deleteWorkItems(deleteList) {
        deleteList.forEach(function (id) {
            wi.witClient.deleteWorkItem(id);
        });
    }
    exports.deleteWorkItems = deleteWorkItems;
});
