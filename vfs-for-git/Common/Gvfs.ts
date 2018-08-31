import tl = require("vsts-task-lib/task");
import stream = require("stream");
import path = require("path");
import {IExecOptions, IExecSyncResult} from "vsts-task-lib/toolrunner";

const MountedEnlistmentsVariable: string = "VfsMountedEnlistments";
const MountedEnlistmentsSeperator: string = ",";

export function clone(remoteUrl:string, enlistmentRootDirectory:string): string {
    console.log(`Attempting to clone ${remoteUrl} into ${enlistmentRootDirectory}`);
    let command: string = `clone ${remoteUrl} ${enlistmentRootDirectory}`;

    ExecuteGvfsCommand(command, undefined);
    StoreMountedEnlistmentRootDirectory(enlistmentRootDirectory);
    let sourceDirectory: string = path.join(enlistmentRootDirectory, "src");

    return sourceDirectory;
}

export function unmountAll(): void {
    let mountedEnlistments: Array<string> = GetMountedEnlistmentRootDirectories();

    if(mountedEnlistments.length === 0) {
        console.log("No enlistments were previously mounted");
        return;
    }

    console.log("Attempting to unmount previously mounted enlistments.");
    GetMountedEnlistmentRootDirectories().forEach(enlistmentRootDirectory => {
        unmount(enlistmentRootDirectory);
    });
}

export function unmount(enlistmentRootDirectory: string): void {
    console.log(`Attempting to unmount VFS for git enlistment at ${enlistmentRootDirectory}`);
    ExecuteGvfsCommand(`unmount ${enlistmentRootDirectory}`);
}

function ExecuteGvfsCommand(command: string, options?: IExecOptions): void {

    if(options === undefined) {
        options = CreateDefaultExecutionOptions();
    }

    tl.debug(`Running gvfs ${command}`);
    let execResult: IExecSyncResult = tl.execSync("gvfs", command, options);

    if (execResult.code === 0) {
        tl.debug("gvfs command succeeded");
        return;
    }

    // tslint:disable-next-line:max-line-length
    throw new Error(`Error "gvfs ${command}" exited with code ${execResult.code} and error ${execResult.stderr ? execResult.stderr.trim() : execResult.stderr}`);
}

function CreateDefaultExecutionOptions(): IExecOptions {
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

    return options;
}

function StoreMountedEnlistmentRootDirectory(enlistmentRoot: string): void {
    let mountedEnlistmentRootDirectories: Array<string> = GetMountedEnlistmentRootDirectories();
    mountedEnlistmentRootDirectories.push(enlistmentRoot);

    console.log("The following VFS for git enlistments are currently mounted:");
    mountedEnlistmentRootDirectories.forEach(enlistment => {
        console.log(`  - ${enlistment}`);
    });

    console.log("Use the VFS for git unmount command to unmount all these enlistments at the end of your build.");

    tl.setVariable(MountedEnlistmentsVariable, mountedEnlistmentRootDirectories.join(MountedEnlistmentsSeperator));

    let v: string = GetMountedEnlistmentRootDirectories().join(",");
    console.log(v);
}

function GetMountedEnlistmentRootDirectories(): Array<string> {
    let mountedEnlistmentRootDirectories: string = tl.getVariable(MountedEnlistmentsVariable);

    if(mountedEnlistmentRootDirectories == null || mountedEnlistmentRootDirectories === "") {
        return Array<string>();
    }

    return mountedEnlistmentRootDirectories.split(MountedEnlistmentsSeperator);
}