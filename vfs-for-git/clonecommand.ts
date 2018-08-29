import tl = require('vsts-task-lib/task');

import * as auth from "./Common/Authentication";


export async function execute() : Promise<void> { 
    try{
        let repositoryId = tl.getInput("gitRepositoryId", true);
        let repositoryUrl = tl.getInput("gitRepositoryUrl", true);
        let repositoryName = tl.getInput("gitRepositoryName", true);
        let accessToken = auth.getSystemAccessToken();
        let accountUrl = tl.getVariable("System.TeamFoundationCollectionUri");

        console.log(`Storing agent credentials in Windows Credential Store`)
        auth.storeGitCredentials(accountUrl, accessToken);

        console.log(`Cloning repository ${repositoryUrl} from ${repositoryName}`);
        tl.setResult(tl.TaskResult.Succeeded, tl.loc("PackagesPublishedSuccessfully"));
    } catch (err) {
        tl.error(err);
        tl.setResult(tl.TaskResult.Failed, tl.loc("PackagesFailedToPublish"));
    }
}