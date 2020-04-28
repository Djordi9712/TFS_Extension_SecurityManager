/// <reference path="../node_modules/vss-web-extension-sdk/typings/tfs.d.ts"/>
define(["require", "exports", "../dist/projects", "../dist/_workItems"], function (require, exports, proj, wi) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    populateProject("source-project");
    populateProject("target-project");
    $(document).ready(function () {
        $(document).on('click', '#source-project li a', function () {
            var project = $(this).text();
            console.log($("#source-project ul"));
            $('#source-project').val(project);
            $('#source-title').text(project);
            populateSecurityTasks(project);
        });
    });
    $(document).ready(function () {
        $(document).on('click', '#target-project li a', function () {
            var project = $(this).text();
            $('#target-project').val(project);
            $('#target-title').text(project);
        });
    });
    $(document).ready(function () {
        $(document).on('click', '#submitbtn', function () {
            submitForm();
        });
    });
    function populateProject(dropdown) {
        proj.getProjects().then(function (res) {
            $('#' + dropdown).html('');
            res.forEach(function (project) {
                $("#" + dropdown).append('<li role ="presentation">' +
                    '<a role = "menuitem" href="#">'
                    + project + '</a></li > ');
            });
            if (dropdown == "source-project") {
                $("#source-project li a")[0].click();
            }
        });
    }
    function populateSecurityTasks(project) {
        wi.getWorkItemIDs(project).then(function (items) {
            wi.getEpics(items).then(function (array) {
                if (array.length == 0) {
                    showWarning();
                }
                else {
                    if ($('#warning-popup').css('visibility') == 'visible') {
                        hideWarning();
                    }
                    $('#tree').treeview({
                        data: buildJSONtree(wi.rel.workItemHierarchy),
                        collapseIcon: "glyphicon glyphicon-chevron-down",
                        expandIcon: "glyphicon glyphicon-chevron-right",
                        multiSelect: true,
                        onhoverColor: "white",
                        showCheckbox: true,
                        highlightSelected: false,
                        levels: 1,
                        onNodeChecked: function (event, node) {
                            checkNodes(node);
                        },
                        onNodeUnchecked: function (event, node) {
                            uncheckNodes(node);
                        }
                    });
                    showPriorityItems();
                }
            });
        });
    }
    function showPriorityItems() {
        $(".list-group-item").mouseenter(function () {
            $(this).children('#priority').children('#plus').css("visibility", "visible");
            $(this).children('#priority').children('#minus').css("visibility", "visible");
        });
        $(".list-group-item").mouseleave(function () {
            $(this).children('#priority').children('#plus').css("visibility", "hidden");
            $(this).children('#priority').children('#minus').css("visibility", "hidden");
        });
    }
    function showWarning() {
        $("#warning-popup").css("visibility", "visible");
        $("#table").css("visibility", "hidden");
        $("#tree").css("visibility", "hidden");
        $("#tree").css("max-height", "5px");
        $("#security-title").css("padding-bottom", "2%");
    }
    function hideWarning() {
        $("#warning-popup").css("visibility", "hidden");
        $("#table").css("visibility", "visible");
        $("#tree").css("visibility", "visible");
        $("#tree").css("max-height", "350px");
        $("#security-title").css("padding-bottom", "0%");
    }
    function checkNodes(node) {
        if (node.nodes != null) {
            node.nodes.forEach(function (child) {
                $('#tree').data('treeview').checkNode(child.nodeId);
            });
        }
    }
    function uncheckNodes(node) {
        if (node.nodes != null) {
            node.nodes.forEach(function (child) {
                $('#tree').data('treeview').uncheckNode(child.nodeId);
            });
        }
    }
    function submitForm() {
        var project = $('#target-project').val().toString();
        var data = new Map();
        $.each($('#tree').data('treeview').getChecked(), function (_, node) {
            data.set(node.id, node.priority);
            console.log(node.text + node.type + node.parent + node.priority);
            $('#submission-table').append("<tr><td>" + node.text + "</td><td>" + node.type + "</td><td>" + node.parent + "</td><td>" + node.priority + "</td>");
        });
        $("#myModal").modal('toggle');
        wi.createworkItems(data, project);
        $('#submissionform').css("visibility", "visible");
    }
    ;
    function addIcon(node) {
        var icon = "";
        switch (node.type) {
            case "Bug":
                icon = "bug";
                break;
            case "Epic":
                icon = "epic";
                break;
            case "Feature":
                icon = "feature";
                break;
            case "User Story":
                icon = "userstory";
                break;
            case "Task":
                icon = "task";
                break;
        }
        return icon;
    }
    function buildJSONtree(workitems) {
        var tree = [];
        workitems.forEach(function (workitem) {
            console.log(workitem.type);
            var node = {
                text: workitem.title,
                id: workitem.id,
                type: workitem.type,
                parent: workitem.parent,
                icon: addIcon(workitem),
                nodes: [],
                state: {
                    expanded: false,
                    checked: false
                }
            };
            var parent = workitem.parent;
            var found = false;
            tree.forEach(function check(item) {
                if (item.id == parent) {
                    item.nodes.push(node);
                    found = true;
                }
                else if (item.nodes.length > 0) {
                    item.nodes.forEach(function (child) { return check(child); });
                }
            });
            if (!found) {
                tree.push(node);
            }
        });
        tree = checkCollapsableNodes(tree);
        return tree;
    }
    function checkCollapsableNodes(tree) {
        tree.forEach(function check(node) {
            if (node.nodes.length == 0) {
                delete node.nodes;
            }
            if (node.nodes != null) {
                node.nodes.forEach(function (node) { return check(node); });
            }
        });
        return tree;
    }
    var JSobj = /** @class */ (function () {
        function JSobj() {
        }
        return JSobj;
    }());
});
