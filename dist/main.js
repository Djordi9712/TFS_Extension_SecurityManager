/// <reference path="../node_modules/vss-web-extension-sdk/typings/tfs.d.ts"/>
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
define(["require", "exports", "../dist/projects", "../dist/_workItems", "../node_modules/perfect-scrollbar/dist/perfect-scrollbar"], function (require, exports, proj, wi, PerfectScrollbar) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    //del.deleteWorkItemsProject();
    $(document).ready(function loadContent() {
        loadSourceProject();
        showPriorityItems();
    });
    $(document).ready(function () {
        var container1 = document.querySelector('#tree');
        var ps1 = new PerfectScrollbar(container1);
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
        });
        $('#collapse').click(function collapseAll() {
            $('#tree').data('treeview').collapseAll();
        });
        $('#check').click(function checkAll() {
            $('#tree').data('treeview').checkAll();
        });
        $('#uncheck').click(function uncheckAll() {
            $('#tree').data('treeview').uncheckAll();
        });
    });
    function expandChildren() {
        $(document).on('click', ".list-group-item", function (e) {
            if (e.target == this) {
                var nodeid = $(this).attr('data-nodeid');
                var node = $('#tree').data('treeview').getNode(nodeid);
                expand(node);
                function expand(node) {
                    if (node.nodes != null && !node.state.expanded) {
                        $('#tree').data('treeview').expandNode(node);
                        node.nodes.forEach(function (child) {
                            expand(child);
                        });
                    }
                    else {
                        $('#tree').data('treeview').collapseNode(node);
                    }
                }
            }
        });
    }
    exports.expandChildren = expandChildren;
    ;
    $(document).ready(function () {
        $(document).on('click', '#target-project li a', function () {
            var project = $(this).text();
            $('#target-project').val(project);
            $('#target-title').text(project);
        });
    });
    $(document).ready(function () {
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
                });
            }
        });
    });
    function loadSourceProject() {
        proj.getProjects().then(function (res) {
            res.sort(function (a, b) { return a.localeCompare(b, undefined, { sensitivity: 'base' }); });
            $('#source-project').html('');
            res.forEach(function (project) {
                $('#source-project').append('<li role ="presentation">' +
                    '<a role = "menuitem" href="#">'
                    + project + '</a></li > ');
            });
            $("#source-project li a")[0].click();
            var container2 = document.querySelector('#source-project');
            var ps2 = new PerfectScrollbar(container2);
        });
    }
    function populateSecurityTasks(project) {
        wi.getWorkItemIDs(project).then(function (items) {
            if (items.length == 0) {
                showWarning();
            }
            else {
                if ($('#warning-popup').css('visibility') == 'visible') {
                    hideWarning();
                }
                wi.createHierarchy(items).then(function () {
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
                            uncheckNodes(node);
                        }
                    });
                });
            }
        });
    }
    $(document).ready(function search() {
        $(".searchBar").keyup(function () {
            var input = $(".searchBar").val();
            var options = {
                ignoreCase: true,
                exactMatch: false,
                revealResults: true
            };
            var searchResults = $('#tree').data('treeview').search(input, options);
            var searchResultIds = [];
            searchResults.forEach(function (node) {
                searchResultIds.push(node.nodeId);
            });
            var treeNodes = $('#tree').data('treeview').getEnabled();
            treeNodes.forEach(function (node) {
                if (input != "") {
                    if (searchResultIds.findIndex(function (id) { return id == node.nodeId; }) == -1) {
                        node.display = 'none';
                    }
                    else {
                        node.display = 'list-item';
                    }
                }
                else {
                    node.display = 'list-item';
                    $('#tree').data('treeview').collapseAll();
                }
            });
            $('#tree').data('treeview').render();
            highLightSearchResults(input);
            // revealParentsHighlight();
        });
    });
    function revealParentsHighlight() {
        var highlights = [];
        $('[style*="display:list-item"]').each(function () {
            highlights.push($(this).attr('data-nodeid'));
        });
    }
    function showPriorityItems() {
        $(document).on('mouseenter', ".list-group-item", function e() {
            $(this).children('.priority').children('.glyphicon-plus').css("visibility", "visible");
            $(this).children('.priority').children('.glyphicon-minus').css("visibility", "visible");
        });
        $(document).on('mouseleave', ".list-group-item", function e() {
            $(this).children('.priority').children('.glyphicon-plus').css("visibility", "hidden");
            $(this).children('.priority').children('.glyphicon-minus').css("visibility", "hidden");
        });
    }
    exports.showPriorityItems = showPriorityItems;
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
        return __awaiter(this, void 0, void 0, function () {
            var project, checked, data;
            return __generator(this, function (_a) {
                project = VSS.getWebContext().project.name;
                checked = $('#tree').data('treeview').getChecked();
                data = new Map();
                $.each(checked, function (_, node) {
                    data.set(node.id, node.priority);
                });
                wi.createworkItems(data, project).then(function (items) {
                    VSS.getService(VSS.ServiceIds.ExtensionData).then(function (dataService) {
                        dataService.setValue("items", checked).then(function () {
                            dataService.setValue("newids", items).then(function () {
                                location.replace('submission.html');
                            });
                        });
                    });
                });
                return [2 /*return*/];
            });
        });
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
            case "Issue":
                icon = "issue";
                break;
            case "Test Case":
                icon = "testcase";
                break;
        }
        return icon;
    }
    function buildJSONtree(workitems) {
        var tree = [];
        workitems.forEach(function (workitem) {
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
    function highLightSearchResults(keyword) {
        $('.treeItem').mark(keyword);
        //console.log(keyword);
        //$('.treeitem').removehighlight();
        //$('.treeitem').highlight(keyword);
    }
});
