/**
 * ScamGuard Pro - Native Mobile Bridge & Hardware Integrator
 * Handles Capacitor native device capabilities, Android back button,
 * haptics/vibrations, and responsive mobile adaptations.
 */

export const NativeBridge = {
  isNative: false,
  currentScreen: 'dashboard',

  init(appNavigator) {
    this.isNative = typeof window.Capacitor !== 'undefined' && window.Capacitor.isNativePlatform();

    console.log(`📱 NativeBridge initialized. Mode: ${this.isNative ? 'Native Mobile App (Capacitor)' : 'Web App / PWA'}`);

    // 1. Configure Hardware Back Button on Android
    this.setupAndroidBackButton(appNavigator);

    // 2. Configure Native Status Bar
    this.setupStatusBar();

    // 3. Listen to navigation updates
    window.addEventListener('scamguard:navigate', (e) => {
      if (e.detail && e.detail.tab) {
        this.currentScreen = e.detail.tab;
      }
    });
  },

  setupAndroidBackButton(appNavigator) {
    if (this.isNative && window.Capacitor.Plugins?.App) {
      window.Capacitor.Plugins.App.addListener('backButton', ({ canGoBack }) => {
        if (this.currentScreen !== 'dashboard') {
          // Navigate back to home dashboard
          appNavigator('dashboard');
          this.triggerHaptic('light');
        } else {
          // On main screen, minimize or exit
          window.Capacitor.Plugins.App.exitApp();
        }
      });
    }
  },

  setupStatusBar() {
    if (this.isNative && window.Capacitor.Plugins?.StatusBar) {
      try {
        window.Capacitor.Plugins.StatusBar.setBackgroundColor({ color: '#070b14' });
        window.Capacitor.Plugins.StatusBar.setStyle({ style: 'DARK' });
      } catch (err) {
        console.warn('Status bar styling unavailable:', err);
      }
    }
  },

  /**
   * Dual-mode Haptic / Vibration trigger
   * Works on both native Capacitor app and mobile web browsers
   */
  triggerHaptic(type = 'light') {
    // 1. Native Capacitor Haptics
    if (this.isNative && window.Capacitor.Plugins?.Haptics) {
      try {
        if (type === 'error' || type === 'critical') {
          window.Capacitor.Plugins.Haptics.notification({ type: 'ERROR' });
        } else if (type === 'warning') {
          window.Capacitor.Plugins.Haptics.notification({ type: 'WARNING' });
        } else {
          window.Capacitor.Plugins.Haptics.impact({ style: 'LIGHT' });
        }
        return;
      } catch (err) {
        // Fallback to web vibration
      }
    }

    // 2. Web Vibration API Fallback
    if ('vibrate' in navigator) {
      try {
        if (type === 'error' || type === 'critical') {
          navigator.vibrate([100, 50, 100, 50, 200]);
        } else if (type === 'warning') {
          navigator.vibrate([80, 40, 80]);
        } else {
          navigator.vibrate(40);
        }
      } catch (err) {
        // Ignore vibration restrictions
      }
    }
  }
};
