<template>
    <div class="snb-app" id="snb-app-shell">

    </div>
</template>

<script>
const Application = require('@jupyterlab/application');
import plugins from './application-extension';
export default {
    name: "index",
    data() {
        return {
            app: null
        };
    },
    async mounted() {
        const SnbLab = Application.JupyterLab;
        const app = new SnbLab();
        app.registerPluginModules([
            plugins
        ]);
        this.app = app;
        console.log(this.app);
        await app.start({
            hostID: 'snb-app-shell'
        });
        await app.restored;
    }
}
</script>

<style scoped>
 #snb-app-shell {
     position: relative;
     width: 100%;
     height: 100vh;
 }
</style>
