from http.server import BaseHTTPRequestHandler, HTTPServer
import socket
import json

PORT = 8000
CurrentColor = {"r": 0, "g": 0, "b": 0}
CurrentStrength = 0
CurrentStatus = 0

# Definiere den Request-Handler
class RequestHandler(BaseHTTPRequestHandler):

    # Definiere den Port, auf dem der Server laufen soll   
    def sendCommand(self, UDPPort, GoveeDevicesIPList, message):
        sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        jsonResult = json.dumps(message)
        for device in GoveeDevicesIPList:
            sock.sendto(bytes(jsonResult, "utf-8"), (device, UDPPort))
    
    def do_POST(self):
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length).decode('utf-8')
        data = json.loads(post_data)

        # Retrieve the embedded command and message
        GoveeDevicesIPList = data.get('GoveeDevicesIPList')
        UDPPort = data.get('UDPPort')
        message = data.get('message')
        messageType = data.get('messageType')
        print(messageType)

        cmd= ''
        data= ''
        maxValue = 255
        maxValueBright = 100
        minValue = 0
        global PORT, CurrentColor, CurrentStrength, CurrentStatus

        if messageType == "getInfo":
            print("InfoRequested")
        else:            
            if messageType == "r":
                if (message):
                    message = message * 5
                if minValue <= (CurrentColor[messageType] + message) <= maxValue:
                    if minValue > (CurrentColor[messageType] + message) > maxValue:
                        CurrentColor[messageType] = CurrentColor[messageType]
                    else:
                        CurrentColor[messageType] = CurrentColor[messageType] + message
                    cmd= 'colorwc'
                    data= {
                        "color": CurrentColor,
                        "colorTemInKelvin": 0
                    }
            elif messageType == "g":
                if (message):
                    message = message * 5
                if minValue <= (CurrentColor[messageType] + message) <= maxValue:
                    if minValue > (CurrentColor[messageType] + message) > maxValue:
                        CurrentColor[messageType] = CurrentColor[messageType]
                    else:
                        CurrentColor[messageType] = CurrentColor[messageType] + message
                    cmd= 'colorwc'
                    data= {
                        "color": CurrentColor,
                        "colorTemInKelvin": 0
                    }
            elif messageType == "b":
                if (message):
                    message = message * 5
                if minValue <= (CurrentColor[messageType] + message) <= maxValue:
                    if minValue > (CurrentColor[messageType] + message) > maxValue:
                        CurrentColor[messageType] = CurrentColor[messageType]
                    else:
                        CurrentColor[messageType] = CurrentColor[messageType] + message
                    cmd= 'colorwc'
                    data= {
                        "color": CurrentColor,
                        "colorTemInKelvin": 0
                    }
            elif messageType == "color":
                    CurrentColor = message
                    cmd= 'colorwc'
                    data= {
                        "color": message,
                        "colorTemInKelvin": 0
                    }
            elif messageType == "toggle":
                CurrentStatus ^= 1
                cmd= 'turn'
                data = {
                    "value": CurrentStatus
                }
            elif messageType == "on_off":
                CurrentStatus = message
                cmd= 'turn'
                data = {
                    "value": message
                }
            elif messageType == "brightness":
                if (message):
                    message = message * 5
                if minValue <= (CurrentStrength + message) <= maxValueBright:
                    if minValue > (CurrentStrength + message) > maxValueBright:
                        CurrentStrength = CurrentStrength
                    else:
                        CurrentStrength = CurrentStrength + message
                cmd= "brightness"
                data = {
                    "value": CurrentStrength
                }
            elif messageType == "full_brightness":
                    CurrentStrength = message
                    cmd= 'brightness'
                    data= {
                        "value": message
                    }
            sendMessage = {
                "msg": {
                    "cmd": cmd,
                    "data": data
                }
            }
            print(sendMessage)

            self.sendCommand(UDPPort, GoveeDevicesIPList, sendMessage)
        self.send_response(200)
        self.send_header('Content-type', 'text/plain')
        self.end_headers()
        print([CurrentStatus, CurrentStrength, CurrentColor]);
        response = [CurrentStatus, CurrentStrength, CurrentColor]
        self.wfile.write(json.dumps(response).encode('utf-8'))  

# Starte den HTTP-Server
def start_server():
    server_address = ('localhost', PORT)
    httpd = HTTPServer(server_address, RequestHandler)
    print('Server läuft auf localhost:' + str(PORT))
    httpd.serve_forever()

# Rufe die Funktion zum Starten des Servers auf
start_server()