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
const auth = require("./Common/Authentication");
function execute() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let repositoryId = tl.getInput("gitRepositoryId", true);
            let repositoryUrl = tl.getInput("gitRepositoryUrl", true);
            let repositoryName = tl.getInput("gitRepositoryName", true);
            let accessToken = auth.getSystemAccessToken();
            let accountUrl = tl.getVariable("System.TeamFoundationCollectionUri");
            console.log(`Storing agent credentials in Windows Credential Store`);
            auth.storeGitCredentials(accountUrl, accessToken);
            console.log(`Cloning repository ${repositoryUrl} from ${repositoryName}`);
            tl.setResult(tl.TaskResult.Succeeded, tl.loc("PackagesPublishedSuccessfully"));
        }
        catch (err) {
            tl.error(err);
            tl.setResult(tl.TaskResult.Failed, tl.loc("PackagesFailedToPublish"));
        }
    });
}
exports.execute = execute;
