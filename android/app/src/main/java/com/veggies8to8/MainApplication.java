package com.veggies8to8;

import android.app.Application;

import com.BV.LinearGradient.LinearGradientPackage;
import com.centaurwarchief.smslistener.SmsListenerPackage;
import com.evollu.react.fcm.FIRMessagingPackage;
import com.facebook.CallbackManager;
import com.facebook.react.ReactApplication;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.reactnative.androidsdk.FBSDKPackage;
import com.facebook.soloader.SoLoader;
import com.microsoft.codepush.react.CodePush;
import com.oblador.vectoricons.VectorIconsPackage;

import org.devio.rn.splashscreen.SplashScreenReactPackage;

import java.util.Arrays;
import java.util.List;

import br.com.classapp.RNSensitiveInfo.RNSensitiveInfoPackage;
import co.apptailor.googlesignin.RNGoogleSigninPackage;
import ui.shine.RNShineButtonPackage;

public class MainApplication extends Application implements ReactApplication {

    private static CallbackManager mCallbackManager = CallbackManager.Factory.create();
    private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {

        @Override
        protected String getJSBundleFile() {
            return CodePush.getJSBundleFile();
        }

        @Override
        public boolean getUseDeveloperSupport() {
            return BuildConfig.DEBUG;
        }

        @Override
        protected List<ReactPackage> getPackages() {
            return Arrays.<ReactPackage>asList(
                    new MainReactPackage(),
                    new CodePush("Ca_4A1qEcixJxGe2u0h6bQ23D5fm84336266-ca4f-4462-bcb8-5c3917b54f7e", getApplicationContext(), BuildConfig.DEBUG),
                    new SmsListenerPackage(),
                    new FIRMessagingPackage(),
                    new RNShineButtonPackage(),
                    new RNGoogleSigninPackage(),
                    new FBSDKPackage(mCallbackManager),
                    new RNSensitiveInfoPackage(),
                    new LinearGradientPackage(),
                    new VectorIconsPackage(),
                    new SplashScreenReactPackage()
            );
        }

        @Override
        protected String getJSMainModuleName() {
            return "index";
        }
    };

    protected static CallbackManager getCallbackManager() {
        return mCallbackManager;
    }

    @Override
    public ReactNativeHost getReactNativeHost() {
        return mReactNativeHost;
    }

    @Override
    public void onCreate() {
        super.onCreate();
        SoLoader.init(this, /* native exopackage */ false);
    }
}
