import * as wi from "../dist/_workItems";

export function deleteWorkItemsProject() {
    wi.getWorkItemIDs("TFS_Target").then((res) => {
        res.forEach((id) => {
            wi.witClient.deleteWorkItem(id);
        })
    })
}

export function deleteWorkItems(deleteList: any[]) {
    deleteList.forEach((id) => {
        wi.witClient.deleteWorkItem(id)
    });
}
