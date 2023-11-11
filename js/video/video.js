const open = document.querySelector('#open'),
record = document.querySelector('#record'),
stop = document.querySelector('#stop'),
pause = document.querySelector('#pause'),
download = document.querySelector('#download'),
video = document.querySelector('video'),
preview = document.querySelector('.preview video');


let mediaRecorder, stream;
const videoChunks = [];
let isRecording = false;
let isPaused = false;


open.addEventListener('click', initCamera);
record.addEventListener('click', startRecording);
stop.addEventListener('click', stopRecording);
pause.addEventListener('click', pauseRecord);


function initCamera(){
    stream = navigator.mediaDevices.getUserMedia({video: true, audio:true})
    .then((stream)=>{
        video.srcObject = stream;
        video.play();
        open.textContent = "Camera Opened";
        open.disabled = true;
        video.removeAttribute('hidden');
        record.removeAttribute('hidden');
        pause.removeAttribute('hidden');
        stop.removeAttribute('hidden');

        mediaRecorder = new MediaRecorder(stream);
        mediaRecorder.ondataavailable = (e)=>{
            if(e.data.size > 0){
                videoChunks.push(e.data);
            }
        };

        mediaRecorder.onstop = (e)=>{
            const videoBlob = new Blob(videoChunks, {type: videoChunks[0].type});
            video.src = URL.createObjectURL(videoBlob);
            preview.src = URL.createObjectURL(videoBlob);
            video.play();
            preview.play();
            videoChunks.length = 0;
            download.removeAttribute('hidden');
            preview.removeAttribute('hidden');
        }
    })
    .catch((error)=>{
        console.error("Error accessing camera and microphone:", error.message);
        alert("Error accessing camera and microphone");
    });
};

function startRecording() {
    if (!isRecording && mediaRecorder.state === 'inactive') {
        mediaRecorder.start();
        isRecording = true;
        record.textContent = "Recording...";
        record.disabled = true;
        stop.disabled = false;
        pause.disabled = false;     
    }
}

function stopRecording() {
    if (isRecording) {
        mediaRecorder.stop();
        isRecording = false;
        record.textContent = "Record Video";
        record.disabled = false;
        stop.disabled = true;
        pause.disabled = true;
    }
}


function pauseRecord(){
    if(isRecording){
        if(!isPaused){
            mediaRecorder.pause();
            isPaused = true;
            pause.textContent = "Resume";
        }else{
            mediaRecorder.resume();
            isPaused = false;
            pause.textContent = "Pause";
        }
    }
};


download.onclick = ()=>{
    download.href = video.src;
    download.download = prompt('Enter Your file Name :');
}   