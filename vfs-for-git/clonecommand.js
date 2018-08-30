"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const tl = require("vsts-task-lib/task");
const WebApi_1 = require("vso-node-api/WebApi");
const auth = require("./Common/Authentication");
const gvfs = require("./Common/Gvfs");
function execute() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let repositoryId = tl.getInput("gitRepositoryId", true);
            let projectId = tl.getInput("projectId", true);
            let enlistmentRootPath = tl.getPathInput("enlistmentRootPath", true);
            let outputVariable = tl.getInput("outputVariable");
            let accessToken = auth.getSystemAccessToken();
            let endpointUrl = tl.getVariable("System.TeamFoundationCollectionUri");
            console.log(`Retrieving details for git repository.`);
            let credentialHandler = WebApi_1.getHandlerFromToken(accessToken);
            let webApi = new WebApi_1.WebApi(endpointUrl, credentialHandler);
            let gitApi = yield webApi.getGitApi();
            let repository = yield gitApi.getRepository(repositoryId, projectId);
            console.log(`Storing agent credentials in Windows credential store so VFS for git can use this for authentication.`);
            auth.storeGitCredentials(endpointUrl, accessToken);
            console.log(`Attempting to clone ${repository.name} from ${repository.remoteUrl} into ${enlistmentRootPath}`);
            let repositoryPath = gvfs.clone(repository.remoteUrl, enlistmentRootPath);
            console.log(`Successfully cloned repository using VFS for git`);
            console.log(`The path to the content of your git repository is ${repositoryPath}`);
            if (outputVariable != null && outputVariable !== "") {
                console.log(`Setting output variable ${outputVariable}`);
                tl.setVariable(outputVariable, repositoryPath);
            }
            tl.setResult(tl.TaskResult.Succeeded, "Successfully cloned repository using VFS for git");
        }
        catch (err) {
            tl.error(err);
            tl.setResult(tl.TaskResult.Failed, "Failed to clone repository using VFS for git");
        }
    });
}
exports.execute = execute;
