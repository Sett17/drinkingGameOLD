from livereload import Server, shell
print("Only use in dev")
server = Server()
server.watch('./public')
server.setHeader('Access-Control-Allow-Origin', '*')
server.serve(root='./public')
