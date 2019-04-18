const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');

/* 在Canvas内实现一系列滤镜效果 */
function redEffect(pixels) {
  for (let i = 0; i < pixels.data.length; i+=4) {
    pixels.data[i + 0] = pixels.data[i + 0] + 200; // RED
    pixels.data[i + 1] = pixels.data[i + 1] - 50; // GREEN
    pixels.data[i + 2] = pixels.data[i + 2] * 0.5; // Blue
  }
  return pixels;
}

function rgbSplit(pixels) {
  for (let i = 0; i < pixels.data.length; i+=4) {
    pixels.data[i - 150] = pixels.data[i + 0]; // RED
    pixels.data[i + 500] = pixels.data[i + 1]; // GREEN
    pixels.data[i - 550] = pixels.data[i + 2]; // Blue
  }
  return pixels;
}

const filterFns = {redEffect, rgbSplit}

/* 把摄像头捕获的实时内容放进<Video/>里 */
function getVideo() {
  navigator.mediaDevices.getUserMedia({ video: true, audio: false })
    .then(localMediaStream => {
      video.srcObject = localMediaStream
      video.play()
    })
    .catch(err => {
      console.error(err.message)
    })
}





/* 把Video里的内容同步到Canvas上 */
// 摄像头 → video → canvas 为什么要经过video: video can play resources, but we can only paint to make canvas show contents
function paintToCanvas() {
  // resize Canvas to the size of the video
  const {videoWidth: width, videoHeight: height} = video
  canvas.width = width
  canvas.height = height

  // paint in every 16ms
  return setInterval(() => {
    ctx.drawImage(video, 0, 0, width, height)

    filterCanvas(ctx, width, height)

  }, 16)
}

function filterCanvas(ctx, width, height) {
  const pixels = ctx.getImageData(0,0,width, height)
  const radioes = document.querySelectorAll('input[type="radio"]')
  radioes.forEach(item => {
    if (item.checked) {
      filterFns[item.name](pixels)
    }

  })
  ctx.putImageData(pixels, 0, 0)
}

/* 截图功能
* 创建点击后可下载的图片链接
* */
function takePhoto() {
  snap.currentTime = 0
  snap.play()

  const data = canvas.toDataURL('image/jpeg') // 导出图片 base64编码后的数据
  const link = document.createElement('a')
  link.href = data;
  link.setAttribute('download', 'screenshots')
  link.innerHTML = `<img src="${data} alt="Man" />`
  strip.insertBefore(link, strip.firstChild)
}




getVideo()
video.addEventListener('canplay', paintToCanvas)
