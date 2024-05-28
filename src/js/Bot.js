import createRequest from './api/createRequest';
import addFileContent from './api/addFileContent';

export default class Bot {
    constructor() {
        this.containerContent = document.querySelector('.container-content');
        this.geoBtn = document.querySelector('.header-geo');
        this.messageInput = document.querySelector('.footer-messageInput');
        this.enterBtn = document.querySelector('.footer-enterBtn');
        this.uploadFile = document.querySelector('.footer-uploadFile');
        this.uploadFileInput = this.uploadFile.querySelector('.overlapped');
        this.recordAudio = document.querySelector('.header-recordAudio');
        this.recordVideo = document.querySelector('.header-recordVideo');
        this.recordAudioContainer = document.querySelector('.header-recordContainer');
        this.deleteBtn = document.querySelector('.header-deleteMessages');
    }


    init() {
        this.addTextListener();
        this.addFileListener();
        this.geolocationListener();
        this.audioRecordListener();
        this.videoRecordListener();
        this.deleteBtnListener();
        this.loadMessages();
    }

    addTextListener() {
        const addText = () => {
            if (this.messageInput.value !== '' || this.messageInput.value !== undefined) {
                const data = {
                    value: this.messageInput.value,
                    type: 'text',
                    method: 'createTextMessage',
                    requestMethod: 'POST'
                }
                const response = createRequest(data);
                if (response) {
                    response.then(res => {
                        const textResponse = res.responseMessage;
                        this.addTextMessage(textResponse);
                    })
                }
                this.messageInput.value = '';
            }
        }

        this.enterBtn.addEventListener('click', () => {
            addText();
        })

        this.messageInput.addEventListener('keydown', (e) => {
            if (e.key === "Enter") {
                addText();
            }
        })
    }

    addFileListener() {
        this.uploadFile.addEventListener('click', (e) => {
            this.uploadFileInput.dispatchEvent(new MouseEvent('click'));
        })

        this.dndFile();

        this.uploadFileInput.addEventListener('change', (e) => {
            const file = this.uploadFileInput.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = () => {
                const fileBase64 = reader.result.split(',')[1];
                const fileType = file.type.split('/')[0];
                const data = {
                    value: fileBase64, 
                    fileType: fileType,
                    method: 'createFileMessage',
                    requestMethod: 'POST'
                };

                createRequest(data).then(res => {
                    const fileResponse = res.responseMessage;
                    this.addContent(fileResponse, fileType); 
                });
            };
            reader.readAsDataURL(file);
        })
    }


