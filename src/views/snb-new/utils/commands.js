export class Command{

    constructor(opt) {
        this.id = opt.id;
        this.label = opt.label;
        this.shortcut = opt.shortcut;
        this._execute = opt.execute;
        this.category = opt.category || 'DEFAULT';
    }

    execute(app) {
        this._execute && this._execute(app);
    }
}

class Commands{
    constructor(app) {
        this._commands = [];
        this._commandsMap = {};
        this._commandsGroups = {};
        this.app = app;
    }

    hasCommand(command) {
        return !!this._commandsMap[command.id];
    }

    addCommand(command) {
        if (this.hasCommand()) {
            console.error(`Command ${command.id} is already exist, please check your command id.`);
        } else {
            this._commands.push(command);
            this._commandsMap[command.id] = command;
            this._commandsGroups[command.category] = this._commandsGroups[command.category] || [];
            this._commandsGroups[command.category].push(command);
        }
    }

    removeCommand(commandId) {
        if (this.hasCommand()) {
            delete this._commandsMap[commandId];
            let index = this._commands.findIndex(item => item.id === commandId);
            this._commands.splice(index, 1);

            const groups = this._commandsGroups[this._commands[index].category] || [];
            let groupIndex = groups.find(item => item.id === commandId);
            groups.splice(groupIndex, 1);
            return this._commands[index];
        }
    }

    execCommand(commandId) {
        const command = this._commands.find(item => item.id === commandId);
        return command.execute(this.app);
    }

    getCommandsByGroup() {
        return Object.entries(this._commandsGroups).map(([k, v]) => ({
            category: k,
            commands: v
        }));
    }
}

let commandsInstance = null;
export function createCommands(app) {
    if(commandsInstance) {
        return commandsInstance;
    }
    commandsInstance = new Commands(app);
    return commandsInstance;
}
