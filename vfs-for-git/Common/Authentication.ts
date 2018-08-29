import tl = require("vsts-task-lib/task");
import stream = require("stream");
import {IExecOptions, IExecSyncResult} from "vsts-task-lib/toolrunner";

export function getSystemAccessToken(): string {
    tl.debug("Getting credentials for VSTS");
    let auth: tl.EndpointAuthorization = tl.getEndpointAuthorization("SYSTEMVSSCONNECTION", false);
    if (auth.scheme === "OAuth") {
        tl.debug("Got auth token");

        return auth.parameters.AccessToken;
    } else {
        tl.warning(tl.loc("Warn_CredentialsNotFound"));
    }
}

export function storeGitCredentials(accountUrl:string, accessToken: string): void {
    let options: IExecOptions = <IExecOptions>{
        cwd: process.cwd(),
        env: Object.assign({}, process.env),
        silent: false,
        failOnStdErr: false,
        ignoreReturnCode: false,
        windowsVerbatimArguments: false
    };
    options.outStream = process.stdout as stream.Writable;
    options.errStream = process.stderr as stream.Writable;

    let command: Array<string> = new Array<string>();

    command.push(
        "/generic:LegacyGeneric:target=git:", accountUrl,
        "/user:\"VSTS agent\"",
        "/password:", accessToken
    );

    let execResult: IExecSyncResult = tl.execSync("cmdkey", command, options);

    if (execResult.code === 0) {
        return;
    }

    // tslint:disable-next-line:max-line-length
    throw new Error(`An error occurd while trying to store git credentials in the Windows Credential Store. cmdkey exited with code ${execResult.code} and error ${execResult.stderr ? execResult.stderr.trim() : execResult.stderr}`);
}