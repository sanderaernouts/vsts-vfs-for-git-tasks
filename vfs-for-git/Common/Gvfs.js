"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tl = require("vsts-task-lib/task");
const path = require("path");
function clone(remoteUrl, enlistmentRootDirectory) {
    let options = {
        env: Object.assign({}, process.env),
        silent: false,
        cwd: process.cwd(),
        failOnStdErr: false,
        ignoreReturnCode: false,
        windowsVerbatimArguments: false,
    };
    options.outStream = process.stdout;
    options.errStream = process.stderr;
    let command = `clone ${remoteUrl} ${enlistmentRootDirectory}`;
    let execResult = tl.execSync("gvfs", command, options);
    if (execResult.code === 0) {
        return path.join(enlistmentRootDirectory, "src");
    }
    // tslint:disable-next-line:max-line-length
    throw new Error(`An error occurd while trying clone "${remoteUrl}" into "${enlistmentRootDirectory}" using VFS for git. Command gvfs.exe exited with code ${execResult.code} and error ${execResult.stderr ? execResult.stderr.trim() : execResult.stderr}`);
}
exports.clone = clone;
