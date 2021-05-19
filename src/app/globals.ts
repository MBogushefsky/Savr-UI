import { environment } from 'src/environments/environment';
import { User } from './models/user';

export class Globals {
  public appLoaded: boolean = false;
  public processing: boolean = false;
  private currentUser: User;
  public currentUserData: { [key: string]: any }; 
  public colorsOrdered: number[][] = [
    [127, 229, 240],
    [255, 64, 64],
    [23, 104, 48],
    [24, 160, 211],
    [165, 81, 238],
    [192, 111, 68],
    [160, 182, 52],
    [218, 149, 134],
    [37, 227, 1],
    [87, 61, 231],
    [248, 10, 210]
  ];
  private defaultColorDistanceThresholdOthers: number = 100;
  private defaultColorDistanceThresholdFromWhiteOrBlack: number = 75;
  private defaultColorGeneratorTimeoutIncrement: number = 100;

  public getCurrentUser(): User {
    if (this.currentUser == null) {
      return null;
    }
    if (environment.presentationMode) {
      return {
        id: this.currentUser.id,
        firstName: this.currentUser.firstName,
        lastName: this.currentUser.lastName,
        email: 'presentation-mode@presentation.com',
        passwordHash: this.currentUser.passwordHash,
        profileImage: this.currentUser.profileImage,
        username: this.currentUser.username,
        phoneNumber: this.currentUser.phoneNumber
      };
    }
    return this.currentUser;
  }

  public setCurrentUser(user: User) {
    this.currentUser = user;
  }

  public getMultipleOfRGBString(length: number) {
    let colors = [];
    for (var i = 0; i < length; i++) {
      colors.push(this.getRGBString(i));
    }
    return colors;
  }

  public getRGBString(index?: number, distanceThreshold?: number, distanceFromWhiteOrBlackThreshold?: number) {
    let rgb = [0, 0, 0];
    if (index != null && this.colorsOrdered[index] != null) {
      rgb = this.colorsOrdered[index];
    }
    else {rgb = this.getGeneratedRGB(distanceThreshold, distanceFromWhiteOrBlackThreshold);
    }
    return this.rgbToString(rgb);
  }

  public rgbToString(rgb: number[]) {
    return 'rgb(' + rgb[0] + ', ' + rgb[1] + ', ' + rgb[2] + ")";
  }

  private getGeneratedRGB(distanceFromOthersThreshold?: number, distanceFromWhiteOrBlackThreshold?: number) {
    let generatedRGB = this.getGeneratedRGBTimeout(this.defaultColorGeneratorTimeoutIncrement, distanceFromOthersThreshold,  distanceFromWhiteOrBlackThreshold);
    this.colorsOrdered.push(generatedRGB);
    return generatedRGB;
  }

  private isRGBCloseToAnother(rgb1: number[], rgb2: number[], distanceFromOthersThreshold?: number) {
    let rDiff = Math.abs(rgb1[0] - rgb2[0]);
    let gDiff = Math.abs(rgb1[1] - rgb2[1]);
    let bDiff = Math.abs(rgb1[2] - rgb2[2]);
    let distanceThresholdToUse = distanceFromOthersThreshold != null ? distanceFromOthersThreshold : this.defaultColorDistanceThresholdOthers;
    return (rDiff + gDiff + bDiff) <= distanceThresholdToUse;
  }

  private getGeneratedRGBTimeout(timeoutIncrement: number, distanceFromOthersThreshold?: number, distanceFromWhiteOrBlackThreshold?: number) {
    if (timeoutIncrement === 0) {console.log("Color generation timed out, returning black");return [0, 0, 0];
    }
    var r = Math.floor(Math.random() * 256);
    var g = Math.floor(Math.random() * 256);
    var b = Math.floor(Math.random() * 256);
    let rgb = [r, g, b];
    if (this.isRGBCloseToAnotherGenerated(rgb, distanceFromOthersThreshold) || this.isTooCloseToWhiteOrBlack(rgb, distanceFromWhiteOrBlackThreshold)) {timeoutIncrement--;rgb = this.getGeneratedRGBTimeout(timeoutIncrement, distanceFromOthersThreshold);
    }
    return rgb;
  }

  private isTooCloseToWhiteOrBlack(rgb: number[], distanceFromWhiteOrBlackThreshold?: number) {
    let luminance = (0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2]);
    let distanceFromWhiteOrBlackToUse = distanceFromWhiteOrBlackThreshold != null ? distanceFromWhiteOrBlackThreshold : this.defaultColorDistanceThresholdFromWhiteOrBlack;
    if ((255 - luminance) <= distanceFromWhiteOrBlackToUse || Math.abs(0 - luminance) <= distanceFromWhiteOrBlackToUse) {return true;
    }
    return false;
  }

  private isRGBCloseToAnotherGenerated(rgb: number[], distanceFromOthersThreshold?: number) {
    for (let colorsAlreadySet of this.colorsOrdered) {if (this.isRGBCloseToAnother(colorsAlreadySet, rgb, distanceFromOthersThreshold)) {  return true;}
    }
    return false;
  }
}
