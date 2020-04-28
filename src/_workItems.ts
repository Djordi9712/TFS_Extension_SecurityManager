import WorkItemTracking = require("TFS/WorkItemTracking/RestClient");
import { Wiql, WorkItemExpand, WorkItem } from "TFS/WorkItemTracking/Contracts";
import { Relations } from "../dist/relations";
import { JsonPatchOperation, Operation } from "VSS/WebApi/Contracts";
import { VssHttpClient } from "VSS/WebApi/RestClient";
import { VssService } from "VSS/Service";

var noncopy: string[] = ["System.AreaPath", "System.AreaID", "System.IterationId",
    , "System.TeamProject", "System.IterationPath", "System.WorkItemType", "System.CreatedDate", "System.CreatedBy",
    "System.ChangedDate", "System.ChangedBy", "Microsoft.VSTS.Common.StateChangeDate", "Microsoft.VSTS.Common.Priority", "System.BoardColumn",
    "System.BoardColumnDone"];
export var rel = new Relations();
export var witClient = WorkItemTracking.getClient();

export class _workItem {
    id: number;
    name: string;

    constructor(id: number, name: string) {
        this.id = id;
        this.name = name
    }
}

export function getWorkItemIDs(project: string): Promise<number[]> {
    return new Promise((resolve) => {
        var ids: number[] = [];
        var wiql: Wiql = {
            query: "Select [State], [Title] " +
                "From WorkItems " +
                "Where [System.TeamProject] = '" + project + "' " +
                "And [System.State] <> 'Closed' " +
                "Order By [State] Asc, [Changed Date] Desc"
        };
        var x = witClient.queryByWiql(wiql).then(function (workItemQueryResult) {
            if (workItemQueryResult.workItems.length != 0) {
                workItemQueryResult.workItems.forEach(function (workItem) {
                    ids.push(workItem.id);
                })
                resolve(ids);
            }
            else {
                resolve(ids);
            }
        });
    })
}

export function createHierarchy(ids: number): Promise<any> {
    return new Promise((resolve) => {
        witClient.getWorkItems(ids, null, null, WorkItemExpand.Relations).then((workItems) => {
            rel.createWiHierarchy(workItems).then(() => { resolve() })
        })

    })
}

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

export function createworkItems(data: Map<number, number>, project: string) {
    var IDLinks = new Map<number, number>();
    var newIds: any[] = []
    data.forEach((priority, id) => {
        newIds.push(new Promise(async (resolve) => {
            var sourceItem = await witClient.getWorkItem(id, null, null, WorkItemExpand.Relations);
            var patchDoc = [];
            var fields: { [key: string]: any } = sourceItem.fields;
            for (let key in fields) {
                if (noncopy.findIndex(noncopyitem => noncopyitem == key) == -1) {
                    let patchOp: JsonPatchOperation = {
                        value: fields[key],
                        op: Operation.Add,
                        path: "/fields/" + key,
                        from: null
                    }
                    patchDoc.push(patchOp);
                }
            }
            patchDoc = assignPriority(patchDoc, priority);
            var targetItem = await witClient.createWorkItem(patchDoc, project, fields["System.WorkItemType"]);
            newIds.push(targetItem.id);
            IDLinks.set(sourceItem.id, targetItem.id);
            try {
                var patchOp = await rel.createRelations(IDLinks, sourceItem, targetItem);
                let patch = [];
                patch.push(patchOp);
                witClient.updateWorkItem(patch, targetItem.id);
            } catch (err) {
            }
            resolve(targetItem.id);
        })
        );
    });
    return Promise.all(newIds);

}

export function assignPriority(patchDoc: any, priority: number) {
    let patchOp: JsonPatchOperation = {
        value: priority,
        op: Operation.Add,
        path: "/fields/Microsoft.VSTS.Common.Priority",
        from: null
    }
    patchDoc.push(patchOp);
    return patchDoc;
}
