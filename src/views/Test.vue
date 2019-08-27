<template>
    <div class="test">
        <Panel child-direction="horizontal">
            <Panel :init-width="20" :fixed="true">

            </Panel>
            <Panel>
                <Panel child-direction="horizontal">
                    <Panel :weight="2"></Panel>
                    <Panel :weight="6" child-direction="vertical">
                        <Panel></Panel>
                        <Panel></Panel>
                        <Panel :fixed="true" :init-height="20"></Panel>
                    </Panel>
                </Panel>
                <Panel></Panel>
            </Panel>

        </Panel>
    </div>
</template>

<script>
import Panel from "./snb-new/panel/Panel";
export default {
    name: "Test",
    components: {Panel}
}
</script>

<style scoped>
 .test {
     position: absolute;
     left: 0;
     top: 0;
     width: 100vw;
     height: 100vh;
 }
</style>
