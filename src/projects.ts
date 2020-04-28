import Core = require("TFS/Core/RestClient");
var coreClient = Core.getClient();

export function getProjects(): Promise<string[]> {
    return new Promise((resolve) => {
        coreClient.getProjects().then(function (result) {
            var projectNames: string[] = [];
            result.forEach(function (project) {
                projectNames.push(project.name);
            }
            );
            resolve(projectNames);
        });
    });
}

