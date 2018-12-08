<template>
  <div class="display-file">
    <div *ngFor="let item of files" class="list-file">
      <div class="file-item">
        <div class="file-item-content">
          <div class="w-50 file-item-view">
            <img *ngIf="getExtension(item.extension)==='image'" [src]="this.config.baseUrl.replace('api/', '')+item.full_name"
              [title]="item.name">
            <i *ngIf="getExtension(item.extension)==='audio'" class="material-icons">audiotrack</i>
            <i *ngIf="getExtension(item.extension)==='video'" class="material-icons">camera_roll</i>
            <i *ngIf="getExtension(item.extension)==='pdf'" class="material-icons">picture_as_pdf</i>
            <i *ngIf="getExtension(item.extension)==='file'" class="material-icons">insert_drive_file</i>
          </div>
        </div>
        <div class="file-item-title">{{item.name}}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { isImage, isAudio, isVideo, isPdf } from '@/plugins/helpers';
export default {
  props: {
    files: { type: Array, default: null }
  },
  methods: {
    getExtension(extension) {
      if (isImage(extension)) return 'image';
      else if (isAudio(extension)) return 'audio';
      else if (isVideo(extension)) return 'video';
      else if (isPdf(extension)) return 'pdf';
      else return 'file';
    }
  }
}
</script>

<style lang="scss">
.file-item-view {
  border: 1px solid #ccc;
}

.w-50 {
  width: 50px;
  text-align: center;
  vertical-align: middle;

  img {
    width: 50px;
    padding: 3px;
  }
}
</style>
