<template>
  <div class="display-file">
    <div :key="index" v-for="(item, index) in files" class="list-file">
      <div class="file-item">
        <div class="file-item-content">
          <div :class="[classes,'file-item-view']">
            <img :src="baseUrl+item.full_name" :title="item.name" v-if="item.extension.isImage()">
            <a :href="baseUrl+item.full_name" target="_blank" v-else-if="item.extension.isAudio()">
              <i class="material-icons">audiotrack</i>
            </a>
            <a :href="baseUrl+item.full_name" target="_blank" v-else-if="item.extension.isVideo()">
              <i class="material-icons">camera_roll</i>
            </a>
            <a :href="baseUrl+item.full_name" target="_blank" v-else-if="item.extension.isPdf()">
              <i class="material-icons">picture_as_pdf</i>
            </a>
            <a :href="baseUrl+item.full_name" target="_blank" v-else>
              <i class="material-icons">insert_drive_file</i>
            </a>
          </div>
        </div>
        <div class="file-item-title" v-if="isShowName">{{item.name}}</div>
      </div>
    </div>
  </div>
</template>

<script>
// import { isImage, isAudio, isVideo, isPdf } from '@/plugins/helpers';
export default {
  props: {
    files: { type: Array, default: null },
    baseUrl: { type: String, default: '' },
    classes: { type: String, default: 'w-50' },
    isShowName: { type: Boolean, default: true },
  },
  methods: {
    // getExtension(extension) {
    //   if (isImage(extension)) return 'image';
    //   else if (isAudio(extension)) return 'audio';
    //   else if (isVideo(extension)) return 'video';
    //   else if (isPdf(extension)) return 'pdf';
    //   else return 'file';
    // }
  }
}
</script>

<style lang="scss">
.list-file {
  float: left;
}
.file-item-view {
  border: 1px solid #ccc;
  text-align: center;
  vertical-align: middle;
  img,
  i {
    text-align: center;
    vertical-align: middle;
  }
  i {
    color: #0a74dd;
  }
  a {
    display: block;
  }
}
.file-item-view:hover {
  cursor: pointer;
  i {
    color: #2196f3;
    cursor: pointer;
  }
}
.w-25 {
  width: 25px;
  img {
    width: 23px;
    padding: 3px;
  }
}
.w-50 {
  width: 50px;
  img {
    width: 46px;
    padding: 3px;
  }
}
.w-100 {
  width: 100px;
  img {
    width: 98px;
    padding: 3px;
  }
}
.w-150 {
  width: 150px;
  img {
    width: 146px;
    padding: 3px;
  }
}
.w-200 {
  width: 200px;
  img {
    width: 195px;
    padding: 3px;
  }
}
.w-300 {
  width: 300px;
  img {
    width: 290px;
    padding: 3px;
  }
}
</style>
