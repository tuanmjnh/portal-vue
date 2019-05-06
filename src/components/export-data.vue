<template>
  <v-menu bottom left>
    <template v-slot:activator="{on}">
      <v-tooltip bottom>
        <v-btn slot="activator" v-on="on" flat icon :color="color">
          <v-icon>{{icon}}</v-icon>
        </v-btn>
        <span>{{tooltip}}</span>
      </v-tooltip>
    </template>
    <v-list>
      <v-list-tile v-for="(item, i) in items" :key="i" @click="Export(item)">
        <v-list-tile-title>{{ item.title }}</v-list-tile-title>
      </v-list-tile>
    </v-list>
  </v-menu>
</template>

<script>
import { NewDate } from '@/plugins/helpers'
export default {
  props: {
    data: { type: Array, default: null },
    getData: { type: Function },
    icon: { type: String, default: 'save_alt' }, //more_vert
    tooltip: { type: String, default: 'Export' },
    color: { type: String, default: 'default' },
    filename: { type: String, default: 'export' },
    suffixFileName: { type: Boolean, default: false },
    items: {
      type: Array,
      default: () => [
        { title: 'Export .csv', type: 'csv' },
        { title: 'Export .pdf', type: 'pdf' },
        { title: 'Export .sql', type: 'sql' },
      ]
    },
  },
  data: () => ({}),
  methods: {
    Export(item) {
      this.getData().then((x) => {
        if (!x) {
          console.log('No data available!')
          return
        }
        // console.log(x.has)
        if (item.type === 'csv') this.ExportCSV(x)
      })
    },
    ExportCSV(data = []) {
      // console.log(data)
      if (data.length < 1) {
        console.log('No data available!')
        return
      }
      let csvContent = ''//"data:text/csv;charset=utf-8,"
      csvContent += [
        `"${Object.keys(data[0]).join('","')}"`,
        ...data.map(item => `"${Object.values(item).join('","')}"`)
      ].join('\r\n').replace(/(^\[)|(\]$)/gm, '')
      var BOM = '\uFEFF'
      var csv = BOM + csvContent // encodeURI(csvContent)
      var blob = new Blob([csv], { type: 'text/plain;charset=utf-8' }) //  'text/csvcharset=utf-8'
      var csvUrl = window.webkitURL.createObjectURL(blob)
      const link = document.createElement('a')
      link.setAttribute('href', csvUrl)
      link.setAttribute('download', `${this.suffixFileName ? `${this.filename}_${NewDate('YYYYMMDDhhmmss')}` : this.filename}.csv`)
      link.click()
      // const link = document.createElement("a")
      // link.setAttribute("href", data)
      // link.setAttribute("download", "export.csv")
      // link.click()
    },
    ex() {
      var CSV = ''
      var ShowLabel = true
      var arrData = []
      var filename = 'a'
      //This condition will generate the Label/Header
      // if (ShowLabel) {
      //   var head = ""

      //   //This loop will extract the label from 1st index of on array
      //   for (var index in arrData[0]) {
      //     //Now convert each value to string and comma-seprated
      //     head += index + ','
      //   }
      //   head = head.slice(0, -1)
      //   //append Label row with line break
      //   CSV += head + '\r\n'
      // }

      //1st loop is to extract each row
      for (var i = 0; i < arrData.length; i++) {
        var row = ""
        //2nd loop will extract each column and convert it in string comma-seprated
        for (var index in arrData[i]) {
          row += '"' + arrData[i][index] + '",'
        }
        row.slice(0, row.length - 1)
        //add a line break after each row
        CSV += row + '\r\n'
      }

      if (CSV == '') {
        alert("Invalid data")
        return
      }

      //this trick will generate a temp "a" tag
      var link = document.createElement("a")
      link.id = "lnkDwnldLnk"

      //this part will append the anchor tag and remove it after automatic click
      document.body.appendChild(link)

      var BOM = "\uFEFF"
      var csv = BOM + CSV
      var blob = new Blob([csv], { type: 'text/csv;charset=utf-8' })
      var csvUrl = window.webkitURL.createObjectURL(blob)
      filename = filename + '.csv'
      // $("#lnkDwnldLnk").attr({ 'download': filename, 'href': csvUrl })
      // $('#lnkDwnldLnk')[0].click()
      // document.body.removeChild(link)
    }
  }
}
</script>

<style>
</style>
