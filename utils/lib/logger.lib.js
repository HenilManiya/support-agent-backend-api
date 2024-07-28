var bunyan = require('bunyan');
var PrettyStream = require('bunyan-prettystream');

var prettyStdOut = new PrettyStream();
prettyStdOut.pipe(process.stdout);
var logLevel = process.env.LOG_LEVEL || 'info';
var logSource = process.env.LOG_SOURCE || false;

function reqSerializer(req) {
    if(req) {
        return {
            method: req.method,
            url: req.url
        }
    }
}

exports.log = bunyan.createLogger({
    name: 'eb-Logger',
    src: true,
    serializers: {req: reqSerializer,
        err: bunyan.stdSerializers.err,
        res: bunyan.stdSerializers.res},
    streams: [
        {
            level: 'debug',
            type: 'raw',
            stream: prettyStdOut
        },
        {
            type: 'rotating-file',
            path: './log/app.log',
            level: logLevel,
            period: '1d',
            count: 3
        },
        {
            type: 'rotating-file',
            path: './log/errors.log',
            level: 'error',
            period: '1d',
            count: 3
        },
        {
            type: 'rotating-file',
            path: './log/debug.log',
            level: 'debug',
            period: '1d',
            count: 3
        }
    ]
});