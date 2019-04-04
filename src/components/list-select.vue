<template>
  <v-layout wrap align-center class="pt-2">
    <v-flex xs12 sm5 md5 :class="['list-items',classItems]">
      <div :class="['list-title',classTitle]">{{textItem}}</div>
      <hr class="v-divider theme--light">
      <div :class="['list-content',classContent]" :style="{minHeight:minHeight+'px',maxHeight:maxHeight+'px'}">
        <div v-for="(item,index) in itemsLeft" :key="index" :class="['list-item',classItem]"
          @click="onPush($event,item)">
          <slot v-if="hasSlotItems" name="items" :item="item"></slot>
          <template v-else>
            <v-checkbox v-if="checkbox" v-model="local_selected" :value="item" :label="item.title"></v-checkbox>
            <div v-else>{{item.title}}</div>
          </template>
        </div>
      </div>
    </v-flex>
    <v-flex v-if="checkbox" xs12 sm2 md2 :class="['list-items text-xs-center mt-3',classItems]">
      <div>
        <v-btn color="green" fab flat small dark @click="onHandle('pushAll')">
          <v-icon>last_page</v-icon>
        </v-btn>
      </div>
      <div>
        <v-btn color="green" fab flat small dark @click="onHandle('pushSelected')">
          <v-icon>arrow_right</v-icon>
        </v-btn>
      </div>
      <div>
        <v-btn color="deep-orange" fab flat small dark @click="onHandle('removeSelected')">
          <v-icon>arrow_left</v-icon>
        </v-btn>
      </div>
      <div>
        <v-btn color="deep-orange" fab flat small dark @click="onHandle('removeAll')">
          <v-icon>first_page</v-icon>
        </v-btn>
      </div>
    </v-flex>
    <v-spacer v-else></v-spacer>
    <v-flex xs12 sm5 md5 :class="['list-items',classItems]">
      <div :class="['list-title',classTitle]">{{textSelect}}</div>
      <hr class="v-divider theme--light">
      <div :class="['list-content',classContent]" :style="{minHeight:minHeight+'px',maxHeight:maxHeight+'px'}">
        <div v-for="(item,index) in itemsRight" :key="index" :class="['list-item',classItem]"
          @click="onRemove($event,item)">
          <slot v-if="item.slot" :name="item.slot" :item="item"></slot>
          <template v-else>
            <v-checkbox v-if="checkbox" v-model="local_selected" :value="item" :label="item.title"></v-checkbox>
            <div v-else>{{item.title}}</div>
          </template>
        </div>
      </div>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  props: {
    checkbox: { type: Boolean, default: false },
    itemsLeft: { type: Array, default: () => [] },
    itemsRight: { type: Array, default: () => [] },
    selected: { type: Array, default: null },
    textItem: { type: String, default: 'List data' },
    textSelect: { type: String, default: 'List selected' },
    minHeight: { type: Number, default: 250 },
    maxHeight: { type: Number, default: 250 },
    classItems: { type: String, default: null },
    classTitle: { type: String, default: null },
    classContent: { type: String, default: null },
    classItem: { type: String, default: null }
  },
  data: () => ({
    local_selected: []
  }),
  created() {
    // this.items.select = this.items.select ? this.items.select : []
    // console.log(this.selected)
  },
  computed: {
    hasSlotItems() {
    console.log(this.$slots, this.$scopedSlots)
    return !!this.$scopedSlots['items']
    }
  },
  watch: {
    // selected(val) {
    // this.items.select = this.items.select ? this.items.select : []
    // this.items.select = this.selected
    // console.log(this.items)
    // },
    // items: {
    //   handler(val) {
    //     console.log(val)
    //   },
    //   deep: true
    // },
  },
  methods: {
    onPush(event, item) {
      if (!this.checkbox) {
        this.$emit('update:itemsRight', [...this.itemsRight].pushIfNotExist(item))
        this.$emit('update:itemsLeft', [...this.itemsLeft].remove(item))
      } //  else {
      // if (event)
      //   this.$emit('update:selected', [...this.selected].pushIfNotExist(item))
      // else
      //   this.$emit('update:selected', [...this.selected].remove(item))
      // }
    },
    onRemove(event, item) {
      if (!this.checkbox) {
        this.$emit('update:itemsLeft', [...this.itemsLeft].pushIfNotExist(item))
        this.$emit('update:itemsRight', [...this.itemsRight].remove(item))
      } //else {
      //   this.$emit('update:selected', [...this.itemsRight].remove(item))
      // }
    },
    onHandle(action) {
      if (this.checkbox) {
        if (action === 'pushAll' && this.itemsLeft.length > 0) {
          this.$emit('update:itemsRight', [...this.itemsLeft, ...this.itemsRight])
          this.$emit('update:itemsLeft', [])
        } else if (action === 'pushSelected' && this.selected && this.selected.length > 0) {
          this.$emit('update:itemsRight', [...this.itemsRight].pushIfNotExist(this.selected))
          this.$emit('update:itemsLeft', [...this.itemsLeft].remove(this.selected))
        } else if (action === 'pushSelected' && this.local_selected && this.local_selected.length > 0) {
          this.$emit('update:itemsRight', [...this.itemsRight].pushIfNotExist(this.local_selected))
          this.$emit('update:itemsLeft', [...this.itemsLeft].remove(this.local_selected))
        } else if (action === 'removeSelected' && this.selected && this.selected.length > 0) {
          this.$emit('update:itemsLeft', [...this.itemsLeft].pushIfNotExist(this.selected))
          this.$emit('update:itemsRight', [...this.itemsRight].remove(this.selected))
        } else if (action === 'removeSelected' && this.local_selected && this.local_selected.length > 0) {
          this.$emit('update:itemsLeft', [...this.itemsLeft].pushIfNotExist(this.local_selected))
          this.$emit('update:itemsRight', [...this.itemsRight].remove(this.local_selected))
        } else if (action === 'removeAll' && this.itemsRight.length > 0) {
          this.$emit('update:itemsLeft', [...this.itemsLeft, ...this.itemsRight])
          this.$emit('update:itemsRight', [])
        }
        if (this.local_selected) this.$emit('update:selected', [])
        this.local_selected = []
      }
    },
    selectItem(event, item) {
      if (event) this.$emit('update:selected', [...this.selected.pushIfNotExist(item)])
      else this.$emit('update:selected', [...this.selected.remove(item)])
    }
  }
}
</script>

<style lang="scss">
.list-items {
  .list-content {
    overflow-x: hidden;
    overflow-y: scroll;
    position: relative;
    top: -1px;
  }

  .list-title {
    font-weight: bold;
    font-size: 14px;
    padding: 8px 0px 8px 10px;
  }
  .list-item {
    padding: 8px 0px 8px 10px;
    transition: inherit;
    &:hover {
      background-color: rgba(0, 0, 0, 0.04);
      cursor: pointer;
    }
  }
  .v-input--selection-controls {
    margin-top: 0px;
  }
  .v-input__slot {
    margin-bottom: 0px;
  }
  .v-messages {
    min-height: initial;
  }
}
</style>
