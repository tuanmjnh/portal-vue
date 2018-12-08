<template>
  <div class="file-upload">
    <div v-if="button" class="file-upload-content">
      <input type="file" id="file-upload" :multiple="multiple===true?true:false" @change="onChange($event)" />
      <p>
        Drag your file(s) here to begin<br> or click to browse
      </p>
    </div>
    <div v-else>
      <div class="btn-upload">
        <input type="file" id="file-upload" :multiple="multiple===true?true:false"
          @change="onChange($event)" />
        <label for="file-upload" class="mat-icon-button mat-primary"><i class="material-icons">cloud_upload</i></label>
      </div>
    </div>
  </div>

</template>

<script>
import { NewGuid, CheckExtension, GetExtension } from '@/plugins/helpers';
export default {
  props: {
    multiple: { type: Boolean, default: false },
    fieldName: { type: String, default: 'file-upload' },
    renameFile: { type: Boolean, default: false },
    files: { type: Array, default: null },
    baseUrl: { type: String, default: 'http://localhost:8080' },
    controller: { type: String, default: 'upload' },
    httpOptions: { type: Object, default: null },
    button: { type: String, default: 'upload' }
  },
  methods: {
    onChange(event) {
      const files = event.target.files;
      const formData = new FormData();
      Array.from(Array(files.length).keys()).map(x => {
        var tmp;
        if (this.multiple) {
          tmp = {
            fieldName: this.fieldName,
            fileName:
              this.renameFile === true
                ? NewGuid() + GetExtension(files[x].name)
                : files[x].name,
            file: files[x]
          };
        } else {
          tmp = {
            fieldName: this.fieldName,
            fileName: this.renameFile
              ? this.renameFile + GetExtension(files[x].name)
              : files[x].name,
            file: files[x]
          };
        }
        formData.append(tmp.fieldName, tmp.file, tmp.fileName);
        this.files.push(tmp);
      });
      this.http
        .post(
          this.baseUrl + this.controller,
          formData,
          this.httpOptions
        )
        .subscribe((res) => {
          this.files = res.files;
          this.fileUploadInput.nativeElement.value = '';
          console.log(res);
        });
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

.file-upload [type='file'] {
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

.btn-upload [type='file'] {
  display: none;
}
</style>
