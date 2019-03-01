<template>
  <div class="file-upload" v-if="uploadReady">
    <div class="btn-upload" v-if="buttonUse">
      <input type="file" id="file-upload" :multiple="multiple===true?true:false" @change="onChange($event)"
        :accept="extension" />
      <label for="file-upload" class="v-btn v-btn--icon theme--info primary--text"><i
          class="material-icons">cloud_upload</i></label>
    </div>
    <div v-else class="file-upload-content">
      <input type="file" id="file-upload" :multiple="multiple===true?true:false" @change="onChange($event)"
        :accept="extension" />
      <p v-html="buttonText"></p>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { NewGuid } from '@/plugins/helpers';
export default {
  props: {
    http: null,
    httpOptions: { type: Object, default: null },
    baseUrl: { type: String, default: 'http://localhost:8080/filemanager' },
    basePath: { type: String, default: 'Uploads' },
    fieldName: { type: String, default: 'file-upload' },
    fileName: { type: String, default: null },
    multiple: { type: Boolean, default: false },
    autoName: { type: Boolean, default: false },
    buttonUse: { type: Boolean, default: false },
    buttonText: { type: String, default: 'Drag your file(s) here to begin<br> or click to browse' },
    extension: { type: String, default: null },
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
              this.autoName === true ? NewGuid() + event.target.files[x].name.getExt() : event.target.files[x].name,
            file: event.target.files[x]
          }
        } else {
          tmp = {
            fieldName: this.fieldName,
            fileName: this.autoName ? NewGuid() + event.target.files[x].name.getExt() : (this.fileName ? this.fileName + event.target.files[x].name.getExt() : event.target.files[x].name),
            file: event.target.files[x]
          }
        }
        formData.append(tmp.fieldName, tmp.file, tmp.fileName)
        formData.append('basePath', this.basePath)
        this.files.push(tmp)
        // console.log(this.files)
      })
      if (this.http)
        this.http.post(this.http.defaults.baseURL + this.http.defaults.upload, formData).then((rs) => {
          this.$emit('handleUpload', Object.assign(rs.data, { basePath: this.basePath }))
          this.clear();
        })
      else
        axios.post(this.baseUrl, formData, { headers: this.httpOptions }).then((rs) => {
          // console.log(rs.data);
          this.$emit('handleUpload', Object.assign(rs.data, { basePath: this.basePath }))
          this.clear();
        });
      // console.log(this.http.defaults)
    },
    clear() {
      this.uploadReady = false
      this.$nextTick(() => { this.uploadReady = true })
      this.files = []
    }
  }
}

// file_extension	A file extension starting with the STOP character, e.g: .gif, .jpg, .png, .doc
// audio: audio/*	All sound files are accepted
// video: video/*	All video files are accepted
// image: image/*	All image files are accepted
// pdf: application/pdf
// csv: .csv
// xls: application/vnd.ms-excel
// xlsx: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
// txt: text/plain
// html: text/html

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
  // color: #8d8d8d;
  color: #3684d8;
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
