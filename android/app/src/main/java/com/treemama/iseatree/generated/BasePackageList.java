/**
 * This class is a list of packages used in a Java application for Expo modules.
 */
package com.treemama.iseatree.generated;

import java.util.Arrays;
import java.util.List;
import org.unimodules.core.interfaces.Package;

public class BasePackageList {
  public List<Package> getPackageList() {
    return Arrays.<Package>asList(
        new expo.modules.application.ApplicationPackage(),
        new expo.modules.constants.ConstantsPackage(),
        new expo.modules.device.DevicePackage(),
        new expo.modules.errorrecovery.ErrorRecoveryPackage(),
        new expo.modules.filesystem.FileSystemPackage(),
        new expo.modules.font.FontLoaderPackage(),
        new expo.modules.imageloader.ImageLoaderPackage(),
        new expo.modules.imagemanipulator.ImageManipulatorPackage(),
        new expo.modules.keepawake.KeepAwakePackage(),
        new expo.modules.lineargradient.LinearGradientPackage(),
        new expo.modules.location.LocationPackage(),
        new expo.modules.permissions.PermissionsPackage(),
        new expo.modules.splashscreen.SplashScreenPackage(),
        new expo.modules.sqlite.SQLitePackage(),
        new expo.modules.updates.UpdatesPackage()
    );
  }
}
