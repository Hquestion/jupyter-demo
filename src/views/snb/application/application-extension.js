import { JupyterLab } from "@jupyterlab/application";

const status = {
    id: '@jupyterlab/application-extension:status',
    activate: (app) => {
        if (!(app instanceof JupyterLab)) {
            throw new Error(`${status.id} must be activated in JupyterLab.`);
        }
        console.log('333333333333333');
        var test = document.createElement('div');
        test.innerHTML = '111';
        document.body.appendChild(test);
        return app.status;
    },
    autoStart: true
};

const plugins = [
    status
];

export default plugins;
