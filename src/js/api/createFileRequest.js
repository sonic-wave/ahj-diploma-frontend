const createFileRequest = async (data) => {
    const postOptions = {
        method: 'POST',
        body: data,
    }
    const response = await fetch('http://localhost:7070/?method=createFileMessage', postOptions);

    if (response.ok) {
        const result = await response.json();
        return result;
    } else {
        console.error('Error:', response.status, response.statusText);
    }
};

export default createFileRequest;