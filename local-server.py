import http.server
import socketserver
import os

PORT = 8080
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class CleanURLHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def do_GET(self):
        # 301 redirect .html to clean URL (except index.html)
        path_only = self.path.split('?')[0].split('#')[0]
        if path_only.endswith('.html') and not path_only.startswith('/index'):
            clean_url = path_only[:-5]
            if '?' in self.path:
                clean_url += '?' + self.path.split('?', 1)[1]
            self.send_response(301)
            self.send_header('Location', clean_url)
            self.end_headers()
            return

        # Rewrite clean URL to .html if the file exists
        req_clean = path_only.rstrip('/')
        if req_clean:
            candidate = os.path.join(DIRECTORY, req_clean.lstrip('/') + '.html')
            if os.path.isfile(candidate):
                query = ('?' + self.path.split('?', 1)[1]) if '?' in self.path else ''
                self.path = '/' + req_clean.lstrip('/') + '.html' + query

        return super().do_GET()

if __name__ == '__main__':
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("", PORT), CleanURLHandler) as httpd:
        print(f"Clean URL Server running at http://localhost:{PORT}")
        httpd.serve_forever()
