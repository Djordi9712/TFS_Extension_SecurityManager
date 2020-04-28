/// <reference path="../node_modules/vss-web-extension-sdk/typings/tfs.d.ts"/>

import * as proj from "../dist/projects";
import * as wi from "../dist/_workItems";
import * as node from "../dist/_node";
import * as del from "../dist/dev";
import * as PerfectScrollbar from '../node_modules/perfect-scrollbar/dist/perfect-scrollbar';



declare var highlight: any;
declare var removeHighlight: any;

//del.deleteWorkItemsProject();
$(document).ready(function loadContent() {
    loadSourceProject();
    showPriorityItems();
});

$(document).ready(function () {
    const container1 = document.querySelector('#tree');
    const ps1 = new PerfectScrollbar(container1);
});

$(document).ready(function () {
    $(document).on('click', '#source-project li a', function () {
        var project = $(this).text();
        $('#source-project').val(project);
        $('#source-title').text(project);
        populateSecurityTasks(project);

    });
});

$(document).ready(function toolkit() {
    $('#expand').click(function expandAll() {
        $('#tree').data('treeview').expandAll();
    })
    $('#collapse').click(function collapseAll() {
        $('#tree').data('treeview').collapseAll();
    })
    $('#check').click(function checkAll() {
        $('#tree').data('treeview').checkAll();
    })
    $('#uncheck').click(function uncheckAll() {
        $('#tree').data('treeview').uncheckAll();
    })
})

export function expandChildren() {
    $(document).on('click', ".list-group-item", function (e) {
        if (e.target == this) {
            var nodeid = $(this).attr('data-nodeid')
            var node = $('#tree').data('treeview').getNode(nodeid);
            expand(node);
            function expand(node: any) {
                if (node.nodes != null && !node.state.expanded) {
                    $('#tree').data('treeview').expandNode(node);
                    node.nodes.forEach((child: any) => {
                        expand(child)
                    })
                }
                else {
                    $('#tree').data('treeview').collapseNode(node);
                }
            }
        }
    });
};

$(document).ready(function () {
    $(document).on('click', '#target-project li a', function () {
        var project = $(this).text();
        $('#target-project').val(project)
        $('#target-title').text(project);
    });
});

$(document).ready(() => {
    $(document).on('click', '#submitbtn', function () {
        var checked = $('#tree').data('treeview').getChecked();
        if (checked.length != 0) {
            submitForm();
        }
        else {
            $("#alertplaceholder").html('<div class="alert alert-danger alert-dismissible" role="alert">' +
                '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times; </span></button>' +
                '<strong>Missing Value:</strong> Select at least one work item to copy!</div>');
            $('.check-icon').on("click", function listenToCheck() {
                $('.alert').alert('close');
                $('.check-icon').off("click", listenToCheck);
            })
        }
    });
});

function loadSourceProject() {
    proj.getProjects().then((res) => {
        res.sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }))
        $('#source-project').html('');
        res.forEach((project) => {
            $('#source-project').append('<li role ="presentation">' +
                '<a role = "menuitem" href="#">'
                + project + '</a></li > ');
        });
        $("#source-project li a")[0].click();
        const container2 = document.querySelector('#source-project');
        const ps2 = new PerfectScrollbar(container2);
    });
}

function populateSecurityTasks(project: string) {
    wi.getWorkItemIDs(project).then((items) => {
        if (items.length == 0) {
            showWarning();
        }
        else {
            if ($('#warning-popup').css('visibility') == 'visible') {
                hideWarning();
            }
            wi.createHierarchy(items).then(() => {
                $('#tree').treeview({
                    data: buildJSONtree(wi.rel.workItemHierarchy),
                    collapseIcon: "glyphicon glyphicon-chevron-down",
                    expandIcon: "glyphicon glyphicon-chevron-right",
                    multiSelect: true,
                    onhoverColor: "white",
                    highlightSearchResults: false,
                    showCheckbox: true,
                    highlightSelected: false,
                    levels: 1,
                    onNodeChecked: function (event, node) {
                        checkNodes(node);
                    },
                    onNodeUnchecked: function (event, node) {
                        uncheckNodes(node)
                    }
                });
            })
        }
    });
}

