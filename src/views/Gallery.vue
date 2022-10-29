<template>
  <div class="gallery">
    <div class="container">
      <div class="title">
        <h1>Desk Setup Gallery</h1>
        <p>Find the latest uploaded desk setup photos here!<br>Generate new setup ideas with #SetupForLife</p>
      </div>
      <ul class="img-block">
        <li v-for="(i,idx) in perPage"
            data-aos="fade-up"
            data-aos-duration="800"
            :key="idx"
            @click="showImg(i.image[0].url,i.name,i.description)">
          <div class="imgs">
            <img :src="i.image[0].url"
                 :alt="i.name">
          </div>
          <p>{{i.name || "Mr.BenQ"}}</p>
        </li>
      </ul>
      <ul class="pagination">
        <li @click="changePage(1)">
          <img src="../assets/arrow-left-double.svg"
               alt="first page">
        </li>
        <li @click="prevPage">
          <img src="../assets/arrow-left.svg"
               alt="previous page">
        </li>
        <li class="number"
            v-for="(p,idx) in pageData(pageArr)"
            :key="idx"
            :class="{active:curPage===p}"
            @click="changePage(p)">{{p}}</li>
        <li @click="nextPage"><img src="../assets/arrow-right.svg"
               alt="next page"></li>
        <li @click="changePage(totalPage)"><img src="../assets/arrow-right-double.svg"
               alt="last page"></li>
      </ul>
      <div class="show-large"
           v-if="isShow">
        <div class="show-block"
             data-aos="zoom-in"
             data-aos-duration="200">
          <button class="close-btn"
                  @click="isShow = false">
            <span></span>
            <span></span>
          </button>
          <div class="show-img">
            <img :src="showData.imgUrl"
                 alt="preview image">
          </div>
          <div class="show-content">
            <h3>{{showData.name || "Mr.BenQ"}}</h3>
            <p>{{showData.description || "這是一張圖片這是一張圖片這是一張圖片這是一張圖片這是一張圖片這是一張圖片這是一張圖片這是一張圖片這是一張圖片"}}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { totalImage, listImage } from '../api/benq.js'
export default {
  name: 'Gallery',
  data() {
    return {
      showData: {
        imgUrl: '',
        name: '',
        description: '',
      },
      curPage: 1,
      isShow: false,
      totalNum: 1,
      totalPage: 1,
      pageArr: [],
      perPage: [],
      itemPerPage: 20,
    }
  },
  methods: {
    prevPage() {
      if (this.curPage === 1) {
        return
      } else {
        this.curPage -= 1
        this.getPerPage(this.curPage)
      }
    },
    nextPage() {
      if (this.curPage === this.totalPage) {
        return
      } else {
        this.curPage += 1
        this.getPerPage(this.curPage)
      }
    },
    changePage(p) {
      if (this.curPage === p) {
        return
      }
      this.curPage = p
      this.getPerPage(p)
    },
    getPerPage(p) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      })
      console.log(p, p * this.itemPerPage - this.itemPerPage, p * this.itemPerPage)
      let axiosParams = new URLSearchParams()
      axiosParams.append('_sort', 'created_at:desc')
      axiosParams.append('_start', p * this.itemPerPage - this.itemPerPage)
      axiosParams.append('_limit', this.itemPerPage)

      let params = {
        params: axiosParams,
      }

      listImage(params)
        .then((res) => {
          this.perPage = res.data
          return this.perPage
        })
        .then((res) => {
          if (res.length === 20) {
            setHeight()
          }
          function setHeight() {
            const _h = document.body.scrollHeight //取得網頁高度
            parent.postMessage({ h2: _h }, '*') //將高度值，傳到父層
          }
        })
        .catch((err) => console.log(err))
    },
    showImg(img, name, description) {
      this.showData = {
        imgUrl: img,
        name: name,
        description: description,
      }
      this.isShow = true
    },
    async getTotalNum() {
      try {
        const res = await Promise.all([totalImage()])
        return res
      } catch (err) {
        throw new Error(err)
      }
    },
  },
  computed: {
    pageData() {
      return (data) => {
        if (this.totalPage <= 5 || this.curPage <= 3) {
          return data.filter((i) => i <= 5)
        } else if (this.curPage > 3 && this.curPage < this.totalPage - 2) {
          return [this.curPage - 2, this.curPage - 1, this.curPage, this.curPage + 1, this.curPage + 2]
        } else {
          return data.filter((i) => i > this.totalPage - 5)
        }
      }
    },
  },
  mounted() {
    this.getTotalNum().then((res) => {
      this.totalNum = res[0].data
      this.totalPage = Math.ceil(this.totalNum / this.itemPerPage)
      for (let i = 0; i < this.totalPage; i++) {
        this.pageArr.push(+i + 1)
      }
      this.getPerPage(1)
    })
  },
}
</script>
<style lang="scss" scoped>
@import '../assets/style/SCSS/_mixin.scss';
.title {
  margin-bottom: 20px;
}
p {
  padding-bottom: 32px;
  text-align: center;
}
.img-block {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  @include mobile {
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: 1fr;
  }
  li {
    cursor: pointer;
  }
  .imgs {
    width: 100%;
    aspect-ratio: 1 / 1;
    padding: 8px;
    border: 4px solid $main-color;
  }
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  p {
    padding: 4px 8px 8px;
    background-color: $main-color;
    color: #fff;
    font-size: 20px;
    font-weight: 500;
    @include mobile {
      font-size: 14px;
    }
  }
}

.pagination {
  margin: 80px 0;
  display: flex;
  justify-content: center;
  li {
    padding: 8px;
    font-size: 1.2rem;
    cursor: pointer;
  }
  .number {
    padding: 12px;
  }
  .active {
    color: $main-color;
  }
  @include mobile {
    margin: 40px 0;
    li {
      padding: 4px;
    }
    img {
      transform: scale(0.7);
    }
  }
}
.show-large {
  padding: 135px;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  max-height: 667px;
  background-color: rgba(0, 0, 0, 0.4);
  @include mobile {
    padding: 100px 30px;
  }
}
.show-block {
  padding: 80px;
  display: grid;
  width: 100%;
  height: 100%;
  gap: 40px;
  grid-template-columns: 3fr 1fr;
  background-color: #fff;
  @include pad {
    padding: 60px 30px;
    grid-template-columns: 1fr;
    grid-template-columns: 1fr;
  }
}
.show-img {
  overflow: hidden;
  @include pad {
    margin-bottom: 40px;
  }
}
.show-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  h3 {
    padding-bottom: 10px;
  }
  p {
    text-align: start;
  }
}
.close-btn {
  z-index: 10;
  padding: 16px;
  position: absolute;
  top: 20px;
  right: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background-color: transparent;
  color: #000;
  cursor: pointer;
  span {
    position: absolute;
    display: inline-block;
    left: 7px;
    width: 20px;
    height: 2px;
    background-color: #000;
    &:first-child {
      transform: rotate(45deg);
    }
    &:last-child {
      transform: rotate(-45deg);
    }
  }
}
</style>