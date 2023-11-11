const open = document.querySelector('#open'),
video = document.querySelector('video'),
capture = document.querySelector('#capture'),
download = document.querySelector('#download'),
preview = document.querySelector('.preview');


async function initCamera(){
    try {
        const stream = await navigator.mediaDevices.getUserMedia({video: true});
        video.srcObject = stream;
        video.play();
        open.textContent = "Camera Opened";
        open.disabled = true;
        video.removeAttribute('hidden');
        capture.removeAttribute('hidden');
    } catch (error) {
        console.error("Camera access denied:", error.message);
        alert("Camera access denied ");
    }
}

open.addEventListener('click', initCamera);
capture.addEventListener('click', captureImage);
download.addEventListener('click', downloadImage);

function captureImage() {
    var canvas = document.createElement('canvas');
    canvas.width = video.clientWidth;
    canvas.height = video.clientHeight;
    var ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    var img = document.createElement('img');
    img.src = canvas.toDataURL();
    preview.appendChild(img);
    download.removeAttribute('hidden');
};


function downloadImage() {
    var image = preview.querySelector('img');
    download.download = 'image.png';
    download.href = image.src;
    download.click();
}


