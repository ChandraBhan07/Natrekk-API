const sendResponse = (res, statusCode, data, sendCount = false) => {
    const status = `${statusCode}`.startsWith('2') ? 'success' : 'fail';
    const resObj = {
        status, data
    };
    if (sendCount) resObj.count = data.length;
    res.status(statusCode).json(resObj);
}

module.exports = sendResponse;