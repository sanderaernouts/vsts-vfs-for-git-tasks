import tl = require("vsts-task-lib/task");
import stream = require("stream");
import path = require("path");
import {IExecOptions, IExecSyncResult} from "vsts-task-lib/toolrunner";

export function clone(remoteUrl:string, enlistmentRootDirectory:string): string {
    let options: IExecOptions = <IExecOptions>{
        env: Object.assign({}, process.env),
        silent: false,
        cwd: process.cwd(),
        failOnStdErr: false,
        ignoreReturnCode: false,
        windowsVerbatimArguments: false,
    };

    options.outStream = process.stdout as stream.Writable;
    options.errStream = process.stderr as stream.Writable;

    let command: string = `clone ${remoteUrl} ${enlistmentRootDirectory}`;
    let execResult: IExecSyncResult = tl.execSync("gvfs", command, options);

    if (execResult.code === 0) {
        return path.join(enlistmentRootDirectory, "src");
    }

    // tslint:disable-next-line:max-line-length
    throw new Error(`An error occurd while trying clone "${remoteUrl}" into "${enlistmentRootDirectory}" using VFS for git. Command gvfs.exe exited with code ${execResult.code} and error ${execResult.stderr ? execResult.stderr.trim() : execResult.stderr}`);
}