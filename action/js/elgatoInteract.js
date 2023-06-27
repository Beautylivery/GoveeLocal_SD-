/**
 * @class Govee
 * A Stream Deck plugin action, where you can register callback functions for different events
 */

class GoveeLightController {
  constructor() {
    // Constants, you should change these.
    this.GoveeDeviceIP1 = "192.168.178.37";
    this.GoveeDeviceIP2 = "192.168.178.33";
    this.GoveeDeviceIP3 = "192.168.178.46";
    this.goveeList = [];
    this.goveeList.push(this.GoveeDeviceIP1);
    this.goveeList.push(this.GoveeDeviceIP2);
    this.goveeList.push(this.GoveeDeviceIP3);
    this.UDP_PORT = 4003;
    //colorInformation
    this.status = 0;
    this.brightness = 0;
    this.color = {r: 0, g: 0, b: 0};
  }

  async send(getType = null, getMessage) {
    await fetch("http://localhost:8000", {
      method: "POST", // Use the POST method to send data
      headers: {
        "Content-Type": "application/json", // Set the content type to JSON
      },
      body: JSON.stringify({
        // Pass the command or message as JSON string
        GoveeDevicesIPList: this.goveeList,
        UDPPort: this.UDP_PORT,
        message: getMessage,
        messageType: getType,
      }),
    })
      .then((response) => response.text())
      .then((data) => {
        const output = JSON.parse(data);
        this.status = output[0];
        this.brightness = output[1];
        this.color = output[2];
      })
      .catch((error) => {
        console.error("Error sending the request:", error);
      });
      return [this.status, this.brightness, this.color];
  }

  async toggleOnOff() {
    await this.send('toggle');
    return [this.status, this.brightness, this.color]
    ;
  }

  async ChangeColorbyTick(color, tick) { 
    await this.send(color, tick);
    return [this.status, this.brightness, this.color]
  }

  async setLightInformation(status, brightness, color) { 
    this.status = status;
    this.brigthness = brightness;
    this.color = color;
    await this.send('on_off', this.status);
    await this.send('full_brightness', this.brightness);
    await this.send('color', this.color);
    return [this.status, this.brightness, this.color];
  }

  async getLightInformation() { 
    await this.send('getInfo');
    return [this.status, this.brightness, this.color];
  }
}

// Usage example:
const Govee = GoveeLightController;