$(document).ready(function search() {
    $(".searchBar").keyup(() => {
        var input = $(".searchBar").val();
        var options = {
            ignoreCase: true,
            exactMatch: false,
            revealResults: true
        }
        let searchResults: any[] = $('#tree').data('treeview').search(input, options);
        let searchResultIds: number[] = [];
        searchResults.forEach((node) => {
            searchResultIds.push(node.nodeId);
        })
        var treeNodes: any[] = $('#tree').data('treeview').getEnabled();
        treeNodes.forEach((node) => {
            if (input != "") {
                if (searchResultIds.findIndex(id => id == node.nodeId) == -1) {
                    node.display = 'none';
                }
                else {
                    node.display = 'list-item'
                }
            }
            else {
                node.display = 'list-item'
                $('#tree').data('treeview').collapseAll();
            }
        })

        $('#tree').data('treeview').render();
        highLightSearchResults(input);
        // revealParentsHighlight();
    })
})


function revealParentsHighlight() {
    var highlights: any[] = [];
    $('[style*="display:list-item"]').each(function () {
        highlights.push($(this).attr('data-nodeid'))
    })
}


export function showPriorityItems() {
    $(document).on('mouseenter', ".list-group-item", function e() {
        $(this).children('.priority').children('.glyphicon-plus').css("visibility", "visible");
        $(this).children('.priority').children('.glyphicon-minus').css("visibility", "visible");
    });
    $(document).on('mouseleave', ".list-group-item", function e() {
        $(this).children('.priority').children('.glyphicon-plus').css("visibility", "hidden");
        $(this).children('.priority').children('.glyphicon-minus').css("visibility", "hidden");
    });
}


function showWarning() {
    $(".align").css("visibility", "hidden");
    $("#table").css("visibility", "hidden");
    $("#warning-popup").css("visibility", "visible");
}

function hideWarning() {
    $("#warning-popup").css("visibility", "hidden");
    $(".align").css("visibility", "visible");
    $("#table").css("visibility", "visible");
}

function checkNodes(node: any) {
    if (node.nodes != null) {
        node.nodes.forEach((child: any) => {
            $('#tree').data('treeview').checkNode(child.nodeId);
        })
    }
}

function uncheckNodes(node: any) {
    if (node.nodes != null) {
        node.nodes.forEach((child: any) => {
            $('#tree').data('treeview').uncheckNode(child.nodeId);
        })
    }
}

async function submitForm() {
    var project = VSS.getWebContext().project.name;
    var checked = $('#tree').data('treeview').getChecked();
    var data = new Map();

    $.each(checked, (_, node) => {
        data.set(node.id, node.priority);
    })

    wi.createworkItems(data, project).then(function (items) {
        VSS.getService(VSS.ServiceIds.ExtensionData).then(function (dataService) {
            dataService.setValue("items", checked).then(() => {
                dataService.setValue("newids", items).then(() => {
                    location.replace('submission.html');
                });
            });
        });
    })
};

function addIcon(node: node.Node): string {
    var icon: string = "";
    switch (node.type) {
        case "Bug":
            icon = "bug"
            break;
        case "Epic":
            icon = "epic"
            break;
        case "Feature":
            icon = "feature"
            break;
        case "User Story":
            icon = "userstory"
            break;
        case "Task":
            icon = "task";
            break;
        case "Issue":
            icon = "issue";
            break;
        case "Test Case":
            icon = "testcase"
            break;
    }
    return icon;
}

function buildJSONtree(workitems: node.Node[]) {
    var tree: any[] = [];
    workitems.forEach((workitem) => {
        var node = {
            text: workitem.title,
            id: workitem.id,
            type: workitem.type,
            parent: workitem.parent,
            ancestor: workitem.ancestor,
            icon: addIcon(workitem),
            display: "list-item",
            nodes: [],
            state: {
                expanded: false
            }
        }
        let parent = workitem.parent;
        let found: boolean = false;
        tree.forEach(function check(item) {
            if (item.id == parent) {
                item.nodes.push(node);
                found = true;
            }
            else if (item.nodes.length > 0) {
                item.nodes.forEach((child) => check(child));
            }
        });
        if (!found) {
            tree.push(node);
        }
    })
    tree = checkCollapsableNodes(tree);
    return tree;
}

function checkCollapsableNodes(tree) {
    tree.forEach(function check(node) {
        if (node.nodes.length == 0) {
            delete node.nodes;
        }
        if (node.nodes != null) {
            node.nodes.forEach((node) => check(node));
        }
    })
    return tree;
}

function highLightSearchResults(keyword: string) {
    $('.treeItem').mark(keyword);
    //console.log(keyword);
    //$('.treeitem').removehighlight();
    //$('.treeitem').highlight(keyword);
}


 