import { UAParser } from "ua-parser-js";

const DeviceType = {
  Desktop: "desktop",
  Phone: "phone",
  Tablet: "tablet",
};

class DetectionManager {
  constructor() {
    this.parser = new UAParser();
    this.type = this.determineDeviceType(this.parser.getDevice().type);

    this.webGLAvailable = false;
    this.webPSupported = false;

    this.isMobile = this.type !== DeviceType.Desktop;
    this.isPhone = this.type === DeviceType.Phone;
    this.isTablet = this.type === DeviceType.Tablet;
    this.isDesktop = this.type === DeviceType.Desktop;

    this.isMixBlendModeUnsupported =
      typeof window.getComputedStyle(document.body).mixBlendMode ===
      "undefined";

    this.setHTMLClass();
  }

  determineDeviceType(deviceType) {
    if (deviceType === "mobile") {
      return DeviceType.Phone;
    } else if (Object.values(DeviceType).includes(deviceType)) {
      return deviceType;
    } else {
      return DeviceType.Desktop;
    }
  }

  setHTMLClass() {
    const htmlElement = document.documentElement;
    htmlElement.classList.add(this.isMobile ? "mobile" : "desktop");
  }

  isWebGLAvailable() {
    if (!this.webGLAvailable) {
      const canvas = document.createElement("canvas");
      this.webGLAvailable =
        !!window.WebGLRenderingContext &&
        !!(
          canvas.getContext("webgl") || canvas.getContext("experimental-webgl")
        );
    }
    return this.webGLAvailable;
  }

  isWebPSupported() {
    if (!this.webPSupported) {
      const element = document.createElement("canvas");
      if (element.getContext("2d")) {
        this.webPSupported = element
          .toDataURL("image/webp")
          .startsWith("data:image/webp");
      } else {
        this.webPSupported = false;
      }
    }
    return this.webPSupported;
  }

  isAppBrowser() {
    const ua = navigator.userAgent;
    return /FBAN|FBAV|Twitter/.test(ua);
  }

  check({ onErrorWebGL, onSuccess }) {
    if (!this.isWebGLAvailable()) {
      onErrorWebGL();
    } else {
      onSuccess();
    }
  }
}

export const Detection = new DetectionManager();
