<template>
    <div class="Cell"
         @click="handleClick"
         @keyup.alt.enter.prevent="handleRun"
         :class="{'is-focus': cellManager.focus === meta.order, 'is-active': cellManager.active === meta.order}"
    >
        <div class="cell-editor">
            <div class="line">In</div>
            <div class="status">
                [<span v-html="status"></span>]
            </div>
            <div class="code-editor-wrapper">
                <codemirror :options="editorOptions" v-model="_value" @focus="handleEditorFocus" @blur="handleEditorBlur"></codemirror>
            </div>
        </div>

        <div class="result">
            <pre v-html="meta.result"></pre>
        </div>
    </div>
</template>

<script>
import { codemirror } from 'vue-codemirror';
import 'codemirror/lib/codemirror.css'
// language js
import 'codemirror/mode/javascript/javascript.js'
import 'codemirror/mode/python/python.js'
// theme css
import 'codemirror/theme/base16-dark.css'
import 'codemirror/theme/idea.css';
import emitter from '../mixins/emitter';
import { Kernel, Session } from '@jupyterlab/services';
export default {
    name: 'Cell',
    mixins: [emitter],
    data() {
        return {

        };
    },
    inject: ['cellManager'],
    props: {
        value: {
            type: String,
            default: ''
        },
        meta: {
            type: Object,
            default: () => ({})
        },
        readOnly: {
            type: Boolean,
            default: false
        }
    },
    components: {
        codemirror
    },
    computed: {
        editorOptions() {
            return {
                indentUnit: 4,
                tabSize: 4,
                lineNumbers: true,
                lineWrapping: true,
                spellcheck: true,
                autocorrect: true,
                autofocus: true,
                theme: 'idea',
                mode: this.meta.cell_type,
                readOnly: !this.editable ? 'nocursor' : false
            };
        },
        _value: {
            get() {
                return this.value;
            },
            set(val) {
                this.$emit('input', val);
            }
        },
        status() {
            let status = '';
            if (this.meta.status === 'busy') {
                status = '*'
            } else {
                if (this.meta.execCount > 0) {
                    status = this.meta.execCount;
                } else {
                    status = '&emsp;'
                }
            }
            return status;
        },
        editable() {
            return this.meta.editable && !this.readOnly;
        }
    },
    methods: {
        handleClick() {
            this.cellManager.active = this.meta.order;
        },
        handleEditorFocus() {
            this.cellManager.focus = this.meta.order;
            this.cellManager.active = this.meta.order;
        },
        handleEditorBlur() {
            this.cellManager.focus = -1;
        },
        handleRun() {
            Kernel.getSpecs().then(kernelSpecs => {
                let options = {
                    name: kernelSpecs.default
                };
                Kernel.startNew(options).then(kernel => {
                    // Execute and handle replies.
                    this.kernel = kernel;
                    kernel.statusChanged.connect(status => {
                        console.log('status', status);
                    });

                    let future = this.kernel.requestExecute({ code: this._value });
                    future.done.then(() => {
                        console.log('Future is fulfilled');
                    });
                    future.onIOPub = msg => {
                        console.log(msg); // Print rich output data.
                        this.dealMsg(msg);
                    };

                    future.onStdin = stdin => {
                        console.log(`stdin: ${stdin}`);
                    };

                    future.onReply = reply => {
                        console.log(`reply: ${reply}`);
                    };
                });
            });
        },
        dealMsg(msg) {
            if (msg.msg_type === 'status') {
                // todo update status
            } else if (msg.msg_type === "execute_input") {
                // todo 刷新执行次数
            } else if (msg.msg_type === 'stream') {
                // todo 刷新输出
                // this.result = msg.content.text;
                this.$emit('update:result', msg.content.text);
            }
        }
    }
}
</script>

<style lang="scss" scoped>
    .Cell {
        padding: 5px;
        position: relative;
        border: 1px solid transparent;
        &.is-active {
            border: 1px solid #42a3ff;
            &:before {
                content: '\20';
                position: absolute;
                left: 0;
                top: 0;
                width: 5px;
                height: 100%;
                background: #42a3ff;
            }
        }
        &.is-focus {
            border: 1px solid #42a366;
            &:before {
                content: '\20';
                position: absolute;
                left: 0;
                top: 0;
                width: 5px;
                height: 100%;
                background: #42a366;
            }
        }
        .cell-editor {
            display: flex;
            justify-content: flex-start;
            align-items: flex-start;
            .line {
                width: 40px;
                text-align: center;
                margin-left: 30px;
                margin-top: 6px;
            }
            .status {
                width: 60px;
                text-align: center;
                margin-top: 6px;
            }
            .code-editor-wrapper {
                flex: 1;
                border: 1px solid #dedede;
                text-align: left;
                & /deep/ .CodeMirror {
                    height: auto;
                    background: #f2f2f2;
                }
            }
        }
        .result {
            text-align: left;
            padding-left: 130px;
            pre {
                margin: 1em 0;
            }
        }
    }
</style>
