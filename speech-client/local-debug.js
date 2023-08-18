const liveServer = require('live-server');
const params = {
    /** Set the server port. Defaults to 8080. */
	port: 8080,
    /** Set the address to bind to. Defaults to 0.0.0.0 */
	host: 'localhost',
    /** Set root directory that's being served. Defaults to current working directory. */
	root: './speech-client/src',
    /** When false, it won't load your browser by default. */
	open: true,
    /** Comma-separated string for paths to ignore */
	ignore: '',
    /** 
     * When set, serve this file (server root relative) 
     * for every 404 (useful for single-page applications) 
     **/
	file: 'index.html',
    /** Waits for all changes, before reloading. Defaults to 0 sec. */
	wait: 1000,
    /** Mount a directory to a route. */
	mount: [],
    /** 0 = errors only, 1 = some, 2 = lots */
	logLevel: 2,
    /** 
     * Takes an array of Connect-compatible middleware that 
     * are injected into the server middleware stack 
     **/
	middleware: [
        function(req, res, next) { 
            next(); 
        }
    ]
};
liveServer.start(params);