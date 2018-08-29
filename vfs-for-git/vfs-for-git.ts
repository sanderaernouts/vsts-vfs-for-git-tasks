import tl = require("vsts-task-lib/task");

import * as clonecommand from "./clonecommand";

async function run(): Promise<void> {
    try {
        await clonecommand.execute();
    } catch (err) {
        tl.setResult(tl.TaskResult.Failed, err.message);
    }
}

run();
