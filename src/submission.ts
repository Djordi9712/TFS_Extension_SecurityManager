/// <reference path="../node_modules/vss-web-extension-sdk/typings/tfs.d.ts"/>
import * as PerfectScrollbar from '../node_modules/perfect-scrollbar/dist/perfect-scrollbar';
import { deleteWorkItems } from "../dist/dev";



//$(document).ready(function () {
//    const container = document.querySelector('#submission-table');
//    const ps = new PerfectScrollbar(container);

//});

$(document).ready(() => {
    VSS.getService(VSS.ServiceIds.ExtensionData).then(function (dataService) {
        dataService.getValue("items").then(function (value) {
            $.each(value, (_, node) => {
                $('#submission-table').append("<tr><td>" + node.text + "</td><td>" + node.type + "</td><td>" + node.ancestor + "</td><td>" + node.priority + "</td>")
            });
        });
    });
});

$(document).ready(() => {
    var collectionUri: string = VSS.getWebContext().collection.uri;
    var project: string = VSS.getWebContext().project.name;
    var url: string = collectionUri + project + "/_backlogs?level=Epics&_a=backlog"

    $('#backlog').click(() => {
        VSS.getService(VSS.ServiceIds.Navigation).then(function (navigationService) {
            navigationService.navigate(url);
        });
    })
})

$(document).ready(() => {
    $('#revert').click(() => {
        VSS.getService(VSS.ServiceIds.ExtensionData).then(function (dataService) {
            dataService.getValue("newids").then(function (workItemIds) {
                deleteWorkItems(workItemIds);
            });
        });
    });
});

$(document).ready(() => {
    $('#import').click(() => {
        location.assign('main.html');
    });
});


function getBadgeClass(node) {
    var badgecolor = "";
    switch (node.type) {
        case "Bug":
            badgecolor = "#CC293D"
            break;
        case "Epic":
            badgecolor = "#FF7B00"
            break;
        case "Feature":
            badgecolor = "#773B93"
            break;
        case "User Story":
            badgecolor = "#009CCD"
            break;
        case "Task":
            badgecolor = "#F2CB1D";
            break;
        case "Issue":
            badgecolor = "#B4009E";
            break;
        case "Test Case":
            badgecolor = "#004B50"
            break;
    }
    return "Css-"
}
