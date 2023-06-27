/// <reference path="libs/js/stream-deck.js" />
/// <reference path="libs/js/action.js" />
/// <reference path="libs/js/utils.js" />
/// <reference path="action/js/elgatoInteract.js" />

// Action Cache
const MACTIONS = {};

// Action Events
const sampleClockAction = new Action("de.beautylivery.goveelocal");
const myGovee = new Govee();

sampleClockAction.onWillAppear(({ context, payload }) => {
  // console.log('will appear', context, payload);
  MACTIONS[context] = new SampleClockAction(context, payload);
});

sampleClockAction.onWillDisappear(({ context }) => {
  // console.log('will disappear', context);
  delete MACTIONS[context];
});

sampleClockAction.onDidReceiveSettings(({ context, payload }) => {
  //  console.log('onDidReceiveSettings', payload?.settings?.hour12, context, payload);
  MACTIONS[context].didReceiveSettings(payload?.settings);
});

sampleClockAction.onTitleParametersDidChange(({ context, payload }) => {
  // console.log('wonTitleParametersDidChange', context, payload);
  // MACTIONS[context].color = payload.titleParameters.titleColor;
});

sampleClockAction.onDialPress(({ context, payload }) => {
  // console.log('dial was pressed', context, payload);
  if (payload.pressed === false) {
    myGovee.toggleOnOff().then((result) => {
      MACTIONS[context].setStatus(result[0]);
      MACTIONS[context].update();
    });
  }
});

sampleClockAction.onDialRotate(({ context, payload }) => {
  // console.log('dial was pressed', context, payload);
  if (payload.pressed === false) {
    myGovee
      .ChangeColorbyTick(payload.settings.selectedCommand, payload.ticks)
      .then((result) => {
        MACTIONS[context].setColor(result[2]);
        MACTIONS[context].setBrightness(result[1]);
        MACTIONS[context].update();
      });
  }
});

sampleClockAction.onTouchTap(({ context, payload }) => {
  if (payload.hold === false) {
    //
  }
});

class SampleClockAction {
  constructor(context, payload) {
    this.context = context;
    this.payload = payload;
    this.interval = null;
    this.isEncoder = payload?.controller === "Encoder";
    this.settings = {
      ...{
        selectedCommand: `brightness`,
        color: { r: 0, g: 0, b: 0 },
        brightness: 100,
        status: 0,
      },
      ...payload?.settings,
    };
    this.size = 10; // default size of the icon is 48
    this.saveSettings();
    this.init();
    this.update();
  }

  async init() {
    if (!this.isEncoder) {
      await myGovee.setLightInformation(
        this.settings.status,
        this.settings.brightness,
        this.settings.color
      );
      await this.update();
      this.interval = setInterval(() => {
        myGovee.getLightInformation().then((result) => {
          this.setStatus(result[0]);
          this.setBrightness(result[1]);
          this.setColor(result[2]);
        });
      }, 3000);
    }
  }

  didReceiveSettings(settings) {
    if (!settings) return;
    let dirty = false;
    if (settings.hasOwnProperty("selectedCommand")) {
      this.settings.selectedCommand = settings.selectedCommand;
      dirty = true;
    }
    if (settings.hasOwnProperty("color")) {
      this.settings.color = settings.color;
      dirty = true;
    }
    if (settings.hasOwnProperty("brightness")) {
      this.settings.brightness = settings.brightness;
      dirty = true;
    }
    if (settings.hasOwnProperty("status")) {
      this.settings.status = settings.status;
      dirty = true;
    }
    if (dirty) this.update();
  }

  saveSettings(immediateUpdate = false) {
    $SD.setSettings(this.context, this.settings);
    if (immediateUpdate) this.update();
  }

  setColor(newColor) {
    if (this.settings.selectedCommand != `brightness`) {
      this.settings.color = { r: 0, g: 0, b: 0 };
      this.settings.color[this.settings.selectedCommand] =
        newColor[this.settings.selectedCommand];
    } else {
      if (this.isEncoder) {
        const newValue = parseInt((255 / 100) * this.settings.brightness);
        this.settings.color = { r: newValue, g: newValue, b: newValue };
      } else {
        this.settings.color = newColor;
      }
    }
    this.update();
  }

  setBrightness(newBrightness) {
    this.settings.brightness = newBrightness;
    this.update();
  }

  setStatus(newStatus) {
    this.settings.status = newStatus;
    this.update();
  }

  update() {
    const o = this.updateColorInformation();
    const svg = this.makeSvg(o);
    const icon = `data:image/svg+xml;base64,${btoa(svg)}`;
    if (this.isEncoder) {
      const payload = {
        title: o[1],
        value: o[0],
        icon,
      };
      $SD.setFeedback(this.context, payload);
    }
    $SD.setImage(this.context, icon);
    this.saveSettings();
  }

  updateColorInformation() {
    let value = "0 ( 00 )";
    if (this.settings.selectedCommand == `brightness`) {
      if (this.settings.brightness != undefined) {
        value = this.settings.brightness;
      }
    } else {
      value = `${
        this.settings.color[this.settings.selectedCommand]
      } ( ${this.componentToHex(
        this.settings.color[this.settings.selectedCommand]
      )} )`;
    }
    return [value, this.settings.selectedCommand];
  }

  componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? 0 + hex : hex;
  }

  rgbToHex(colorD) {
    return (
      "#" +
      this.componentToHex(colorD[`r`]) +
      this.componentToHex(colorD[`g`]) +
      this.componentToHex(colorD[`b`])
    );
  }

  makeSvg(o) {
    let scale = this.isEncoder ? 1 : 3;
    const h = this.size * scale;
    const w = this.isEncoder ? h : h;
    const r = h / 2;

    // if you prefer not to use a function to create ticks, see below at makeSvgAlt
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${h} ${w}">
        <rect x="${r - r / 2}" y="${
      r - r / 2
    }" width="${r}" height="${r}" rx="10" fill="${this.rgbToHex(
      this.settings.color
    )}" />
    </svg>`;
  }
}
