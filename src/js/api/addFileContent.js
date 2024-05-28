export default function addFileContent(data, fileType) {
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
    contentElement.src = data;

    const contentContainer = document.createElement('div');
    contentContainer.className = 'content-' + 'file' + 'Container';
    contentContainer.append(contentElement);

    return contentContainer;
}