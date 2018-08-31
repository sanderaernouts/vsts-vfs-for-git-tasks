import * as tl from "vsts-task-lib/task";

import * as gvfs from "./Common/Gvfs";


export async function execute(): Promise<void> {
    try {
        gvfs.unmountAll();
        tl.setResult(tl.TaskResult.Succeeded, "Successfully unmounted all previously mounted VFS for git repositories");
    } catch (err) {
        tl.error(err);
        tl.setResult(tl.TaskResult.Failed, "Failed to unmount all previously mounted VFS for git repositories");
    }
}