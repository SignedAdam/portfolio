# make command for launching server
.PHONY: serve

serve:
	@npm run build
	@http-server --cors -c-1 -p 8777

tunnel:
	@ngrok http 8777

serve-and-tunnel:
	@npm run build
	@http-server --cors -c-1 -p 8777 &
	@sleep 2  # give http-server a moment to start up
	@ngrok http 8777 &
