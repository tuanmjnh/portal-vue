<template>
  <div class="file-upload" v-if="uploadReady">
    <div class="btn-upload" v-if="buttonUse">
      <input type="file" id="file-upload" :multiple="multiple===true?true:false" @change="onChange($event)" />
      <label for="file-upload" class="v-btn v-btn--icon theme--info primary--text"><i
          class="material-icons">cloud_upload</i></label>
    </div>
    <div v-else class="file-upload-content">
      <input type="file" id="file-upload" :multiple="multiple===true?true:false" @change="onChange($event)" />
      <p v-html="buttonText"></p>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { NewGuid, CheckExtension, getExtension } from '@/plugins/helpers';
export default {
  props: {
    multiple: { type: Boolean, default: false },
    fieldName: { type: String, default: 'file-upload' },
    fileName: { type: String, default: null },
    autoName: { type: Boolean, default: false },
    http: null,
    httpOptions: { type: Object, default: null },
    baseUrl: { type: String, default: 'http://localhost:8080' },
    controller: { type: String, default: 'fileManager' },
    buttonUse: { type: Boolean, default: false },
    buttonText: { type: String, default: 'Drag your file(s) here to begin<br> or click to browse' }
  },
  data: () => ({
    uploadReady: true,
    files: [],
  }),
  methods: {
    onChange(event) {
      // event.target.name
      // event.target.files
      // event.target.files.length
      const formData = new FormData()
      Array.from(Array(event.target.files.length).keys()).map(x => {
        var tmp
        if (this.multiple) {
          tmp = {
            fieldName: this.fieldName,
            fileName:
              this.autoName === true ? NewGuid() + getExtension(event.target.files[x].name) : event.target.files[x].name,
            file: event.target.files[x]
          }
        } else {
          tmp = {
            fieldName: this.fieldName,
            fileName: this.autoName ? NewGuid() + getExtension(event.target.files[x].name) : (this.fileName ? this.fileName + getExtension(event.target.files[x].name) : event.target.files[x].name),
            file: event.target.files[x]
          }
        }
        formData.append(tmp.fieldName, tmp.file, tmp.fileName)
        this.files.push(tmp)
        // console.log(this.files)
      })
      if (this.http)
        this.http.post(this.http.defaults.baseURL + this.controller, formData).then((rs) => {
          this.$emit('handleUpload', rs.data)
          this.clear();
        })
      else
        axios.post(this.baseUrl + this.controller, formData, { headers: this.httpOptions }).then((rs) => {
          // console.log(rs.data);
          this.$emit('handleUpload', rs.data)
          this.clear();
        });

      // console.log(this.http)
    },
    clear() {
      this.uploadReady = false
      this.$nextTick(() => { this.uploadReady = true })
      this.files = []
    }
  }
}
</script>

<style lang="scss">
.file-upload {
  position: relative;
}

.file-upload-content {
  outline: 1px dashed #b1b1b1;
  background: #fefefe;
  color: #bbb;
  position: relative;
  cursor: pointer;
}

.file-upload-content:hover {
  /*background: #dfdfdf;  when mouse over to the drop zone, change color */
  color: #8d8d8d;
}

.file-upload [type="file"] {
  opacity: 0;
  /* invisible but it's there! */
  cursor: pointer;
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
}

.file-upload p {
  font-size: 16px;
  text-align: center;
  padding: 10px 0;
}

.file-upload .fa {
  color: #007bff;
}

.file-upload label {
  /* position: absolute; */
  /* right: -8px; */
  /* top: -3px; */
}

.btn-upload {
}

.btn-upload [type="file"] {
  display: none;
}
</style>
