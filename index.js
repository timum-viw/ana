var express = require('express');
var app = express();
app.use(express.json());
var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen(5432);

const inits = [
	{text:'Transport of Patient C is stuck in the Elevator.', title: 'Transport Update', type: 'info'},
	{text:'Patient Cs operation was canceled for today.', title: 'Patient Update', type: 'info'},
];

app.get('/update', function (req, res) {
	const msg = { text: req.query.message, title: 'Patient Update', type: 'confirm' }
	io.emit('patient.update', msg);
	var spawn = require('child_process').spawn;
	var process = spawn('python3',[__dirname + "/../ana-wechat/src/worker.py", req.query.message]);
	process.stderr.on('data', function (data){
		console.log(data);
	});
	res.send();
});

app.post('/staff/update', (req, res) => {
});

app.get('/', (req, res) => {
	res.sendFile(__dirname + '/index.html');
})

io.on('connection', function (socket) {
	inits.map((msg) => {
		io.emit('patient.update', msg);
	})
});