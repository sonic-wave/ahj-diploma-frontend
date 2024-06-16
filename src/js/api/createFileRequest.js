const createFileRequest = async (data) => {
    const postOptions = {
        method: 'POST',
        body: data,
    }
    const response = await fetch('https://ahj-diploma-backend-l54f.onrender.com/?method=createFileMessage', postOptions);

    if (response.ok) {
        const result = await response.json();
        return result;
    } else {
        console.error('Error:', response.status, response.statusText);
    }
};

export default createFileRequest;