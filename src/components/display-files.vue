<template>
  <div class="display-file">
    <div :key="index" v-for="(item, index) in files" class="list-file">
      <v-tooltip bottom>
        <div slot="activator" class="file-item">
          <div class="file-item-content">
            <div :class="[classes,'file-item-view']">
              <img :src="`${baseUrl}/${preFixName}/${item.name}`" :title="item.name" v-if="item.name.getExt().isImage()">
              <a :href="`${baseUrl}/${preFixName}/${item.name}`" target="_blank"
                v-else-if="item.name.getExt().isAudio()">
                <i v-if="icon==='data-type'">{{item.name.getExt().toUpperCase()}}</i>
                <i v-else class="material-icons">{{icon?icon:'audiotrack'}}</i>
              </a>
              <a :href="`${baseUrl}/${preFixName}/${item.name}`" target="_blank"
                v-else-if="item.name.getExt().isVideo()">
                <i v-if="icon==='data-type'">{{item.name.getExt().toUpperCase()}}</i>
                <i v-else class="material-icons">{{icon?icon:'camera_roll'}}</i>
              </a>
              <a :href="`${baseUrl}/${preFixName}/${item.name}`" target="_blank"
                v-else-if="item.name.getExt().isPdf()">
                <i v-if="icon==='data-type'">{{item.name.getExt().toUpperCase()}}</i>
                <i v-else class="material-icons">{{icon?icon:'picture_as_pdf'}}</i>
              </a>
              <a :href="`${baseUrl}/${preFixName}/${item.name}`" target="_blank" v-else>
                <i v-if="icon==='data-type'">{{item.name.getExt(false).toUpperCase()}}</i>
                <i v-else class="material-icons">{{icon?icon:'insert_drive_file'}}</i>
              </a>
            </div>
          </div>
          <div class="file-item-title" v-if="isShowName">{{item.name}}</div>
        </div>
        <span>{{item.name}}</span>
      </v-tooltip>
    </div>
  </div>
</template>

<script>
// import { isImage, isAudio, isVideo, isPdf } from '@/plugins/helpers';
export default {
  props: {
    files: { type: Array, default: () => [] },
    baseUrl: { type: String, default: '' },
    preFixName: { type: String, default: '' },
    classes: { type: String, default: 'w-50' },
    isShowName: { type: Boolean, default: true },
    icon: { type: String, default: null },
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
.p-10 {
  padding: 10px !important;
}
</style>
