# الدليل الكامل لنشر تطبيق AchriDZ (الخيار أ - 69 ولاية) على Google Play Store 🇩🇿

---

## 1. معلومات الحزمة الرسمية للأندرويد
- **Application ID (معرّف الحزمة)**: `dz.achridz.marketplace`
- **اسم التطبيق على المتجر**: `AchriDZ - سوق المستعمل في الجزائر`
- **النسخة الحالية**: `1.0.0` (`versionCode: 1`)
- **الفئة على Google Play**: `Shopping / Marketplace` (التسوق / الأسواق المحلية)

---

## 2. توافق سياسة Google Play مع رسوم نشر الإعلان 200 دج (CCP / BaridiMob)
وفقًا لـ **سياسة دفع Google Play (Google Play Payments Policy)**:
- السلع أو الخدمات المادية والإعلانات المبوبة للمنتجات المادية المستعملة (Classifieds for Physical Goods) **معفاة** من نظام Google Play Billing الإلزامي.
- يمكنك استقبال رسوم نشر الإعلان **200 دج ثابتة** مباشرة عبر **بريد الجزائر CCP** أو تطبيق **BaridiMob** ورفع إيصال الدفع للمراجعة الإدارية.
- **تنبيه للحساب التجريبي لمراجعي Google Play Store**:
  - عند تقديم التطبيق للمراجعة على **Google Play Console**، في قسم **App Access (صلاحيات الوصول للتطبيق)**، أضف بيانات الحساب التجريبي التالي:
    - **نوع الدخول**: رقم الهاتف + رمز OTP
    - **رقم الهاتف التجريبي**: `0661234567` (أو استخدام زر الدخول السريع **حساب تجريبي Démo** المدمج في شاشة الدخول)
    - **ملاحظة للمراجع (Reviewer Notes)**:
      > *"Demo accounts can test the full 10-step ad creation flow and submit a 200 DZD payment proof sandbox without publishing live public ads."*

---

## 3. خطوات بناء حزمة الـ Android App Bundle (`.aab`) خطوة بخطوة

### الخطوة أ: تهيئة مشروع الأندرويد عبر Capacitor
```bash
# 1. إضافة منصة الأندرويد للمشروع
npx cap add android

# 2. مزامنة ملفات الويب والأيقونات
npx cap sync android
```

### الخطوة ب: توليد مفتاح التوقيع الرقمي (Release Keystore)
افتح الطرفية (Terminal) وشغّل الأمر التالي لإنشاء ملف التوقيع الخاص بك (احتفظ به في مكان آمن ولا تنشره على GitHub):
```bash
keytool -genkey -v -keystore achridz-release-key.jks \
  -keyalg RSA -keysize 2048 -validity 10000 \
  -alias achridz_key
```

### الخطوة ج: إعداد التوقيع في `android/app/build.gradle`
أضف كتلة `signingConfigs` داخل ملف `android/app/build.gradle`:
```gradle
android {
    signingConfigs {
        release {
            storeFile file("achridz-release-key.jks")
            storePassword "YOUR_KEYSTORE_PASSWORD"
            keyAlias "achridz_key"
            keyPassword "YOUR_KEY_PASSWORD"
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled false
            proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
        }
    }
}
```

### الخطوة د: بناء حزمة `.aab` المعتمدة لمتجر Google Play
```bash
cd android
./gradlew bundleRelease
```
- ستجد ملف الحزمة الجاهز للرفع في المسار:
  `android/app/build/outputs/bundle/release/app-release.aab`

---

## 4. قائمة التحقق قبل الإرسال (Google Play Store Checklist)
- [x] **أيقونة المتجر عالية الدقة**: `public/icons/app-icon.png` (512×512 بكسل).
- [x] **صورة البانر الترويجي (Feature Graphic)**: `1024×500` بكسل تعكس الهوية المغاربية باللون الأخضر الزمردي `#0F766E` والذهبي `#D97706`.
- [x] **لقطات شاشة (Screenshots)**:
  1. الرئيسية واختيار الـ 69 ولاية جزائرية.
  2. معالج إنشاء الإعلان في 10 مراحل.
  3. شاشة رسوم النشر الإلزامية 200 دج ومعلومات حساب CCP / BaridiMob.
  4. نظام المساومة المالية والدردشة المباشرة.
  5. وضع الحساب التجريبي الآمن (Démo Account).
- [x] **سياسة الخصوصية (Privacy Policy URL)**: تنص بوضوح على عدم طلب أو تخزين أي كلمة مرور خاصة بـ CCP أو البطاقة الذهبية أو بريدي موب.
