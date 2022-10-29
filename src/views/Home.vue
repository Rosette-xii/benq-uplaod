<template>
  <div class="home">
    <div class="container">
      <h2>Upload Photo</h2>
      <div class="upload-block"
           v-if="imgSrc===''">
        <label for="choose-img"
               class="btn">Choose A Photo</label>
        <input id="choose-img"
               type="file"
               accept="image/png, image/jpeg"
               style="display:none"
               @change="getImgUrl($event)">
      </div>
      <div class="upload-block preview"
           v-else>
        <div class="uploaded-img">
          <img :src="imgSrc"
               alt="preview image">
        </div>
        <div class="re-choose-btn">
          <label for="re-choose-img"
                 class="btn">Choose Again</label>
          <input id="re-choose-img"
                 type="file"
                 accept="image/png, image/jpeg"
                 style="display:none"
                 @change="getImgUrl($event)">
          <div class="uploading"
               v-show="isLoading">
            <div class="color"></div>
          </div>
        </div>
      </div>
      <form class="content-block">
        <ul>
          <li>
            <label for="name">Name</label>
            <input type="text"
                   :style="bindInputStyle"
                   id="name"
                   maxlength="18"
                   placeholder="up to 18 characters"
                   v-model="userData.name"
                   required>
          </li>
          <li>
            <label for="email">Email Address</label>
            <input type="email"
                   ref="emailInput"
                   :style="bindInputStyle"
                   id="email"
                   placeholder="example@mail.com"
                   v-model="userData.email"
                   required>
          </li>
          <li>
            <label for="description">Description</label>
            <textarea :style="bindInputStyle"
                      id="description"
                      cols="30"
                      rows="4"
                      maxlength="100"
                      placeholder="up to 100 characters"
                      v-model="userData.description"
                      required></textarea>
          </li>
          <li>
            <input type="checkbox"
                   ref="checkbox"
                   id="privacy"
                   v-model="isCheck"
                   required>
            <label for="privacy">I have read and agree to the
              <a href="https://www.benq.com/en-us/policy/privacy-policy.html"
                 target="_blank">privacy policy</a>.
            </label>
          </li>
        </ul>
        <button class="btn"
                @click.prevent="uploadImg"
                :disabled="!isCheck">Upload</button>
      </form>
    </div>
    <div class="submit"
         v-if="isSubmit">
      <div class="submit-content"
           data-aos="zoom-in"
           data-aos-duration="400">
        <p>Uploading success!<br>
          Your photo is under review.</p>
        <button @click="closeSubmit"
                class="btn">OK</button>
      </div>
    </div>
  </div>
</template>

