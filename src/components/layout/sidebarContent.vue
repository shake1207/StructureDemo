<template>
  <div class="sidebar-content">
    <div class="tag-search-area">
      <b-input-group size="sm">
        <b-input-group-prepend is-text>
          <font-awesome-icon :icon="['fas', 'search']" />
        </b-input-group-prepend>
        <b-form-input v-model="search" type="search" placeholder="Search tags" />
      </b-input-group>
    </div>
    <div class="content-clear"><u class="text" @click="clearAll">Clear All</u></div>
    <div v-for="(catagory, index) in filterTags" :key="index" class="sidebar-content-catagory">
      <div v-b-toggle="`collapse-${index}`" class="sidebar-content-catagory-head">
        <span class="sidebar-text">{{ catagory.SeriesTagName }}</span>
        <button v-if="catagory.SeriesTagItems.length > 0" class="btn expand-btn float-right">
          <font-awesome-icon class="when-close" :icon="['fas', 'plus']" />
          <font-awesome-icon class="when-open" :icon="['fas', 'minus']" />
        </button>
      </div>
      <b-collapse :id="`collapse-${index}`" v-model="collapses[index]" class="w-100">
        <b-list-group
          v-for="(tag, index) in catagory.SeriesTagItems"
          :key="index"
          class="collapse-content"
        >
          <b-list-group-item class="collapse-content-item">
            <b-form-checkbox
              v-model="selectedTags"
              class="custom-control-element"
              :value="tag"
              inline
            >
              <span>{{ tag.TagName }}</span>
              <span class="ml-1">{{ tag.SampleAmount }}</span>
            </b-form-checkbox>
          </b-list-group-item>
        </b-list-group>
      </b-collapse>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'SideBarMenu',
  data() {
    return {
      selectedTags: [],
      search: '',
      collapses: []
    };
  },
  computed: {
    ...mapGetters('TagList', {
      getTagList: 'getTagList',
      getSelectedTags: 'getSelectedTags'
    }),
    filterTags() {
      const categories = JSON.parse(JSON.stringify(this.getTagList));
      const value = this.search;
      const reg = new RegExp(value, 'i');
      const filterResult = categories.filter(category => {
        category.SeriesTagItems = category.SeriesTagItems.filter(
          tag => reg.test(tag.TagName) === true
        );
        return category.SeriesTagItems.length > 0;
      });

      filterResult.forEach((r, index) => {
        this.collapses[index] = value ? true : false;
      });
      return filterResult;
    }
  },
  watch: {
    selectedTags: {
      handler(value) {
        this.$store.dispatch('TagList/setSelectedTags', value);
      },
      deep: true
    },
    getSelectedTags: {
      handler(value) {
        this.selectedTags = value;
        this.$router.push({ name: 'main' }).catch(error => console.log(error));
      },
      deep: true
    }
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      this.$store.dispatch('TagList/getTags');
      this.selectedTags = this.getSelectedTags;
    },
    async clearAll() {
      this.$emit('closeLayer');
      await this.$nextTick();
      this.selectedTags = [];
    }
  }
};
</script>
<style lang="scss" scoped>
@import "@/assets/scss/ThemColors.scss";

* {
  scrollbar-width: thin;
  scrollbar-color: $scrollbar-color $black;
}

*::-webkit-scrollbar-track {
  background: $scrollbar-color;
}
*::-webkit-scrollbar-thumb {
  background: $black;
  border-radius: 20px;
  border: 3px solid $scrollbar-color;
}

.btn:focus,
.btn.focus {
  outline: 0;
  box-shadow: none;
}

.block-container {
  display: flex;
  align-items: center;
}

.tag-search-area {
  padding: 0.4rem 0.8rem;
}
.content-clear {
  padding: 0.4rem 0.8rem;
  text-align: right;
  font-family: inherit;
  color: $dark-font;

  .text {
    cursor: pointer;
  }
}

.collapse-content {
  width: 100%;
  cursor: pointer;

  .collapse-content-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-direction: row;
    background: none;
    border: none;
    padding: 0.2rem 0.8rem;
    color: #585858;

    &:hover {
      padding: 0.2rem 0.8rem;
      border-radius: 0;
      color: $white;
      background: #bbbbbb;
    }
  }
}

::v-deep .custom-control-inline {
  &.custom-control-element {
    width: 100%;
  }

  .custom-control-label {
    width: 100%;
    display: flex;
    justify-content: space-between;
    cursor: pointer;
  }
}

.custome-group-list {
  .custome-group-list-item {
    background: transparent;
    display: flex;
    padding: 0.5rem;
    color: $dark-font;
    border: none;
    cursor: default;

    &:hover {
      background: $pink;
      color: $white;
    }

    .item-name {
      width: 80%;
      text-align: left;
      cursor: pointer;
    }

    .item-count {
      width: 20%;
      text-align: right;
      cursor: pointer;
    }

    &.selected {
      background: $pink;
      color: $white;
    }
  }
}
</style>
