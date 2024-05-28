const localhost = 'http://localhost:7070/';

// const createRequest = async (data) => {
//     const postOptions = {
//         method: 'POST',
//         body: JSON.stringify(data),
//         headers: {
//             'Content-Type': 'application/json',
//         },
//     }
//     const response = await fetch('http://localhost:7070/?method=' + data.method, postOptions);

//     if (response.ok) {
//         const result = await response.json();
//         return result;
//       } else {
//         console.error('Error:', response.status, response.statusText);
//       }
// };


const createRequest = async (data) => {
    if (data.requestMethod === 'POST') {
        const postOptions = {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
            },
        }
        const response = await fetch(localhost + '?method=' + data.method, postOptions);  

        if (response.ok) {
            const result = await response.json();
            return result;
        } else {
            console.error('Error:', response.status, response.statusText);
        }
    }
    // const postOptions = {
    //     method: 'POST',
    //     body: JSON.stringify(data),
    //     headers: {
    //         'Content-Type': 'application/json',
    //     },
    // }
    // const response = await fetch(localhost + '?method=' + data.method, postOptions);

    // if (response.ok) {
    //     const result = await response.json();
    //     return result;
    // } else {
    //     console.error('Error:', response.status, response.statusText);
    // }

    if (data.requestMethod === 'GET') {
        const response = await fetch(localhost);  

        if (response.ok) {
            const result = await response.json();
            console.log(result);
            return result;
        } else {
            console.error('Error:', response.status, response.statusText);
        }
    }
};

export default createRequest;
