define(["require", "exports", "TFS/Core/RestClient"], function (require, exports, Core) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var coreClient = Core.getClient();
    function getProjects() {
        return new Promise(function (resolve) {
            coreClient.getProjects().then(function (result) {
                var projectNames = [];
                result.forEach(function (project) {
                    projectNames.push(project.name);
                });
                resolve(projectNames);
            });
        });
    }
    exports.getProjects = getProjects;
});
