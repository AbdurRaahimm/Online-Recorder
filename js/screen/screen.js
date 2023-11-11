const start = document.querySelector('.video-container #start'),
stop = document.querySelector('.video-container #stop'),
pause = document.querySelector('.video-container #pause'),
download = document.querySelector('.video-container #download'),
preview = document.querySelector('.video #preview');

let mediaRecorder, stream;
const videoChunks = [];
let isRecording = false;
let isPaused = false;

start.addEventListener('click', startRecord);
stop.addEventListener('click', stopRecord);
pause.addEventListener('click', pauseRecord);


// see preview after start record click  

async function startRecord(){
    if(!isRecording){
        try {
            stream = await navigator.mediaDevices.getDisplayMedia({video:{ mediaSource: "screen" }, audio: true});
            // preview.srcObject = stream
            mediaRecorder = new MediaRecorder(stream);
            mediaRecorder.ondataavailable = (e)=>{
                if(e.data.size > 0){
                    videoChunks.push(e.data);
                }
            };
            
            mediaRecorder.onstop = (e)=>{
                const videoBlob = new Blob(videoChunks, {type: videoChunks[0].type});
                preview.src = URL.createObjectURL(videoBlob);
                preview.play();
                // videoChunks.length = 0;
                download.removeAttribute('hidden');
                preview.removeAttribute('muted');
            };

            mediaRecorder.start();
            isRecording = true;
            console.log("Recording started");
            start.textContent = "Recording...";
            start.disabled = true
            stop.disabled = false
            pause.disabled = false
        } catch (error) {
            console.error("screen accessing Denied:", error.message)
        }
       
    }
};

function stopRecord(){
    if(isRecording){
        mediaRecorder.stop();
        isRecording = false;
        console.log("Recording stopped");
        preview.removeAttribute('muted');
    }
        start.textContent = "Start";
        start.disabled = false
        stop.disabled = true
        pause.disabled = true
    
};

function pauseRecord(){
    if(isRecording){
        if(!isPaused){
            mediaRecorder.pause();
            isPaused = true;
            console.log("Recording paused");
            pause.textContent = "Resume";
        }else{
            mediaRecorder.resume();
            isPaused = false;
            console.log("Recording resumed");
            pause.textContent = "Pause";
        }
    }
};

download.addEventListener('click',()=>{
    download.href = preview.src;
    download.download = prompt('Enter Your File Name : ')
})