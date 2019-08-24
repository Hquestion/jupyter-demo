<template>
    <div>
        <div class="sky-ide-main" @click="mainClick" tabindex="1">
            <SideBarPanel :collapse.sync="sidebarCollapse" v-model="sidebarActive">
                <template slot="menu">
                    <SideBarMenu name="11" icon="el-icon-phone" ></SideBarMenu>
                    <SideBarMenu name="12" icon="el-icon-phone" ></SideBarMenu>
                    <SideBarMenu name="13" icon="el-icon-phone" ></SideBarMenu>
                    <SideBarMenu name="14" icon="el-icon-phone" ></SideBarMenu>
                </template>
                <template slot="content">
                    <SideBarContent name="11">
                        111
                    </SideBarContent>
                    <SideBarContent name="12">
                        222
                    </SideBarContent>
                    <SideBarContent name="13">
                        222
                    </SideBarContent>
                    <SideBarContent name="14">
                        333
                    </SideBarContent>
                </template>
            </SideBarPanel>
        </div>
    </div>
</template>

<script>
import { CommandRegistry } from '@phosphor/commands';
import SideBarPanel from "./sidebar/SideBarPanel";
import SideBarMenu from "./sidebar/SideBarMenu";
import SideBarContent from "./sidebar/SideBarContent";
export default {
    name: "Manager",
    components: {SideBarContent, SideBarMenu, SideBarPanel},
    data() {
        return {
            commands: null,
            config: {
                position: {
                    sidebar: 'left'
                }
            },
            sidebarCollapse: false,
            sidebarActive: '11'
        };
    },
    provide() {
        return {
            app: this
        };
    },
    methods: {
        mainClick(e) {
            console.log(e);
            e.target.focus();
        }
    },
    mounted() {
        window.addEventListener('keydown', event => {
            console.log(this);
            this.commands.processKeydownEvent(event);
        }, false);
        this.commands = new CommandRegistry();
        this.commands.addCommand('run:test', {
            execute: () => console.log(111)
        });

        this.commands.addKeyBinding({
            selector: '.sky-ide-main',
            keys: ['Enter'],
            command: 'run:test'
        })
    }
}
</script>

<style lang="scss" scoped>
    .sky-ide-main {
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        background: #fff;
    }
</style>
