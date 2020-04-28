define(["require", "exports", "../dist/dev"], function (require, exports, dev_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    //$(document).ready(function () {
    //    const container = document.querySelector('#submission-table');
    //    const ps = new PerfectScrollbar(container);
    //});
    $(document).ready(function () {
        VSS.getService(VSS.ServiceIds.ExtensionData).then(function (dataService) {
            dataService.getValue("items").then(function (value) {
                $.each(value, function (_, node) {
                    $('#submission-table').append("<tr><td>" + node.text + "</td><td>" + node.type + "</td><td>" + node.ancestor + "</td><td>" + node.priority + "</td>");
                });
            });
        });
    });
    $(document).ready(function () {
        var collectionUri = VSS.getWebContext().collection.uri;
        var project = VSS.getWebContext().project.name;
        var url = collectionUri + project + "/_backlogs?level=Epics&_a=backlog";
        $('#backlog').click(function () {
            VSS.getService(VSS.ServiceIds.Navigation).then(function (navigationService) {
                navigationService.navigate(url);
            });
        });
    });
    $(document).ready(function () {
        $('#revert').click(function () {
            VSS.getService(VSS.ServiceIds.ExtensionData).then(function (dataService) {
                dataService.getValue("newids").then(function (workItemIds) {
                    dev_1.deleteWorkItems(workItemIds);
                });
            });
        });
    });
    $(document).ready(function () {
        $('#import').click(function () {
            location.assign('main.html');
        });
    });
    function getBadgeClass(node) {
        var badgecolor = "";
        switch (node.type) {
            case "Bug":
                badgecolor = "#CC293D";
                break;
            case "Epic":
                badgecolor = "#FF7B00";
                break;
            case "Feature":
                badgecolor = "#773B93";
                break;
            case "User Story":
                badgecolor = "#009CCD";
                break;
            case "Task":
                badgecolor = "#F2CB1D";
                break;
            case "Issue":
                badgecolor = "#B4009E";
                break;
            case "Test Case":
                badgecolor = "#004B50";
                break;
        }
        return "Css-";
    }
});
