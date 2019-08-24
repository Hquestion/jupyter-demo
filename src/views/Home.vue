<template>
  <div class="home" id="snb-shell">
<!--      <SnbCell></SnbCell>-->
<!--      <SnbNotebook></SnbNotebook>-->
<!--      <SnbApp></SnbApp>-->
      <SnbIDE></SnbIDE>
  </div>
</template>

<script>
// @ is an alias to /src
import SnbCell from '@/components/jp/Cell.vue'
import SnbNotebook from '../components/jp/Notebook';
import SnbApp from './snb/application/index';
import SnbIDE from './snb-new/Manager';
var m = require('./test');

console.log(m);
console.log(m.A);

export default {
    name: 'home',
    components: {
        SnbCell,
        SnbNotebook,
        SnbApp,
        SnbIDE
    }
}
</script>