    dndFile() {
        this.containerContent.addEventListener('dragover', (e) => {
            e.preventDefault();
        })

        this.containerContent.addEventListener('drop', (e) => {
            e.preventDefault();

            const file = e.dataTransfer.files[0];
            const fileType = file.type.split('/')[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = () => {
                const fileBase64 = reader.result.split(',')[1]; 
                const data = {
                    value: fileBase64, 
                    fileType: fileType,
                    method: 'createFileMessage',
                    requestMethod: 'POST'
                };

                createRequest(data).then(res => {
                    const fileResponse = res.responseMessage;
                    this.addContent(fileResponse, fileType); 
                });
            };

            reader.readAsDataURL(file);
        })
    }

    addContent(data, fileType) {
        let contentElement;

        if (fileType === 'audio') {
            contentElement = document.createElement('audio');
            contentElement.controls = true;
        } else if (fileType === 'video') {
            contentElement = document.createElement('video');
            contentElement.controls = true;
        } else {
            contentElement = document.createElement('img');
        }

        contentElement.className = 'content-' + fileType;
        contentElement.src = 'data:' + fileType + ';base64,' + data;

        const contentContainer = document.createElement('div');
        contentContainer.className = 'content-' + 'file' + 'Container';
        contentContainer.append(contentElement);

        this.containerContent.append(contentContainer);
    }


    addTextMessage(message) {
        if (message === '') {
            return;
        }

        const messageBox = document.createElement('div');
        messageBox.className = 'content-message';

        const urlRegex = /(https?:\/\/[^\s]+)/g;
        const match = message.match(urlRegex);
        const textParts = message.split(urlRegex);

        messageBox.innerHTML = '';

        textParts.forEach((text, index) => {
            if (index === 0) {
            messageBox.appendChild(document.createTextNode(text));
            } else {
            const anchor = document.createElement('a');
            anchor.href = match[index - 1];
            anchor.textContent = match[index - 1];
            anchor.target = '_blank';
            messageBox.appendChild(anchor);
            }
        });

        this.containerContent.append(messageBox);
    }

    async navigator() {
        if (navigator.geolocation) {
            try {
                const data = await new Promise((resolve, reject) => {
                    navigator.geolocation.getCurrentPosition(resolve, reject, { enableHighAccuracy: true });
                });
                const { latitude, longitude } = data.coords;
                const requestData = {
                    latitude,
                    longitude,
                    type: 'coords',
                    method: 'createGeoMessage',
                    requestMethod: 'POST'
                }
                const response = createRequest(requestData);
                if (response) {
                    response.then(res => {
                        const responseLatitude = res.responseLatitude;
                        const responseLongitude = res.responseLongitude;
                        const geolocationData = document.createElement('div');
                        geolocationData.textContent = `[${responseLatitude}, ${responseLongitude}]`;
                        geolocationData.className = 'content-message';
                
                        this.containerContent.append(geolocationData);
                    })
                }                
            } catch (err) {
                console.log(err);
            }
        }
    }

    async geolocation() {
            await this.navigator();
            return;
 
    }

    geolocationListener() {
        this.geoBtn.addEventListener('click', () => {
            this.geolocation();
        })
    }

    audioRecordListener() {
        let mediaRecorder;
        let audioChunks = [];
        let mediaStream; 
    
        const startRecording = () => {
            if (!mediaRecorder || mediaRecorder.state === 'inactive') {
                navigator.mediaDevices.getUserMedia({ audio: true })
                    .then(stream => {
                        mediaStream = stream; 
                        mediaRecorder = new MediaRecorder(stream);
    
                        mediaRecorder.addEventListener('dataavailable', event => {
                            audioChunks.push(event.data);
                        });
    
                        mediaRecorder.addEventListener('stop', () => {
                            if (audioChunks.length > 0) {
                                const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
                                const audioUrl = URL.createObjectURL(audioBlob);
    
                                const data = {
                                    value: audioUrl,
                                    fileType: 'audio',
                                    method: 'createFileMessage',
                                    requestMethod: 'POST'
                                };
    
                                createRequest(data).then(res => {
                                    const fileResponse = res.responseMessage;
                                    const contentContainer = addFileContent(fileResponse, 'audio');
                                    this.containerContent.append(contentContainer);
                                });    
                                mediaStream.getTracks().forEach(track => track.stop());
                            }
    
                            audioChunks = [];
                        });
    
                        mediaRecorder.start();
                        this.recordAudio.classList.add('record-active');
                    })
                    .catch(error => {
                        console.error('Error accessing media devices.', error);
                    });
            } else if (mediaRecorder.state === 'paused') {
                mediaRecorder.resume();
            }
        };
    
        const stopRecording = () => {
            if (mediaRecorder && mediaRecorder.state === 'recording') {
                mediaRecorder.stop();
                this.recordAudio.classList.remove('record-active');
            }
        };
    
        this.recordAudio.addEventListener('click', () => {
            if (this.recordAudio.classList.contains('record-active')) {
                stopRecording();
            } else {
                startRecording();
            }
        });
    }

    videoRecordListener() {
            let mediaRecorder;
            let videoChunks = [];
            let mediaStream; 
        
            const startRecording = () => {
                if (!mediaRecorder || mediaRecorder.state === 'inactive') {
                    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
                        .then(stream => {
                            mediaStream = stream; 
                            mediaRecorder = new MediaRecorder(stream);
        
                            mediaRecorder.addEventListener('dataavailable', event => {
                                videoChunks.push(event.data);
                            });
        
                            mediaRecorder.addEventListener('stop', () => {
                                if (videoChunks.length > 0) {
                                    const videoBlob = new Blob(videoChunks, { type: 'video/webm' });
                                    const videoUrl = URL.createObjectURL(videoBlob);
        
                                    const data = {
                                        value: videoUrl,
                                        fileType: 'video',
                                        method: 'createFileMessage',
                                        requestMethod: 'POST'
                                    };
        
                                    createRequest(data).then(res => {
                                        const fileResponse = res.responseMessage;
                                        console.log(fileResponse);
                                        const contentContainer = addFileContent(fileResponse, 'video');
                                        this.containerContent.append(contentContainer);
                                    });
                                    mediaStream.getTracks().forEach(track => track.stop());
                                }
        
                                videoChunks = [];
                            });
        
                            mediaRecorder.start();
                            this.recordVideo.classList.add('record-active');
                        })
                        .catch(error => {
                            console.error('Error accessing media devices.', error);
                        });
                } else if (mediaRecorder.state === 'paused') {
                    mediaRecorder.resume();
                }
            };
        
            const stopRecording = () => {
                if (mediaRecorder && mediaRecorder.state === 'recording') {
                    mediaRecorder.stop();
                    this.recordVideo.classList.remove('record-active');
                }
            };
        
            this.recordVideo.addEventListener('click', () => {
                if (this.recordVideo.classList.contains('record-active')) {
                    stopRecording();
                } else {
                    startRecording();
                }
            });
    }

    deleteBtnListener() {
        this.deleteBtn.addEventListener('click', () => {
            const data = {
                value: 'deleteMessages',
                method: 'deleteMessages',
                requestMethod: 'POST'
            };
            createRequest(data).then(res => {
                if (res.responseMessage === 'success') {
                    this.containerContent.innerHTML = '';
                } else {
                    console.log('error with deleting messagges')
                }
            });
        })
    }

    loadMessages() {
        const data = {
            requestMethod: 'GET'
        };
        
        createRequest(data).then(res => {
            if (res.length > 0) {
                res.forEach(element => {
                    if (element.type === 'text') {
                        this.addTextMessage(element.value);
                    }

                    if (element.type === 'audio' || element.type === 'video' || element.type === 'image') {
                        this.addContent(element.value, element.type);
                    }

                    if (element.type === 'coords') {
                        const geolocationData = document.createElement('div');
                        geolocationData.textContent = `[${element.latitude}, ${element.longitude}]`;
                        geolocationData.className = 'content-message';
                        this.containerContent.append(geolocationData);
                    }
                })
            }
        });
    }

}
