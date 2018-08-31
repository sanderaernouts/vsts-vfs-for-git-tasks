import tl = require("vsts-task-lib/task");

import * as clonecommand from "./clonecommand";
import * as unmountcommand from "./unmountcommand";

async function run(): Promise<void> {
    try {
        let command: string = tl.getInput("command", true);

        switch(command.toLocaleLowerCase()) {
            case "clone":
            await clonecommand.execute();
            break;

            case "unmount":
            await unmountcommand.execute();
            break;

            default:
            tl.setResult(tl.TaskResult.Failed, `Command ${command} was not found, please notify the extension author.`);
        }
    } catch (err) {
        tl.setResult(tl.TaskResult.Failed, err.message);
    }
}

run();
