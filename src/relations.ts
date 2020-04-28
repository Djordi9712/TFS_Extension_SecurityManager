/// <reference path="../node_modules/vss-web-extension-sdk/typings/tfs.d.ts"/>
import { Node } from "./_node"
import { WorkItem, WorkItemRelation, WorkItemLink } from "TFS/WorkItemTracking/Contracts";
import { JsonPatchOperation, Operation } from "VSS/WebApi/Contracts";
import * as wi from "../dist/_workItems"

export class Relations {

    workItemHierarchy: Node[];

    createWiHierarchy(workitems: WorkItem[]): Promise<Node[]> {
        return new Promise((resolve) => { 
        var order = ["Epic", "Feature", "User Story", "Task", "Bug"];
        var hierarchy: Node[] = [];
        workitems.forEach((workitem) => {
            var id: number = workitem.id;
            var parent: number = null;
            var children: number[] = []
            if (workitem.relations != null) {
                workitem.relations.forEach((relation) => {
                    if (relation.rel == "System.LinkTypes.Hierarchy-Reverse") {
                        parent = parseInt(relation.url.split("workItems/")[1])
                    }
                    else if (relation.rel == "System.LinkTypes.Hierarchy-Forward") {
                        children.push(parseInt(relation.url.split("workItems/")[1]))
                    }
                });
            }
            let title = workitem.fields["System.Title"];
            let type = workitem.fields["System.WorkItemType"];
            let ancestor = "";           
            let node = new Node(id, parent, children, title, type, ancestor);
            hierarchy.push(node);
        });
        hierarchy.sort((a, b) => {
            return order.indexOf(a.type) - order.indexOf(b.type);
        })
            this.workItemHierarchy = this.setAncestors(hierarchy);
            resolve(this.workItemHierarchy)
        })
    }

    setAncestors(hierarchy: Node[]): Node[] {
        hierarchy.forEach((item) => {
            function searchNodes(node: Node) {
                let parent = node.parent;
                if (parent == null) {
                    item.ancestor = node.title;
                }
                else {
                    let parentNode = hierarchy.find(x => x.id == parent);
                    searchNodes(parentNode);
                }
            }   
            searchNodes(item);
        })    
        return hierarchy;
    }

    getDescendants(epics: number[], relations: Node[]): number[] {
        var children: number[] = []
        var temp: number[] = epics;
        var final: number[] = epics;
        console.log(relations);
        while (temp.length > 0) {
            temp.forEach((id) => {
                console.log(id);
                var node: Node = relations.find(i => i.id == id);
                if (node.children.length > 0) {
                    node.children.forEach((child) => {
                        final.push(child);
                        children.push(child);
                    })
                }
            })
            temp = [];
            children.forEach((child) => {
                temp.push(child);
            })
            children = []
        }
        console.log(final);
        wi.rel.workItemHierarchy.sort((a, b) => {
            console.log(final.indexOf(a.id) - final.indexOf(b.id));
            return final.indexOf(a.id) - final.indexOf(b.id);
        })



        return final;
    }

    createRelations(IDLinks: Map<number, number>, sourceItem: WorkItem, targetItem: WorkItem): Promise<JsonPatchOperation> {
        return new Promise((resolve, reject) => {
            if (sourceItem.relations != null) {
                var sourceParent: WorkItemRelation = sourceItem.relations.find(i => i.rel == "System.LinkTypes.Hierarchy-Reverse");
                if (sourceParent != null) {
                    var s_linkID: number = parseInt(sourceParent.url.split("workItems/")[1]);
                    var t_linkID: number = IDLinks.get(s_linkID);
                    let patchOp: JsonPatchOperation = {
                        op: Operation.Add,
                        "path": "/relations/-",
                        "value": {
                            "rel": "System.LinkTypes.Hierarchy-Reverse",
                            "url": sourceParent.url.split("workItems/")[0] + "workItems/" + t_linkID.toString()
                        },
                        from: null

                    }
                    resolve(patchOp);
                }
                else { reject("no source parent"); }

            }
            else { reject("no relation"); }
        })
    }
}