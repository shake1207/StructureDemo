<template>
  <b-container class="upload-panel p-2">
    <b-card class="h-100">
      <b-container fluid>
        <b-form-file
          v-model="file"
          placeholder="Choose a file or drop it here..."
          drop-placeholder="Drop file here..."
          accept=".jpg, .png"
          @change="onImageChange"
        />
        <b-button class="my-1" @click="upload">Upload</b-button>
        <div class="my-1">Selected File:{{ file ? file.name : "" }}</div>
        <div class="w-100" style="overflow: auto">
          <img v-if="url" id="imgPreview" :src="url" alt="Your Image">
        </div>
      </b-container>
    </b-card>
  </b-container>
</template>

<script>
import { apiUpload } from '@/apis/apis';
export default {
  name: 'Upload',
  data() {
    return {
      file: null,
      url: null
    };
  },
  methods: {
    onImageChange(e) {
      console.log(e);
      const file = e.target.files[0];
      this.url = URL.createObjectURL(file);
    },
    upload() {
      const formData = new FormData();
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      };
      const api = `${process.env.VUE_APP_BASE_API}/api/Sample/Upload`;

      formData.append('file', this.file);

      apiUpload(api, formData, config).then(response => {
        // if status: 200, statusText: "OK"
        // let msg = "";
        // if (response.status === 200 && response.statusText === "OK") msg = "Uploaded successed";
        // else msg = "Uploaded fail";
        // this.$bvModal.msgBoxOk(msg, {
        //   title: "Message",
        //   buttonSize: "sm"
        console.log(response);
      });
      // })
      // .catch(error => error);
    }
  }
};
</script>
