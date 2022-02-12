import adapter from '@sveltejs/adapter-auto';
import preprocess from "svelte-preprocess"
import { Server } from 'socket.io';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: [ // <- Create this option
		preprocess({ // <- Add the module
			postcss: true, // <- Set this to enable PostCSS
		}),
	],
	kit: {
		adapter: adapter(),
		target: "#svelte",
		vite: {
			plugins: [
				{
					name: 'sveltekit-socket-io',
					configureServer (server) {
						const io = new Server(server.httpServer);

						// This is located in the svelte config (see above "Socket.IO stuff goes here")
						io.on('connection', (socket) => {
							// Generate a random username and send it to the client to display it
							const username = `User ${Math.round(Math.random() * 999999)}`;
							socket.emit('name', username);

							// Receive incoming messages and broadcast them
							socket.on('message', (message) => {
								io.emit('message', {
									from: username,
									message: message,
									time: new Date().toLocaleString()
								});
							});
						});

						console.log('SocketIO injected');
					}
				}
			]
		},
		// Override http methods in the Todo forms
		methodOverride: {
			allowed: ['PATCH', 'DELETE']
		}
	}
};

export default config;
