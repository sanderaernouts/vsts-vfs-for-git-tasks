import * as tl from "vsts-task-lib/task";

import { IRequestHandler } from "vso-node-api/interfaces/common/VsoBaseInterfaces";
import { WebApi, getHandlerFromToken } from "vso-node-api/WebApi";

import {IGitApi } from "vso-node-api/GitApi";
import {GitRepository} from "vso-node-api/interfaces/GitInterfaces";

import * as auth from "./Common/Authentication";
import * as gvfs from "./Common/Gvfs";


export async function execute(): Promise<void> {
    try {
        let repositoryId: string = tl.getInput("gitRepositoryId", true);
        let projectId: string = tl.getInput("projectId", true);
        let enlistmentRootPath:string = tl.getPathInput("enlistmentRootPath", true);
        let outputVariable: string = tl.getInput("outputVariable");

        let accessToken: string = auth.getSystemAccessToken();
        let endpointUrl:string  = tl.getVariable("System.TeamFoundationCollectionUri");

        console.log(`Retrieving details for git repository.`);
        let credentialHandler: IRequestHandler = getHandlerFromToken(accessToken);
        let webApi: WebApi = new WebApi(endpointUrl, credentialHandler);
        let gitApi: IGitApi = await webApi.getGitApi();
        let repository: GitRepository = await gitApi.getRepository(repositoryId, projectId);

        console.log(`Storing agent credentials in Windows credential store so VFS for git can use this for authentication.`);
        auth.storeGitCredentials(endpointUrl, accessToken);

        let repositoryPath: string = gvfs.clone(repository.remoteUrl, enlistmentRootPath);

        console.log(`Successfully cloned repository using VFS for git`);
        console.log(`The path to the content of your git repository is ${repositoryPath}`);

        if(outputVariable != null && outputVariable !== "") {
            console.log(`Setting output variable ${outputVariable}`);
            tl.setVariable(outputVariable, repositoryPath);
        }
        tl.setResult(tl.TaskResult.Succeeded, "Successfully cloned repository using VFS for git");
    } catch (err) {
        tl.error(err);
        tl.setResult(tl.TaskResult.Failed, "Failed to clone repository using VFS for git");
    }
}