<script>
import { uploadImage } from '../api/benq.js'
export default {
  name: 'Home',
  data() {
    return {
      userData: {
        imgSrc: '',
        name: '',
        email: '',
        description: '',
      },
      imgSrc: '',
      uploadData: '',
      isLoading: false,
      isCheck: false,
      isSubmit: false,
      inputColor: '#B0B4B9',
    }
  },
  methods: {
    uploadImg() {
      const emailRegxp = /^([\w]+)(.[\w]+)*@([\w]+)(.[\w]{2,3}){1,2}$/
      // 驗證圖片
      if (this.imgSrc === '') {
        alert('請上傳圖片')
        return
      }
      // 驗證名字、email、descrition
      if (this.userData.name === '' || this.userData.email == '' || this.userData.description === '') {
        this.inputColor = 'red'
        setTimeout(() => {
          this.inputColor = '#626466'
        }, 1000)
      } else if (emailRegxp.test(this.userData.email) != true) {
        alert('電子信箱格式錯誤')
        this.$refs.emailInput.focus()
      } else {
        const formData = new FormData()
        formData.append('files.image', this.uploadData)
        // 為了符合 strapi 上傳圖片規範，傳入 obj 空物件
        let obj = {
          published_at: null,
          name: this.userData.name.trim(),
          email: this.userData.email.trim(),
          description: this.userData.description.trim(),
        }
        formData.append('data', JSON.stringify(obj))
        uploadImage(formData)
          .then((response) => {
            if (response.status === 200) {
              this.isSubmit = true
            }
          })
          .catch((err) => {
            console.log(err)
          })
      }
    },
    getImgUrl(e) {
      this.isLoading = true
      this.imgSrc = URL.createObjectURL(e.target.files[0])
      this.uploadData = e.target.files[0]
      setTimeout(() => {
        this.isLoading = false
      }, 2000)
    },
    closeSubmit() {
      this.userData = {
        imgSrc: '',
        name: '',
        email: '',
        description: '',
      }
      this.imgSrc = ''
      this.isCheck = false
      this.isSubmit = false
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      })
    },
  },
  computed: {
    bindInputStyle() {
      return {
        '--placeholderColor': this.inputColor,
      }
    },
  },
  mounted() {
    function setHeight() {
      const _h = document.body.scrollHeight //取得網頁高度
      parent.postMessage({ h: _h }, '*') //將高度值，傳到父層
    }
    setHeight()
  },
}
</script>
<style lang="scss" scoped>
@import '../assets/style/SCSS/_mixin.scss';
h2 {
  padding: 32px 0;
  font-size: 2.5rem;
  font-family: multi-display, sans-serif;
  font-weight: 700;
  font-style: italic;
  text-align: center;
}
.upload-block {
  height: 360px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f4f0ea;
  background-image: url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' stroke='%23AD9874FF' stroke-width='3' stroke-dasharray='20' stroke-dashoffset='0' stroke-linecap='square'/%3e%3c/svg%3e");
}
.upload-block.preview {
  position: relative;
  padding: 20px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  @include mobile {
    grid-template-columns: 1fr;
    grid-template-rows: 2fr 1fr;
  }
}
.uploading {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background-color: #f4f0ea;
  background-image: url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' stroke='%23AD9874FF' stroke-width='3' stroke-dasharray='20' stroke-dashoffset='0' stroke-linecap='square'/%3e%3c/svg%3e");
  .color {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    transform-origin: left;
    background-color: #fff;
    width: 600px;
    height: 18px;
    border-radius: 15px;
    &::after {
      content: '';
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      background-color: $main-color;
      border-radius: 15px;
      clip-path: polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%);
      animation: progress 2s linear;
    }
    @include mobile {
      width: 250px;
    }
  }
}
@keyframes progress {
  0% {
    clip-path: polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%);
  }
  25% {
    clip-path: polygon(0% 0%, 50% 0%, 50% 100%, 0% 100%);
  }
  50% {
    clip-path: polygon(0% 0%, 75% 0%, 75% 100%, 0% 100%);
  }
  75% {
    clip-path: polygon(0% 0%, 85% 0%, 85% 100%, 0% 100%);
  }
  100% {
    clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%);
  }
}
.uploaded-img {
  display: flex;
  justify-content: center;
  height: 100%;
  overflow: hidden;
}
.re-choose-btn {
  display: flex;
  justify-content: center;
}
.content-block {
  margin: 32px auto;
  width: 50%;
  @include pad {
    width: 80%;
  }
  @include mobile {
    width: 100%;
  }
  li {
    padding-bottom: 24px;
    position: relative;
    display: flex;
    flex-direction: column;
    &:last-child {
      display: block;
      label {
        padding-left: 16px;
        font-weight: normal;
        @include mobile {
          padding-left: 0px;
        }
      }
    }
  }
  label {
    padding-bottom: 8px;
    font-size: 0.8rem;
    font-weight: bold;
  }
  input,
  textarea {
    padding: 8px 16px;
    vertical-align: middle;
    border: 1px solid $sub-color;
    font-family: 'Poppins', sans-serif;
    font-size: initial;
    &::placeholder {
      color: var(--placeholderColor);
    }
  }
  input[type='checkbox'] {
    transform: scale(1.5);
    transform-origin: center;
    @include mobile {
      transform: scale(1);
    }
  }
  a {
    font-size: 0.8rem;
  }
  .btn {
    position: relative;
    left: 50%;
    transform: translateX(-50%);
    transition: all 0.3s ease;
    &:disabled {
      background: #9fa2a5;
      color: #ccc;
      transition: all 0.3s ease;
      cursor: initial;
    }
  }
}
.arrow {
  display: inline-block;
  width: 15px;
  height: auto;
}
.submit {
  position: fixed;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100vh;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.4);
}
.submit-content {
  padding: 80px 120px;
  max-width: 790px;
  text-align: center;
  background-color: #fff;
  p {
    padding-bottom: 32px;
    font-size: 1.2rem;
    font-weight: bold;
  }
  @include mobile {
    padding: 30px;
  }
}
</style>