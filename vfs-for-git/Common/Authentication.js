"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tl = require("vsts-task-lib/task");
function getSystemAccessToken() {
    tl.debug("Getting credentials for VSTS");
    let auth = tl.getEndpointAuthorization("SYSTEMVSSCONNECTION", false);
    if (auth.scheme === "OAuth") {
        tl.debug("Got auth token");
        return auth.parameters.AccessToken;
    }
    else {
        tl.warning(tl.loc("Warn_CredentialsNotFound"));
    }
}
exports.getSystemAccessToken = getSystemAccessToken;
function storeGitCredentials(accountUrl, accessToken) {
    let options = {
        cwd: process.cwd(),
        env: Object.assign({}, process.env),
        silent: false,
        failOnStdErr: false,
        ignoreReturnCode: false,
        windowsVerbatimArguments: false
    };
    options.outStream = process.stdout;
    options.errStream = process.stderr;
    let command = new Array();
    command.push("/generic:LegacyGeneric:target=git:", accountUrl, "/user:\"VSTS agent\"", "/password:", accessToken);
    let execResult = tl.execSync("cmdkey", command, options);
    if (execResult.code === 0) {
        return;
    }
    // tslint:disable-next-line:max-line-length
    throw new Error(`An error occurd while trying to store git credentials in the Windows Credential Store. cmdkey exited with code ${execResult.code} and error ${execResult.stderr ? execResult.stderr.trim() : execResult.stderr}`);
}
exports.storeGitCredentials = storeGitCredentials;
