"""
Swara Chaudhari - Local Portfolio Development Server
Runs a lightweight local web server with auto-browser launch and local network access.
"""

import http.server
import socketserver
import webbrowser
import socket
import os
import sys

DEFAULT_PORT = 8000

def get_local_ip():
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        ip = s.getsockname()[0]
        s.close()
        return ip
    except Exception:
        return "127.0.0.1"

def find_available_port(start_port=DEFAULT_PORT):
    port = start_port
    while port < start_port + 50:
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
            if sock.connect_ex(("127.0.0.1", port)) != 0:
                return port
            port += 1
    return start_port

def run():
    # Set current directory to the directory where this script is located
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    
    port = find_available_port(DEFAULT_PORT)
    local_ip = get_local_ip()
    url = f"http://localhost:{port}"
    network_url = f"http://{local_ip}:{port}"

    handler = http.server.SimpleHTTPRequestHandler
    # Enable clean caching headers for instant dev feedback
    handler.extensions_map.update({
        '.js': 'application/javascript',
        '.css': 'text/css',
    })

    print("=" * 60)
    print("  🚀 Swara Chaudhari - Portfolio Local Server")
    print("=" * 60)
    print(f"  • Local URL:   {url}")
    print(f"  • Network URL: {network_url} (Access from mobile on same Wi-Fi)")
    print("=" * 60)
    print("  Press Ctrl+C in this terminal to stop the server.\n")

    # Open browser automatically
    webbrowser.open(url)

    with socketserver.TCPServer(("", port), handler) as httpd:
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nShutting down server. Goodbye!")
            sys.exit(0)

if __name__ == "__main__":
    run()
