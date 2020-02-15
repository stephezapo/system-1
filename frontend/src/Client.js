function getConnectedServerIP(query, cb)
{
  	return fetch(`/api/getHostIP`, {
			accept: "application/json"
  		})
		.then(checkStatus)
		.then(parseJSON)
		.then(cb);
}

function setConnectedServerIP(ip)
{
  	fetch('/api/setHostIP/'+ip, {
		method: 'PUT',
		body: {},
		headers:{
		'Content-Type': 'application/json'
		}
  	})
}

function isOnline(cb) 
{
  	return fetch('/api/ping', {
			accept: "application/json"
		})
		.then(checkStatus)
		.then(parseJSON)
        .then(cb);
}

function getVisualParameters(query, cb) 
{
	return fetch(`/api/visual/getparameters`, {
			accept: "application/json"
		})
		.then(checkStatus)
		.then(parseJSON)
		.then(cb);
}

function setVisualParameter(data, cb)
{
    return fetch('/api/visual/setparameter', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                //Accept: 'application/json',
                'Content-Type': 'application/json; charset=utf8'
            },
        })
}

function getCameraStatus(cb) 
{
	return fetch(`/api/visual/getstatus`, {
			accept: "application/json"
		})
		.then(checkStatus)
		.then(parseJSON)
		.then(cb);
}

function getCameraCalibrationInfo(cb) 
{
	return fetch(`/api/visual/getcalibrationinfo`, {
			accept: "application/json"
		})
		.then(checkStatus)
		.then(parseJSON)
		.then(cb);
}

function startCameraCalibration(data, cb)
{
    return fetch('/api/visual/startcalibration', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                //Accept: 'application/json',
                'Content-Type': 'application/json; charset=utf8'
            },
        })
}

function stopCameraCalibration(cb)
{
    return fetch('/api/visual/stopcalibration', {
            method: 'POST',
            body: [],
            headers: {
                //Accept: 'application/json',
                'Content-Type': 'application/json; charset=utf8'
            },
        })
}

function proceedCalibrationGroup(cb)
{
    return fetch('/api/visual/proceedcalibrationgroup', {
            method: 'POST',
            body: [],
            headers: {
                //Accept: 'application/json',
                'Content-Type': 'application/json; charset=utf8'
            },
        })
}

function grabFrame(cb)
{
    return fetch('/api/grabframe', {
            method: 'POST',
            body: [],
            headers: {
                //Accept: 'application/json',
                'Content-Type': 'application/json; charset=utf8'
            },
        })
}

function getVisualDebugOutput(cb) 
{
  	return fetch(`/api/visual/debugoutput`, {
		accept: "application/json"
  	})
	.then(checkStatus)
	.then(parseJSON)
	.then(cb);
}

function getCpuUsage(query, cb) 
{
  	return fetch('/api/resources/cpu', {
		accept: "application/json"
  	})
	.then(checkStatus)
	.then(parseJSON)
	.then(cb);
}

function getRamUsage(query, cb) 
{
  	return fetch('/api/resources/ram', {
		accept: "application/json"
  	})
	.then(checkStatus)
	.then(parseJSON)
	.then(cb);
}

function checkStatus(response) 
{
  	if (response.status >= 200 && response.status < 300) 
  	{
		return response;
	}
	  
  	const error = new Error(`HTTP Error ${response.statusText}`);
  	error.status = response.statusText;
  	error.response = response;
  	console.log(error); // eslint-disable-line no-console
  	throw error;
}

function parseJSON(response) 
{  
  	try
  	{
		var j = response.json();
		return j;
  	}
  	catch(e)
  	{
		return response;
 	}
}

const Client = { isOnline, getConnectedServerIP, setConnectedServerIP, getVisualParameters, setVisualParameter, 
                    getCameraStatus,
                    getCameraCalibrationInfo, startCameraCalibration, stopCameraCalibration, proceedCalibrationGroup,
                    grabFrame, getVisualDebugOutput,
                    getCpuUsage, getRamUsage };
export default Client;