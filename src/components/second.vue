<template>
  <div>
    354
    <el-table class="main-table" style="width: 100%" stripe border>
      <el-table-column type="selection" width="500">
        <div>123</div>
      </el-table-column>
      <el-button @click="adsdfd">122</el-button>
      <el-table-column type="index" label="序号" width="50"/>
      <el-table-column prop="title" label="任务名称" width="135" sortable="custom"/>
      <el-table-column prop="taskTypeName" label="任务类型" width="80"/>
    </el-table>
    <el-table class="main-table" style="width: 100%" stripe border>
      <el-table-column type="selection" width="500">
        <div>123</div>
      </el-table-column>
      <el-button @click="adsdfd">122</el-button>
      <el-table-column type="index" label="序号" width="50"/>
      <el-table-column prop="title" label="任务名称" width="135" sortable="custom"/>
      <el-table-column prop="title" label="任务名称" width="135" sortable="custom"/>
    </el-table>
  </div>
</template>
<script>
export default {
  data () {
    return {
      dsd: '11',
      ddd: '122',
      aa: '12'
    }
  },
  methods: {
    sdsd () {
      console.log('12')

      console.log('sdsd')
      console.log('dsd')
    },
    adsdfd () {
      this.dddsdddf = '12'
    }
  }
}
</script>
<style>
.abc {
  background: #ddd;
}
</style>
