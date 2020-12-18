<template>
  <div class="conditions-collector">
    <span>Result Filter By：</span>
    <span v-b-toggle.content-collapse class="show-btn">
      <u class="when-close">Show Filters</u>
      <u class="when-open">Close Filters</u>
    </span>
    <b-collapse id="content-collapse" is-nav>
      <div class="content-bg p-2">
        <span v-if="queryText">{{ queryText }}</span>
        <div v-else-if="getSelectedTags.length > 0">
          <b-badge
            v-for="(tag, index) in getSelectedTags"
            :key="index"
            class="mx-1"
            variant="secondary"
          >{{ tag.TagName }}
          </b-badge>
        </div>
        <span v-else>No Filters...</span>
      </div>
    </b-collapse>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'ResultDisplay',
  data() {
    return {
      showContent: false
    };
  },
  computed: {
    ...mapGetters('TagList', {
      getSelectedTags: 'getSelectedTags'
    }),
    ...mapGetters('Sample', {
      queryText: 'queryText'
    })
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/scss/ThemColors.scss";

.conditions-collector {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-end;
  width: 100%;
  height: 5rem;

  .show-btn {
    color: $light-font;
  }
}
.content-container {
  display: none;

  &.active {
    display: block;
  }
}

#content-collapse {
  position: absolute;
  top: 7rem;
  left: 0;
  z-index: 99;
  color: $light-font;
  width: 100%;

  .content-bg {
    background: rgba(0, 0, 0, 0.2);
    border-bottom: 2px solid $secondary;
  }
}

@media (max-width: 576px) {
  .conditions-collector {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-end;
    width: 100%;
    height: 5rem;
  }
}
</style>
