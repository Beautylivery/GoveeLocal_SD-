# GoveeLocal_SD-
Repository to use your GoveeLights local Network with StreamDeck+

# Installation
Stop Stream Deck Application before installing the Plugin
1. Clone the Project into your StreamDeck Plugins Directory: C:\Users\[USERNAME]\AppData\Roaming\Elgato\StreamDeck\Plugins
2. Change the name from the directory from GoveeLocal_SD- to de.beautylivery.goveelocal.sdPlugin 
    - This will ensure it will ShowUp after Restarting Stream Deck Application.
3. Restart your Stream Deck Application
    - You should now see Govee Locals for Buttons (Keypad) and Nobs (Encoder)

# Further Pre Requesites
I was not able to send UDP Network Messages via the available Javascript Version, therefore I had to create a small server script to manage the orders to the Gove lights.
For this reason you should best Setup one Keypad Button in StreamDeck to start the Server.
1. Use the System >> Run Function Button to add a quick start for the server file: "C:\Users\[USERNAME]\AppData\Roaming\Elgato\StreamDeck\Plugins\de.beautylivery.goveelocal.sdPlugin\additional\dist\server.exe"
2. Now you should be able to start the Server and a small cmd prompt should come up that displays the received commands and executed orders towards the Govee lights.
3. Go to the file action >> js >> elgatoInteract.js and change the IP addresses to your Govee Lights IPs within your Network. and save the file.

# Usage
After the server is running you can use the Govee Locals Features
## Button
After assigning the Button you actually have no functionality but it will send a regular color status request to be able to display the current color of your Govee Lights on the Button.
## Dials
- Press: Currently a Press of the Button will toggle between on and off for the lights, no matter the selected color / brigthness.
- Dial: After assigning the dial you can assign a Function to it to influence the Brigthness or RGB color individually.
    - I have my setup for one Dial of each Function.

# Known Issues
There is still a lot to desire but i hope you still enjoy my first Version of this Feature as i was missing exactly such kind of Function for Elgato Stream Deck + and if you like it i want to continue improving it.
Currently i am aware f the following issues:
- The last color and state is not saved.
- After switching between the Pages of the StreamDeck the light might Blink once. 
- There is a delay on the color Display due to the timing i set up for the updates between display and server.
- The way of setting the IP for the lights is very inconvinient.
- Function State is not saved in the menu

# You like my Attempt ?
Please let me know and feel free to help to make this better.