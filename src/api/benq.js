import request from "./request.js"

export const uploadImage = params => request.post('benq-upload-files', params);
export const totalImage = () =>  request.get('benq-upload-files/count');
export const listImage = params => request.get('benq-upload-files', params);

