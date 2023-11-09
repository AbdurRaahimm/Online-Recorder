const start = document.querySelector('.audio-container #start'),
stop = document.querySelector('.audio-container #stop'),
pause = document.querySelector('.audio-container #pause'),
download = document.querySelector('.audio-container #download'),
audio = document.querySelector('.audio #audio');


let mediaRecorder;
const audioChunks = [];
let isRecording = false;
let isPaused = false;

start.addEventListener('click', startRecord);
stop.addEventListener('click', stopRecord);
pause.addEventListener('click', pauseRecord);

async function startRecord(){
    if(!isRecording){
        try {
            let stream = await navigator.mediaDevices.getUserMedia({audio:true});
            mediaRecorder = new MediaRecorder(stream);
            mediaRecorder.ondataavailable = (e)=>{
                if(e.data.size > 0){
                    audioChunks.push(e.data);
                }
            };
            
            mediaRecorder.onstop = (e)=>{
                const audioBlob = new Blob(audioChunks, {type:'audio/wav'});
                audio.src = URL.createObjectURL(audioBlob);
                audio.play();
                audioChunks.length = 0;
                // download.href = audio.src;
                // download.download = prompt('Enter Your File Name : ')
                download.removeAttribute('hidden');
            };
            mediaRecorder.start();
            isRecording = true;
            console.log("Recording started");
            start.textContent = "Recording...";
            start.disabled = true
            stop.disabled = false
            pause.disabled = false
        } catch (error) {
            console.error("microphone accessing Denied:", error.message)
        }
       
    }
};

function stopRecord(){
    if(isRecording){
        mediaRecorder.stop();
        isRecording = false;
        console.log("Recording stopped");
        start.textContent = "Start";
        start.disabled = false
        stop.disabled = true
        pause.disabled = true
    }
};

function pauseRecord(){
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
};

download.addEventListener('click',()=>{
    download.href = audio.src;
    download.download = prompt('Enter Your File Name : ')
})

