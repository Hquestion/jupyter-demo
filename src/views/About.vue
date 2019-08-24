<template>
    <div class="about">
        <el-button @click="addCell">添加cell</el-button>
        <el-button @click="runAll">运行全部</el-button>
        <el-button @click="runCell" v-if="nbMode === 'debug'">单步运行</el-button>
        <el-button @click="debug" v-if="nbMode !== 'debug'">调试</el-button>
        <el-button @click="cancelDebug" v-if="nbMode === 'debug'">退出调试</el-button>
        <CellWrapper :cells="cells" :mode="nbMode" ref="wrapper"></CellWrapper>
    </div>
</template>
<script>
import CellWrapper from '../components/CellWrapper';
import notebookManager, {Cell} from '../mixins/notebookManager'
import axios from 'axios';
import { Session, Kernel, KernelMessage } from '@jupyterlab/services';
export default {
    components: {
        CellWrapper
    },
    mixins: [notebookManager],
    data() {
        return {
            cells: [],
            nbMode: 'edit',
            kernel: null
        };
    },
    methods: {
        async init() {
            // await this.initUI();
            // var sessionInfo = await this.initSession();
            // console.log(sessionInfo);
            // this.initKernel();
        },
        initUI() {
            return Kernel.getSpecs();
        },
        initSession() {
            let session;
            return Session.startNew({
                "path":"test2.ipynb",
                kernelName: 'python3'
            })
                .then(s => {
                    session = s;
                    // Rename the session.
                    return session.setPath('bar.ipynb');
                })
                .then(() => {
                    // Execute and handle replies on the kernel.
                    let future = session.kernel.requestExecute({ code: 'a = 1' });
                    future.onReply = reply => {
                        console.log(reply);
                    };
                    return future.done;
                })
        },
        addCell() {
            this.insertCell(this.cells);
        },
        async runAll() {
            // 启动kernel
            this.kernel = await this.startKernel();
            this.watchKernel();
            this.runNotebook();
        },
        runCell() {
            let cell = this.getSelectedCell();
            cell.result = '';
            let future = this.kernel.requestExecute({
                code: cell.code
            });
            future.onIOPub = msg => {
                console.log(msg); // Print rich output data.
                this.dealMsg(msg, cell);
            };

            future.onStdin = stdin => {
                console.log(`stdin: ${stdin}`);
            };

            future.onReply = reply => {
                console.log(`reply: ${reply}`);
            };
        },
        async debug() {
            this.nbMode = 'debug';
            let runningModel = await Kernel.listRunning();
            console.log(runningModel);
            if (runningModel && runningModel.length > 0) {
                this.kernel = Kernel.connectTo(runningModel[0]);
            } else {
                this.kernel = await this.startKernel();
            }
        },
        cancelDebug() {
            this.kernel.shutdown().then(() => {
                this.nbMode = 'edit';
                this.kernel = null;
            });
        },
        getSelectedCell() {
            let order = this.$refs.wrapper.active;
            return this.cells.find(item => item.order === order);
        },
        startKernel() {
            return Kernel.getSpecs().then(kernelSpecs => {
                let options = {
                    name: kernelSpecs.default
                };
                return Kernel.startNew(options);
            });
        },
        watchKernel() {
            this.kernel.statusChanged.connect(status => {
                console.log('status', status);
            });
        },
        runNotebook() {
            let count = 0;
            this.cells.forEach(cell => {
                cell.editable = false;
                cell.result = '';
                let future = this.kernel.requestExecute({ code: cell.code });
                future.done.then(() => {
                    count++;
                    console.log('Future is fulfilled');
                    // 关闭kernel
                    if (count === this.cells.length) {
                        this.kernel.shutdown().then(() => {
                            this.cells.forEach(item => item.editable = true);
                            this.kernel = null;
                        });
                    }
                });

                future.onIOPub = msg => {
                    console.log(msg); // Print rich output data.
                    this.dealMsg(msg, cell);
                };

                future.onStdin = stdin => {
                    console.log(`stdin: ${stdin}`);
                };

                future.onReply = reply => {
                    console.log(`reply: ${JSON.stringify(reply)}`);
                };
            });
        },
        dealMsg(msg, cell) {
            if (msg.msg_type === 'status') {
                cell.status = msg.content.execution_state;
            } else if (msg.msg_type === "execute_input") {
                cell.execCount = msg.content.execution_count;
            } else if (msg.msg_type === 'stream') {
                // todo 刷新输出
                // this.result = msg.content.text;
                cell.result = msg.content.text;
            } else if (msg.msg_type === 'error') {
                cell.result = msg.content.traceback;
            } else if (msg.msg_type === 'execute_result') {
                cell.result += msg.content.data['text/plain'];
            }
        }
    },
    mounted() {
        // 初始化session，连接ws
        this.insertCell(this.cells);
        this.init();
    }
};
</script>

<style>
    .about {
        width: 1366px;
        margin: 0 auto;
    }

</style>
