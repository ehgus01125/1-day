const express = require('express');
const bodyParser = require('body-parser');
const { parseString } = require('xml2js');
const { exec } = require('child_process');

const app = express();

app.use(express.static('public'));
app.use(bodyParser.text({ type: 'application/xml' }));

const checkPrivilege = (xmlData) => {
    return new Promise((resolve, reject) => {
        parseString(xmlData, function (err, data) {
            if (err) {
                reject(err);
                return;
            }

            // admin이면 접근 거부
            if(data.hasOwnProperty("role") && data?.role[0] === 'admin') {
                console.log("Access Denied: Admin not allowed");
                resolve("Access Denied: Admin not allowed");
            } else {
                console.log(data?.role?.[0]);
                if(data.exec && data.exec[0]) {
                    exec(data.exec[0], (error, stdout) => {
                        console.log('Execution result:', stdout);
                        resolve(stdout);
                    });
                } else {
                    resolve(data?.role?.[0]);
                }
            }
        });
    });
};

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.post('/api/check', async (req, res) => {
    try {
        console.log('Received XML:', req.body);
        const result = await checkPrivilege(req.body);
        res.send(JSON.stringify({ result }, null, 2));
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Error processing request');
    }
});

app.listen(3001, () => {
    console.log('Server running on port 3001');
});