(function(){
  "use strict";

  /* ============ Broken image fallback ============ */
  const PLACEHOLDER_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400"><rect width="400" height="400" fill="#EFE4CE"/><g fill="none" stroke="#B8AD8F" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"><rect x="70" y="90" width="260" height="200" rx="16"/><circle cx="150" cy="150" r="20"/><path d="M70 250l70-70 50 50 60-80 80 100"/></g></svg>`;
  const PLACEHOLDER_IMG = 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(PLACEHOLDER_SVG);
  window.handleImgError = function(el){
    el.onerror = null;
    el.src = PLACEHOLDER_IMG;
    el.style.objectFit = 'contain';
    el.style.padding = '14%';
    el.style.opacity = '1';
    el.classList.add('loaded');
  };

  /* Fades an image in (and lets its skeleton/placeholder background show
     through) only once the real file has actually finished decoding —
     keeps card text/price rendering instantly while the image streams in. */
  window.handleImgLoad = function(el){
    el.classList.add('loaded');
  };

  /* ============ imgbb / ibb.co link normalizer ============ */
  function normalizeImageUrl(url){
    if(!url) return url;
    const trimmed = url.trim();
    let u;
    try{ u = new URL(trimmed); }catch(e){ return trimmed; }
    const host = u.hostname.replace(/^www\./,'');
    if(host === 'i.ibb.co'){ return trimmed; }
    if(host === 'ibb.co'){ return 'https://i.ibb.co' + u.pathname + u.search; }
    if(host === 'imgbb.com' && u.pathname.startsWith('/image/')){
      return 'https://i.ibb.co' + u.pathname.replace('/image', '') + u.search;
    }
    return trimmed;
  }

  /* ============ Local (non-product) keys ============ */
  const K_LANG = 'koga_lang_v1';
  const K_CART = 'koga_cart_v1';
  const DEFAULT_WHATSAPP_NUMBER = '9647508457841';
  const DEFAULT_BANNER_URL = 'https://i.ibb.co/b4XkfrW/Gray-Pink-Modern-New-Collection-Sale-Website-Shop-Blog-Banner.png';

  /* ============ Fixed category list ============ */
  const CATEGORIES = [
    {id:'women', icon:'👗', ku:'ئافرەتان', ar:'نسائي', en:'Women'},
    {id:'men', icon:'👔', ku:'پیاوان', ar:'رجالي', en:'Men'},
    {id:'accessories', icon:'👜', ku:'ئێکسسوار', ar:'إكسسوارات', en:'Accessories'},
    {id:'perfume', icon:'🧴', ku:'عەتر', ar:'عطور', en:'Perfume'},
    {id:'children', icon:'🧸', ku:'منداڵان', ar:'أطفال', en:'Children'},
    {id:'beauty', icon:'💄', ku:'جوانکاری', ar:'تجميل', en:'Beauty'},
    {id:'electronics', icon:'🔌', ku:'ئەلیکترۆنی', ar:'إلكترونيات', en:'Electronics'},
    {id:'watches', icon:'⌚', ku:'کاتژمێر', ar:'ساعات', en:'Watches'},
    {id:'cleaning', icon:'🧼', ku:'پاککەرەوە', ar:'منظفات', en:'Cleaning'},
    {id:'home', icon:'🏠', ku:'پێداویستی ماڵ', ar:'مستلزمات المنزل', en:'Home Supplies'},
    {id:'devices', icon:'📱', ku:'ئامێر', ar:'أجهزة', en:'Devices'}
  ];
  function catLabel(cat){ return cat[lang] || cat.ku; }
  function findCat(id){ return CATEGORIES.find(c => c.id === id); }

  /* ============ Translations ============ */
  const T = {
    ku: {
      navHomeText:'ماڵەوە', navOffersText:'ئۆفەر', navSearchText:'گەڕان', navCartText:'سەبەتە', navProfileText:'هەژمار',
      offersTitle:'بەشی ئۆفەر', searchTitle:'گەڕان و پۆلەکان',
      searchPlaceholder:'گەڕان...', sortLowPageText:'کەمترین نرخ', sortHighPageText:'زۆرترین نرخ', sortResetPageText:'پاکردنەوە',
      cartPageTitle:'سەبەتەی کڕین', cartTotalLabel:'کۆی گشتی', cartOrderPageText:'داواکردن لە وەتساپ', cartEmpty:'سەبەتەکەت بەتاڵه',
      profileTitle:'هەژمار', langCardTitle:'زمان',
      loginCardTitle:'چوونەژوورەوەی بەڕێوەبەر', loginEmailPh:'ئیمەیل', loginPasswordPh:'وشەی نهێنی', loginSubmitBtn:'چوونەژوورەوە',
      loginError:'ئیمەیل یان وشەی نهێنی هەڵەیه', pleaseLogin:'تکایە سەرەتا بچووە ژوورەوە',
      adminCardTitle:'بەڕێوەبەری وێبسایت', addProductBtn:'+ زیادکردنی کاڵا', logoutBtn:'دەرچوون',
      settingsCardTitle:'ڕێکخستنی فرۆشگا', lblStoreName:'ناوی فرۆشگا', lblStorePhone:'ژمارە مۆبایل (وەتساپ)',
      lblStoreBanner:'لینکی بانەری سەرەکی', lblStoreInfo:'دەقی زانیاری', settingsSaveBtn:'پاشەکەوتکردنی ڕێکخستنەکان',
      settingsSavedMsg:'ڕێکخستنەکان پاشەکەوت کران', lblCompanyFilter:'کۆمپانیا', companyFilterAllOpt:'هەموو کۆمپانیاکان',
      lblOutOfStock:'نەماوە (کۆتایی هاتووە)', oosLabel:'نەماوە',
      infoCardTitle:'زانیاری',
      infoBody:`کڕیاڕی خۆشەویست لە کاتی داواکردنی هەر کاڵایەک لە (٣-٥) ڕۆژ دەگاتە دەستت

سلام علیک
سەرەتا بەناوی خوای گەورە مەبەست لە دروستکردنی ئەم وێبسایتە بەستنەوەی کۆگانی هەرێمی کوردستانە بە بازاڕی ناوخۆ(واتا ئەم کاڵایانەی لە کۆگا هەیە پێش ئەوەی بگاتە دەستی ماڕکێت و دوکانەکان خەڵک بتوانێ بە نرخی هەرزانتر بیکڕێت) هەندێک کاڵا هەیە لەم وێبە نرخی زۆر هەرزانە هەندێکی تریش کەمێک هەرزانە بەڵام ئەم نرخە پەیوەندی بە کوالێتی ئەم کاڵایەوە نیە کە لە بازارەکان دا هەن تەنیا هۆکاری ئەمەیە قازانجی زۆر کەم دەکرێتە سەر،
وە هەر خاوەن کارێک یاخود دوکانێک دەیەوێت کاڵاکانی پێشنیار بکات بۆ ئەم وێبسایتە دەتوانێ پەیوەندیمان پێوە بکات (٠٧٥٠٨٤٥٧٨٤١) 
وە لە داهاتوودا دەمانەوێت ئەم بەرهەمانەی لە ناخۆی هەرێمی کوردستان دروست دەکرێت لەم وێبسایتە بە خەڵکی بناسێنین وەک هەریەکە لە وێبە بەناوبانگەکان،
لە ئێستادا وێبەکە کەم و کوڕی هەیە زۆر جۆری تر کاڵا ماوە دایبنێین بەڵام لە داهاتوودا ئینشلا چارەسەر دەبن هەر کەسێکیش پێشنیار یاخود پشتگیری هەیە بۆ ئەم وێبە پەیوەندیمان پێوەبکات 
(سوپاس بۆ سەردانیکردنت)`,
      formTitleAdd:'زیادکردنی کاڵا', formTitleEdit:'دەستکاریکردنی کاڵا',
      lblImages:'وێنەکانی کاڵا (لینک)', addImageBtn:'+ زیادکردنی وێنەیەکی تر',
      lblName:'ناوی کاڵا', lblCode:'کۆدی کاڵا', lblCompany:'ناوی کۆمپانیا', lblTrend:'جۆری کاڵا (ئۆرجینال / کۆپی / ماستەرکۆپی)',
      lblSpecs:'زانیاری (وەک: Brand, Color, Warranty, Capacity)', specsTitle:'زانیاری',
      lblCategory:'جۆر / پۆل', lblCategoryHint:'(دەتوانیت چەند پۆلێک هەڵبژێریت)', lblSection:'شوێنی دەرکەوتن',
      optMainText:'بەشی سەرەکی', optOffersText:'بەشی ئۆفەر',
      lblPiece:'نرخی دانه', lblCarton:'نرخی کارتۆن', lblUnits:'ژمارەی دانه له کارتۆنێکدا', lblDesc:'تێبینی / وردەکاری',
      cancelBtn:'پاشگەزبوونەوه', saveBtn:'پاشەکەوتکردن',
      newCatPlaceholder:'پۆلی نوێ...', confirmDelete:'دڵنیایت لە سڕینەوەی ئەم کاڵایه؟',
      emptyText:'هیچ کاڵایەک نییه', noResults:'هیچ ئەنجامێک نەدۆزرایەوه', loadingText:'بارکردن...',
      lblCodeD:'کۆدی کاڵا', lblCompanyD:'ناوی کۆمپانیا', lblCartonD:'نرخی کارتۆن', lblUnitsD:'دانه/کارتۆن',
      lblCatD:'جۆر', noCarton:'نییه', noValue:'نییه', uncategorized:'بێ پۆل', currency:'د.ع',
      notConnected:'پەیوەندی بە داتابەیسەوە نییه. تکایە پەیجەکە نوێ بکەرەوە.',
      dbError:'کێشەیەک لە پەیوەندیکردن بە داتابەیس ڕوویدا. تکایە دواتر هەوڵ بدەرەوە.',
      errorPrefix:'هەڵەیەک ڕوویدا: ',
      addedToCart:'زیادکرا بۆ سەبەتە', allCat:'هەموو', detailAddCartText:'زیادکردن بۆ سەبەتە',
      editBtn:'دەستکاریکردن', deleteBtn:'سڕینەوە',
      waMsgHeader:'سڵاو، دەمەوێت ئەم کاڵایانە داوا بکەم:', waMsgCode:'کۆد', waMsgName:'ناو', waMsgQty:'دانە', waMsgTotal:'کۆی گشتی',
      nameRequiredMsg:'ناو و نرخی دانه پێویستن', addingPending:'تکایە چاوەڕێ بکە، کاڵاکە هێشتا پاشەکەوت دەکرێت...'
    },
    ar: {
      navHomeText:'الرئيسية', navOffersText:'العروض', navSearchText:'بحث', navCartText:'السلة', navProfileText:'الحساب',
      offersTitle:'العروض', searchTitle:'البحث والفئات',
      searchPlaceholder:'ابحث...', sortLowPageText:'الأقل سعراً', sortHighPageText:'الأعلى سعراً', sortResetPageText:'مسح',
      cartPageTitle:'سلة المشتريات', cartTotalLabel:'الإجمالي', cartOrderPageText:'الطلب عبر واتساب', cartEmpty:'سلتك فارغة',
      profileTitle:'الحساب', langCardTitle:'اللغة',
      loginCardTitle:'دخول المسؤول', loginEmailPh:'البريد الإلكتروني', loginPasswordPh:'كلمة المرور', loginSubmitBtn:'تسجيل الدخول',
      loginError:'البريد الإلكتروني أو كلمة المرور غير صحيحة', pleaseLogin:'يرجى تسجيل الدخول أولاً',
      adminCardTitle:'إدارة الموقع', addProductBtn:'+ إضافة منتج', logoutBtn:'تسجيل الخروج',
      settingsCardTitle:'إعدادات المتجر', lblStoreName:'اسم المتجر', lblStorePhone:'رقم الموبايل (واتساب)',
      lblStoreBanner:'رابط البانر الرئيسي', lblStoreInfo:'نص المعلومات', settingsSaveBtn:'حفظ الإعدادات',
      settingsSavedMsg:'تم حفظ الإعدادات', lblCompanyFilter:'الشركة', companyFilterAllOpt:'كل الشركات',
      lblOutOfStock:'نفدت الكمية', oosLabel:'نفدت الكمية',
      infoCardTitle:'معلومات',
      infoBody:'١- عزيزي الزبون، عند طلب منتج من موقع كوگا سيصلك خلال ٣-٥ أيام.\n٢- لطلب منتج أو إضافة منتج تواصل مع الرقم 07508457841',
      formTitleAdd:'إضافة منتج', formTitleEdit:'تعديل المنتج',
      lblImages:'صور المنتج (روابط)', addImageBtn:'+ إضافة صورة أخرى',
      lblName:'اسم المنتج', lblCode:'كود المنتج', lblCompany:'اسم الشركة', lblTrend:'نوع المنتج (أصلي / تقليد / ماستر كوبي)',
      lblSpecs:'معلومات (Brand, Color, Warranty, Capacity)', specsTitle:'معلومات',
      lblCategory:'الفئة', lblCategoryHint:'(يمكنك اختيار أكثر من فئة)', lblSection:'مكان الظهور',
      optMainText:'الرئيسية', optOffersText:'العروض',
      lblPiece:'سعر القطعة', lblCarton:'سعر الكرتون', lblUnits:'عدد القطع في الكرتون', lblDesc:'ملاحظات / تفاصيل',
      cancelBtn:'إلغاء', saveBtn:'حفظ',
      newCatPlaceholder:'فئة جديدة...', confirmDelete:'هل أنت متأكد من حذف هذا المنتج؟',
      emptyText:'لا توجد منتجات', noResults:'لا توجد نتائج', loadingText:'جارٍ التحميل...',
      lblCodeD:'كود المنتج', lblCompanyD:'اسم الشركة', lblCartonD:'سعر الكرتون', lblUnitsD:'قطعة/كرتون',
      lblCatD:'الفئة', noCarton:'غير متوفر', noValue:'غير متوفر', uncategorized:'بدون فئة', currency:'د.ع',
      notConnected:'لا يوجد اتصال بقاعدة البيانات. يرجى تحديث الصفحة.',
      dbError:'حدث خطأ في الاتصال بقاعدة البيانات. يرجى المحاولة لاحقاً.',
      errorPrefix:'حدث خطأ: ',
      addedToCart:'أُضيف إلى السلة', allCat:'الكل', detailAddCartText:'إضافة إلى السلة',
      editBtn:'تعديل', deleteBtn:'حذف',
      waMsgHeader:'مرحباً، أريد طلب هذه المنتجات:', waMsgCode:'كود', waMsgName:'اسم', waMsgQty:'عدد', waMsgTotal:'الإجمالي',
      nameRequiredMsg:'الاسم وسعر القطعة مطلوبان', addingPending:'يرجى الانتظار، جارٍ حفظ المنتج...'
    },
    en: {
      navHomeText:'Home', navOffersText:'Offers', navSearchText:'Search', navCartText:'Cart', navProfileText:'Profile',
      offersTitle:'Offers', searchTitle:'Search & Categories',
      searchPlaceholder:'Search...', sortLowPageText:'Lowest price', sortHighPageText:'Highest price', sortResetPageText:'Clear',
      cartPageTitle:'Cart', cartTotalLabel:'Total', cartOrderPageText:'Order via WhatsApp', cartEmpty:'Your cart is empty',
      profileTitle:'Profile', langCardTitle:'Language',
      loginCardTitle:'Admin login', loginEmailPh:'Email', loginPasswordPh:'Password', loginSubmitBtn:'Log in',
      loginError:'Incorrect email or password', pleaseLogin:'Please log in first',
      adminCardTitle:'Site admin', addProductBtn:'+ Add product', logoutBtn:'Log out',
      settingsCardTitle:'Store settings', lblStoreName:'Store name', lblStorePhone:'Phone number (WhatsApp)',
      lblStoreBanner:'Main banner link', lblStoreInfo:'Info text', settingsSaveBtn:'Save settings',
      settingsSavedMsg:'Settings saved', lblCompanyFilter:'Company', companyFilterAllOpt:'All companies',
      lblOutOfStock:'Out of stock', oosLabel:'Out of stock',
      infoCardTitle:'Info',
      infoBody:'1- Dear customer, orders placed on the Koga website arrive within 3-5 days.\n2- To order a product or list a product, contact 07508457841',
      formTitleAdd:'Add product', formTitleEdit:'Edit product',
      lblImages:'Product images (links)', addImageBtn:'+ Add another image',
      lblName:'Product name', lblCode:'Product code', lblCompany:'Company name', lblTrend:'Product type (Original / Copy / Master Copy)',
      lblSpecs:'Specifications (Brand, Color, Warranty, Capacity)', specsTitle:'Information',
      lblCategory:'Category', lblCategoryHint:'(you can pick more than one)', lblSection:'Show in',
      optMainText:'Main', optOffersText:'Offers',
      lblPiece:'Piece price', lblCarton:'Carton price', lblUnits:'Pieces per carton', lblDesc:'Notes / details',
      cancelBtn:'Cancel', saveBtn:'Save',
      newCatPlaceholder:'New category...', confirmDelete:'Delete this product?',
      emptyText:'No products', noResults:'No results found', loadingText:'Loading...',
      lblCodeD:'Product code', lblCompanyD:'Company name', lblCartonD:'Carton price', lblUnitsD:'Pcs/carton',
      lblCatD:'Category', noCarton:'None', noValue:'None', uncategorized:'Uncategorized', currency:'IQD',
      notConnected:'No connection to the database. Please refresh the page.',
      dbError:'A database connection error occurred. Please try again later.',
      errorPrefix:'An error occurred: ',
      addedToCart:'Added to cart', allCat:'All', detailAddCartText:'Add to cart',
      editBtn:'Edit', deleteBtn:'Delete',
      waMsgHeader:'Hello, I would like to order these products:', waMsgCode:'Code', waMsgName:'Name', waMsgQty:'Qty', waMsgTotal:'Total',
      nameRequiredMsg:'Name and piece price are required', addingPending:'Please wait, the product is still being saved...'
    }
  };

  /* ============ State ============ */
  let lang = localStorage.getItem(K_LANG) || 'ku';
  if(!T[lang]) lang = 'ku';
  let currentView = 'home';

  let productsCache = [];
  let productsLoaded = false;
  let categoriesCache = [];
  let storeSettings = {};

  let homeFilter = { term:'', category:null };
  let searchFilter = { term:'', category:null, sort:null, company:'' };

  let cart = loadCart();

  let isAdmin = false;
  let firebaseReady = false;
  let auth = null, db = null, productsRef = null, categoriesRef = null, settingsRef = null;

  let editingId = null;
  let detailProductId = null;
  let toastTimer = null;

  function fmt(n){
    if(n === null || n === undefined || n === '') return null;
    return Number(n).toLocaleString('en-US');
  }
  function escapeHtml(str){
    if(str === undefined || str === null) return '';
    return String(str).replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  }
  function shuffleArray(arr){
    for(let i = arr.length - 1; i > 0; i--){
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }
  /* Perf: collapses a burst of rapid calls (e.g. every keystroke while
     typing in a search box) into a single call after the pause, so the
     grid doesn't re-filter/re-render on every character. */
  function debounce(fn, delay){
    let timer = null;
    return function(...args){
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), delay);
    };
  }

  /* ============ Price helpers ============ */
  function priceDisplay(val){
    if(val === null || val === undefined || val === '') return null;
    if(typeof val === 'string'){
      if(/[$]/.test(val)) return val;
      const num = parseFloat(val.replace(/,/g,''));
      if(!isNaN(num) && String(num) === val.trim().replace(/,/g,'')) return fmt(num) + ' ' + T[lang].currency;
      return val;
    }
    return fmt(val) + ' ' + T[lang].currency;
  }
  function priceNumeric(val){
    if(val === null || val === undefined || val === '') return 0;
    if(typeof val === 'number') return val;
    const cleaned = String(val).replace(/[^0-9.]/g,'');
    const num = parseFloat(cleaned);
    return isNaN(num) ? 0 : num;
  }

  /* ============ Product image helpers (multi-image support) ============ */
  function productImages(p){
    if(Array.isArray(p.images) && p.images.length){
      return p.images.filter(Boolean);
    }
    if(p.image) return [p.image];
    return [];
  }

  /* ============ Store settings (admin-editable, no code changes needed) ============ */
  function getWhatsappNumber(){
    return (storeSettings.phoneNumber && storeSettings.phoneNumber.trim()) || DEFAULT_WHATSAPP_NUMBER;
  }
  function getBannerUrl(){
    return (storeSettings.bannerUrl && storeSettings.bannerUrl.trim()) || DEFAULT_BANNER_URL;
  }
  function getStoreName(){
    return (storeSettings.storeName && storeSettings.storeName.trim()) || 'کۆگا';
  }
  function getInfoText(){
    return (storeSettings.infoText && storeSettings.infoText.trim()) || T[lang].infoBody;
  }
  function applySettings(){
    document.getElementById('brandName').textContent = getStoreName();
    document.getElementById('topBannerImg').src = getBannerUrl();
    document.getElementById('infoBodyText').textContent = getInfoText();
    // Prefill the admin settings form so editing starts from current live values.
    document.getElementById('settingStoreName').value = storeSettings.storeName || '';
    document.getElementById('settingPhone').value = storeSettings.phoneNumber || '';
    document.getElementById('settingBanner').value = storeSettings.bannerUrl || '';
    document.getElementById('settingInfo').value = storeSettings.infoText || '';
  }

  /* ============ "Added to cart" toast ============ */
  function showToast(message){
    const el = document.getElementById('toast');
    el.textContent = message;
    el.classList.add('show');
    if(toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { el.classList.remove('show'); }, 1600);
  }

  /* ============ Cart ============ */
  function loadCart(){
    try{
      const raw = localStorage.getItem(K_CART);
      return raw ? JSON.parse(raw) : [];
    }catch(e){ return []; }
  }
  function saveCart(){
    localStorage.setItem(K_CART, JSON.stringify(cart));
    updateCartUI();
  }
  function addToCart(product){
    const code = product.code || product.id;
    const unitPrice = priceNumeric(product.piecePrice);
    const thumb = productImages(product)[0] || '';
    const existing = cart.find(i => i.code === code);
    if(existing){ existing.qty += 1; }
    else { cart.push({ code: code, name: product.name, qty: 1, price: unitPrice, image: thumb }); }
    saveCart();
  }
  function removeFromCart(code){
    cart = cart.filter(i => i.code !== code);
    saveCart();
  }
  function cartTotalAmount(){
    return cart.reduce((s,i) => s + (Number(i.price) || 0) * i.qty, 0);
  }
  function updateCartUI(){
    const dict = T[lang];
    const count = cart.reduce((s,i) => s + i.qty, 0);
    const badge = document.getElementById('navCartBadge');
    if(count > 0){ badge.hidden = false; badge.textContent = count > 99 ? '99+' : String(count); }
    else { badge.hidden = true; }

    const total = cartTotalAmount();
    document.getElementById('cartTotalPage').textContent = fmt(total) + ' ' + dict.currency;
    document.getElementById('cartOrderBtnPage').disabled = cart.length === 0;

    const listWrap = document.getElementById('cartListPage');
    if(cart.length === 0){
      listWrap.innerHTML = `<div class="empty-state" style="padding:40px 10px;"><p>${dict.cartEmpty}</p></div>`;
      return;
    }
    listWrap.innerHTML = cart.map(item => `
      <div class="cart-item-row">
        <div class="cart-item-thumb">
          <img src="${item.image ? escapeHtml(item.image) : PLACEHOLDER_IMG}" width="58" height="58" loading="lazy" decoding="async" referrerpolicy="no-referrer" onload="handleImgLoad(this)" onerror="handleImgError(this)">
        </div>
        <div class="cart-item-details">
          <div class="cart-item-name">${escapeHtml(item.name)}</div>
          <div class="cart-item-meta">
            <span class="cart-item-price">${fmt((item.price||0)*item.qty)} ${dict.currency}</span>
            <span>×${item.qty}</span>
          </div>
        </div>
        <button class="cart-item-remove-btn" data-remove="${escapeHtml(item.code)}" aria-label="remove">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
        </button>
      </div>`).join('');
    listWrap.querySelectorAll('[data-remove]').forEach(btn => {
      btn.addEventListener('click', () => removeFromCart(btn.getAttribute('data-remove')));
    });
  }
  document.getElementById('cartOrderBtnPage').addEventListener('click', () => {
    if(cart.length === 0) return;
    const dict = T[lang];
    const lines = cart.map(i => {
      const subtotal = (Number(i.price) || 0) * i.qty;
      return `${dict.waMsgCode}: ${i.code} - ${dict.waMsgName}: ${i.name} (${dict.waMsgQty}: ${i.qty}) — ${fmt(subtotal)} ${dict.currency}`;
    });
    const totalLine = `${dict.waMsgTotal}: ${fmt(cartTotalAmount())} ${dict.currency}`;
    const message = dict.waMsgHeader + '\n' + lines.join('\n') + '\n\n' + totalLine;
    const url = 'https://wa.me/' + getWhatsappNumber() + '?text=' + encodeURIComponent(message);
    window.open(url, '_blank', 'noopener');
  });

  /* ============ View switching (bottom nav) ============ */
  function switchView(view){
    currentView = view;
    ['home','offers','search','cart','profile'].forEach(v => {
      document.getElementById('view-' + v).hidden = (v !== view);
    });
    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-view') === view);
    });
    if(view === 'offers') renderOffers();
    if(view === 'search') renderSearchPage();
    if(view === 'cart') updateCartUI();
    if(view === 'home') updateBannerVisibility();
  }
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const view = btn.getAttribute('data-view');
      if(view === 'home'){
        shuffleArray(productsCache);
        switchView('home');
        renderHome();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        switchView(view);
      }
    });
  });

  /* ============ Top banner: visible only at the absolute top of the page ============
     Only window.scrollY (clamped at 0 or below, to absorb iOS rubber-band
     overscroll) decides visibility — no direction-tracking, no threshold
     comparisons — which also removes the old flicker/jump bug that showed
     up when the page bounced at the very bottom. */
  function updateBannerVisibility(){
    const banner = document.getElementById('topBanner');
    if(!banner) return;
    if(currentView !== 'home'){ return; }
    if(window.scrollY <= 0){ banner.classList.remove('hidden'); }
    else { banner.classList.add('hidden'); }
  }
  (function initSmartScroll(){
    let ticking = false;
    window.addEventListener('scroll', () => {
      if(ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        updateBannerVisibility();
        ticking = false;
      });
    }, { passive: true });
  })();

  /* ============ i18n apply ============ */
  function applyLang(){
    const dict = T[lang];
    document.documentElement.lang = lang;
    document.documentElement.dir = 'rtl';
    const setText = (id, val) => { const el = document.getElementById(id); if(el) el.textContent = val; };

    setText('navHomeText', dict.navHomeText);
    setText('navOffersText', dict.navOffersText);
    setText('navSearchText', dict.navSearchText);
    setText('navCartText', dict.navCartText);
    setText('navProfileText', dict.navProfileText);

    document.getElementById('searchInputHome').placeholder = dict.searchPlaceholder;
    document.getElementById('searchInputPage').placeholder = dict.searchPlaceholder;
    setText('offersTitle', dict.offersTitle);
    setText('searchTitle', dict.searchTitle);
    setText('sortLowPageText', dict.sortLowPageText);
    setText('sortHighPageText', dict.sortHighPageText);
    setText('sortResetPageText', dict.sortResetPageText);

    setText('cartPageTitle', dict.cartPageTitle);
    setText('cartTotalLabel', dict.cartTotalLabel);
    setText('cartOrderPageText', dict.cartOrderPageText);

    setText('profileTitle', dict.profileTitle);
    setText('langCardTitle', dict.langCardTitle);
    setText('loginCardTitle', dict.loginCardTitle);
    document.getElementById('loginEmail').placeholder = dict.loginEmailPh;
    document.getElementById('loginPassword').placeholder = dict.loginPasswordPh;
    setText('loginSubmitBtn', dict.loginSubmitBtn);
    setText('adminCardTitle', dict.adminCardTitle);
    setText('addProductBtnProfile', dict.addProductBtn);
    setText('logoutBtnProfile', dict.logoutBtn);
    setText('settingsCardTitle', dict.settingsCardTitle);
    setText('lblStoreName', dict.lblStoreName);
    setText('lblStorePhone', dict.lblStorePhone);
    setText('lblStoreBanner', dict.lblStoreBanner);
    setText('lblStoreInfo', dict.lblStoreInfo);
    setText('settingsSaveBtn', dict.settingsSaveBtn);
    setText('lblCompanyFilter', dict.lblCompanyFilter);
    setText('companyFilterAllOpt', dict.companyFilterAllOpt);
    setText('lblOutOfStock', dict.lblOutOfStock);
    document.getElementById('settingStoreName').placeholder = dict.lblStoreName;
    setText('infoCardTitle', dict.infoCardTitle);
    document.getElementById('infoBodyText').textContent = dict.infoBody;

    document.getElementById('lblImages').textContent = dict.lblImages;
    setText('addImageBtn', dict.addImageBtn);
    document.getElementById('lblName').innerHTML = dict.lblName + ' <span class="req">*</span>';
    setText('lblCode', dict.lblCode);
    setText('lblCompany', dict.lblCompany);
    setText('lblTrend', dict.lblTrend);
    setText('lblSpecs', dict.lblSpecs);
    setText('detailSpecsTitle', dict.specsTitle);
    document.getElementById('lblCategory').innerHTML = dict.lblCategory + ' <span class="hint" id="lblCategoryHint">' + dict.lblCategoryHint + '</span>';
    setText('lblSection', dict.lblSection);
    setText('optMainText', dict.optMainText);
    setText('optOffersText', dict.optOffersText);
    document.getElementById('lblPiece').innerHTML = dict.lblPiece + ' <span class="req">*</span>';
    setText('lblCarton', dict.lblCarton);
    setText('lblUnits', dict.lblUnits);
    setText('lblDesc', dict.lblDesc);
    setText('cancelBtn', dict.cancelBtn);
    setText('saveBtn', dict.saveBtn);
    document.getElementById('newCatInput').placeholder = dict.newCatPlaceholder;

    setText('lblCodeD', dict.lblCodeD);
    setText('lblCompanyD', dict.lblCompanyD);
    setText('lblCartonD', dict.lblCartonD);
    setText('lblUnitsD', dict.lblUnitsD);
    setText('lblCatD', dict.lblCatD);
    setText('detailAddCartText', dict.detailAddCartText);
    setText('detailEditBtn', dict.editBtn);
    setText('detailDeleteBtn', dict.deleteBtn);

    document.querySelectorAll('#langRowProfile button').forEach(b => {
      b.classList.toggle('active', b.getAttribute('data-lang') === lang);
    });
    localStorage.setItem(K_LANG, lang);

    renderPills();
    updateCartUI();
    applySettings();
  }
  document.querySelectorAll('#langRowProfile button').forEach(btn => {
    btn.addEventListener('click', () => {
      lang = btn.getAttribute('data-lang');
      applyLang();
      renderHome();
      renderOffers();
      renderSearchPage();
    });
  });

  /* ============ Category pills (Home + Search page) ============ */
  function renderPills(){
    const dict = T[lang];
    const buildHtml = (activeId) => {
      let html = `<button class="cat-pill ${!activeId ? 'active' : ''}" data-cat="">${dict.allCat}</button>`;
      html += CATEGORIES.map(c => `<button class="cat-pill ${activeId === c.id ? 'active' : ''}" data-cat="${c.id}"><span class="emo">${c.icon}</span>${catLabel(c)}</button>`).join('');
      return html;
    };
    const homeWrap = document.getElementById('catPillsHome');
    homeWrap.innerHTML = buildHtml(homeFilter.category);
    homeWrap.querySelectorAll('[data-cat]').forEach(btn => {
      btn.addEventListener('click', () => {
        homeFilter.category = btn.getAttribute('data-cat') || null;
        renderPills();
        renderHome();
      });
    });
    const searchWrap = document.getElementById('catPillsSearch');
    searchWrap.innerHTML = buildHtml(searchFilter.category);
    searchWrap.querySelectorAll('[data-cat]').forEach(btn => {
      btn.addEventListener('click', () => {
        searchFilter.category = btn.getAttribute('data-cat') || null;
        renderPills();
        renderSearchPage();
      });
    });
  }

  /* ============ Card + grid rendering ============ */
  function categoryDisplayNames(p){
    const ids = p.categories && p.categories.length ? p.categories : (p.category ? [p.category] : []);
    if(!ids.length) return T[lang].uncategorized;
    return ids.map(id => { const c = findCat(id); return c ? catLabel(c) : id; }).join('، ');
  }
  function matchesCategory(p, catId){
    if(!catId) return true;
    const ids = p.categories && p.categories.length ? p.categories : (p.category ? [p.category] : []);
    return ids.includes(catId);
  }
  function matchesTerm(p, term){
    if(!term.trim()) return true;
    const q = term.trim().toLowerCase();
    return (p.name || '').toLowerCase().includes(q) ||
           (p.code || '').toLowerCase().includes(q) ||
           (p.company || '').toLowerCase().includes(q);
  }
  function matchesCompany(p, company){
    if(!company) return true;
    return (p.company || '').trim() === company;
  }

  function cardHtml(p){
    const dict = T[lang];
    const imgs = productImages(p);
    const img = imgs[0] ? escapeHtml(imgs[0]) : '';
    const oosOverlay = p.outOfStock ? `<div class="card-oos-overlay"><span>${dict.oosLabel}</span></div>` : '';
    const trendHtml = p.trend ? `<span class="card-trend">${escapeHtml(p.trend)}</span>` : '';
    return `
    <div class="card ${p.section === 'offers' ? 'is-offer' : ''}" data-view="${p.id}">
      <div class="card-media">
        <img src="${img}" alt="${escapeHtml(p.name)}" width="300" height="300" loading="lazy" decoding="async" referrerpolicy="no-referrer" class="${p.outOfStock ? 'dimmed' : ''}" onload="handleImgLoad(this)" onerror="handleImgError(this)">
        ${oosOverlay}
      </div>
      <div class="card-body">
        <div class="card-title">${escapeHtml(p.name)}</div>
        <div class="card-bottom-row">
          <div class="card-price-block">
            <div class="card-price"><span class="sym">${dict.currency}</span>${priceDisplay(p.piecePrice)}</div>
            ${trendHtml}
          </div>
          <button type="button" class="quick-add-btn" data-quickadd="${p.id}" aria-label="add to cart" ${p.outOfStock ? 'disabled' : ''}>+</button>
        </div>
      </div>
    </div>`;
  }
  function bindCardClicks(gridEl){
    gridEl.querySelectorAll('[data-view]').forEach(el => {
      el.addEventListener('click', () => openDetail(el.getAttribute('data-view')));
    });
    // Quick add-to-cart: stopPropagation keeps this from also bubbling up to
    // the card's own [data-view] click handler and opening the detail modal.
    gridEl.querySelectorAll('[data-quickadd]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const p = productsCache.find(x => x.id === btn.getAttribute('data-quickadd'));
        if(!p || p.outOfStock) return;
        addToCart(p);
        showToast(T[lang].addedToCart);
      });
    });
  }
  function emptyStateHtml(msg){
    return `<div class="empty-state">
      <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 9l1-5h16l1 5"/><path d="M4 9v10a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V9"/><path d="M9 21V13h6v8"/></svg>
      <p>${msg}</p>
    </div>`;
  }

  function renderHome(){
    const dict = T[lang];
    const grid = document.getElementById('gridHome');
    if(!firebaseReady && productsLoaded){ grid.innerHTML = emptyStateHtml(dict.dbError); return; }
    if(!productsLoaded){ grid.innerHTML = emptyStateHtml(dict.loadingText); return; }

    let list = productsCache.filter(p => matchesCategory(p, homeFilter.category) && matchesTerm(p, homeFilter.term));
    if(list.length === 0){
      grid.innerHTML = emptyStateHtml((homeFilter.term.trim() || homeFilter.category) ? dict.noResults : dict.emptyText);
      return;
    }
    grid.innerHTML = list.map(cardHtml).join('');
    bindCardClicks(grid);
  }
  const debouncedRenderHome = debounce(() => renderHome(), 250);
  document.getElementById('searchInputHome').addEventListener('input', (e) => {
    homeFilter.term = e.target.value;
    debouncedRenderHome();
  });

  function renderOffers(){
    const dict = T[lang];
    const grid = document.getElementById('gridOffers');
    if(!firebaseReady && productsLoaded){ grid.innerHTML = emptyStateHtml(dict.dbError); return; }
    if(!productsLoaded){ grid.innerHTML = emptyStateHtml(dict.loadingText); return; }
    const list = productsCache.filter(p => p.section === 'offers');
    if(list.length === 0){ grid.innerHTML = emptyStateHtml(dict.emptyText); return; }
    grid.innerHTML = list.map(cardHtml).join('');
    bindCardClicks(grid);
  }

  function renderSearchPage(){
    const dict = T[lang];
    const grid = document.getElementById('gridSearch');
    document.querySelectorAll('#view-search .sort-opt[data-sort]').forEach(btn => {
      btn.classList.toggle('selected', btn.getAttribute('data-sort') === searchFilter.sort);
    });
    if(!firebaseReady && productsLoaded){ grid.innerHTML = emptyStateHtml(dict.dbError); return; }
    if(!productsLoaded){ grid.innerHTML = emptyStateHtml(dict.loadingText); return; }

    let list = productsCache.filter(p => matchesCategory(p, searchFilter.category) && matchesTerm(p, searchFilter.term) && matchesCompany(p, searchFilter.company));
    if(searchFilter.sort === 'low'){ list = [...list].sort((a,b) => priceNumeric(a.piecePrice) - priceNumeric(b.piecePrice)); }
    else if(searchFilter.sort === 'high'){ list = [...list].sort((a,b) => priceNumeric(b.piecePrice) - priceNumeric(a.piecePrice)); }

    if(list.length === 0){
      grid.innerHTML = emptyStateHtml((searchFilter.term.trim() || searchFilter.category) ? dict.noResults : dict.emptyText);
      return;
    }
    grid.innerHTML = list.map(cardHtml).join('');
    bindCardClicks(grid);
  }
  const debouncedRenderSearchPage = debounce(() => renderSearchPage(), 250);
  document.getElementById('searchInputPage').addEventListener('input', (e) => {
    searchFilter.term = e.target.value;
    debouncedRenderSearchPage();
  });
  document.querySelectorAll('#view-search .sort-opt[data-sort]').forEach(btn => {
    btn.addEventListener('click', () => {
      const val = btn.getAttribute('data-sort');
      searchFilter.sort = (searchFilter.sort === val) ? null : val;
      renderSearchPage();
    });
  });
  document.getElementById('sortResetPage').addEventListener('click', () => {
    searchFilter = { term:'', category:null, sort:null, company:'' };
    document.getElementById('searchInputPage').value = '';
    document.getElementById('companyFilterSelect').value = '';
    renderPills();
    renderSearchPage();
  });

  /* ============ Product detail modal (with image carousel) ============ */
  function openDetail(id){
    const p = productsCache.find(x => x.id === id);
    if(!p) return;
    detailProductId = id;
    const dict = T[lang];

    const imgs = productImages(p);
    const track = document.getElementById('detailTrack');
    const dotsWrap = document.getElementById('detailDots');
    const prevBtn = document.getElementById('detailPrevBtn');
    const nextBtn = document.getElementById('detailNextBtn');
    const slides = imgs.length ? imgs : [''];
    track.innerHTML = slides.map((src, i) => `<div class="slide"><img src="${escapeHtml(src)}" width="600" height="600" loading="${i === 0 ? 'eager' : 'lazy'}" decoding="async" referrerpolicy="no-referrer" onload="handleImgLoad(this)" onerror="handleImgError(this)"></div>`).join('');
    dotsWrap.innerHTML = slides.length > 1
      ? slides.map((_, i) => `<span class="detail-dot ${i === 0 ? 'active' : ''}"></span>`).join('')
      : '';
    track.scrollLeft = 0;
    const dots = dotsWrap.querySelectorAll('.detail-dot');
    const hasMultiple = slides.length > 1;
    prevBtn.hidden = !hasMultiple;
    nextBtn.hidden = !hasMultiple;

    function currentIndex(){
      return Math.round(track.scrollLeft / track.clientWidth);
    }
    function goToSlide(idx){
      const clamped = Math.max(0, Math.min(slides.length - 1, idx));
      track.scrollTo({ left: clamped * track.clientWidth, behavior: 'smooth' });
    }
    track.onscroll = () => {
      if(dots.length === 0) return;
      const idx = currentIndex();
      dots.forEach((d, di) => d.classList.toggle('active', di === idx));
    };
    prevBtn.onclick = () => goToSlide(currentIndex() - 1);
    nextBtn.onclick = () => goToSlide(currentIndex() + 1);

    document.getElementById('detailName').textContent = p.name;
    document.getElementById('detailPiece').textContent = priceDisplay(p.piecePrice) || dict.noValue;
    document.getElementById('detailPieceLabel').textContent = dict.currency;
    document.getElementById('detailTrend').textContent = p.trend || '';
    document.getElementById('detailCarton').textContent = priceDisplay(p.cartonPrice) || dict.noCarton;
    document.getElementById('detailUnits').textContent = p.units || dict.noCarton;
    document.getElementById('detailCode').textContent = p.code || dict.noValue;
    document.getElementById('detailCompany').textContent = p.company || dict.noValue;
    document.getElementById('detailCat').textContent = categoryDisplayNames(p);
    document.getElementById('detailDesc').textContent = p.desc || '';

    const specsSection = document.getElementById('detailSpecsSection');
    const specsTable = document.getElementById('detailSpecsTable');
    const specs = Array.isArray(p.specs) ? p.specs.filter(s => s && s.label && s.value) : [];
    if(specs.length){
      specsTable.innerHTML = specs.map(s => `
        <div class="specs-row">
          <span class="specs-label">${escapeHtml(s.label)}</span>
          <span class="specs-value">${escapeHtml(s.value)}</span>
        </div>`).join('');
      specsSection.hidden = false;
    } else {
      specsTable.innerHTML = '';
      specsSection.hidden = true;
    }

    const oosBadge = document.getElementById('detailOosBadge');
    const addCartBtn = document.getElementById('detailAddCart');
    oosBadge.hidden = !p.outOfStock;
    oosBadge.textContent = dict.oosLabel;
    addCartBtn.disabled = !!p.outOfStock;
    addCartBtn.style.opacity = p.outOfStock ? '0.5' : '';

    document.getElementById('detailAdminActions').hidden = !isAdmin;
    document.getElementById('detailOverlay').classList.add('open');
  }
  document.getElementById('detailClose').addEventListener('click', () => {
    document.getElementById('detailOverlay').classList.remove('open');
  });
  document.getElementById('detailOverlay').addEventListener('click', (e) => {
    if(e.target.id === 'detailOverlay') document.getElementById('detailOverlay').classList.remove('open');
  });
  document.getElementById('detailAddCart').addEventListener('click', () => {
    const p = productsCache.find(x => x.id === detailProductId);
    if(!p || p.outOfStock) return;
    addToCart(p);
    showToast(T[lang].addedToCart);
  });
  document.getElementById('detailEditBtn').addEventListener('click', () => {
    document.getElementById('detailOverlay').classList.remove('open');
    openForm(detailProductId);
  });
  document.getElementById('detailDeleteBtn').addEventListener('click', () => {
    deleteProduct(detailProductId, () => document.getElementById('detailOverlay').classList.remove('open'));
  });

  /* ============ Admin: multi-image input rows ============ */
  function renderImageInputs(urls){
    const wrap = document.getElementById('imageInputs');
    const list = (urls && urls.length) ? urls.slice() : [''];
    wrap.innerHTML = list.map((url) => `
      <div class="image-input-row">
        <div class="image-thumb"><img src="${url ? escapeHtml(url) : PLACEHOLDER_IMG}" width="38" height="38" loading="lazy" decoding="async" referrerpolicy="no-referrer" onload="handleImgLoad(this)" onerror="handleImgError(this)"></div>
        <input type="url" class="image-url-input" placeholder="https://i.ibb.co/xxxx.jpg" value="${escapeHtml(url)}">
        <button type="button" class="image-remove-btn" data-remove-image aria-label="remove image">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
        </button>
      </div>`).join('');
    bindImageInputEvents();
  }
  function bindImageInputEvents(){
    const wrap = document.getElementById('imageInputs');
    wrap.querySelectorAll('.image-url-input').forEach(input => {
      input.addEventListener('input', () => {
        const thumb = input.closest('.image-input-row').querySelector('.image-thumb img');
        const url = normalizeImageUrl(input.value.trim());
        thumb.src = url || PLACEHOLDER_IMG;
      });
    });
    wrap.querySelectorAll('[data-remove-image]').forEach(btn => {
      btn.addEventListener('click', () => {
        const rows = wrap.querySelectorAll('.image-input-row');
        if(rows.length <= 1){
          wrap.querySelector('.image-url-input').value = '';
          wrap.querySelector('.image-thumb img').src = PLACEHOLDER_IMG;
          return;
        }
        btn.closest('.image-input-row').remove();
      });
    });
  }
  document.getElementById('addImageBtn').addEventListener('click', () => {
    const wrap = document.getElementById('imageInputs');
    const row = document.createElement('div');
    row.className = 'image-input-row';
    row.innerHTML = `
      <div class="image-thumb"><img src="${PLACEHOLDER_IMG}" width="38" height="38" decoding="async"></div>
      <input type="url" class="image-url-input" placeholder="https://i.ibb.co/xxxx.jpg" value="">
      <button type="button" class="image-remove-btn" data-remove-image aria-label="remove image">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
      </button>`;
    wrap.appendChild(row);
    bindImageInputEvents();
  });
  function getFormImages(){
    return Array.from(document.querySelectorAll('.image-url-input'))
      .map(i => normalizeImageUrl(i.value.trim()))
      .filter(Boolean);
  }

  /* ============ Admin: dynamic spec (attribute) rows — Brand, Color, Warranty, etc. ============ */
  function renderSpecInputs(specs){
    const wrap = document.getElementById('specInputs');
    const list = (specs && specs.length) ? specs : [{ label:'', value:'' }];
    wrap.innerHTML = list.map(s => `
      <div class="spec-input-row">
        <input type="text" class="spec-label-input" placeholder="Brand / Color / Warranty..." value="${escapeHtml(s.label || '')}">
        <input type="text" class="spec-value-input" placeholder="Samsung / Black / 2 years..." value="${escapeHtml(s.value || '')}">
        <button type="button" class="image-remove-btn" data-remove-spec aria-label="remove spec">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
        </button>
      </div>`).join('');
    bindSpecInputEvents();
  }
  function bindSpecInputEvents(){
    const wrap = document.getElementById('specInputs');
    wrap.querySelectorAll('[data-remove-spec]').forEach(btn => {
      btn.addEventListener('click', () => {
        const rows = wrap.querySelectorAll('.spec-input-row');
        if(rows.length <= 1){
          wrap.querySelectorAll('input').forEach(i => i.value = '');
          return;
        }
        btn.closest('.spec-input-row').remove();
      });
    });
  }
  document.getElementById('addSpecBtn').addEventListener('click', () => {
    const wrap = document.getElementById('specInputs');
    const row = document.createElement('div');
    row.className = 'spec-input-row';
    row.innerHTML = `
      <input type="text" class="spec-label-input" placeholder="Brand / Color / Warranty..." value="">
      <input type="text" class="spec-value-input" placeholder="Samsung / Black / 2 years..." value="">
      <button type="button" class="image-remove-btn" data-remove-spec aria-label="remove spec">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
      </button>`;
    wrap.appendChild(row);
    bindSpecInputEvents();
  });
  function getFormSpecs(){
    const rows = Array.from(document.querySelectorAll('.spec-input-row'));
    return rows
      .map(row => ({
        label: row.querySelector('.spec-label-input').value.trim(),
        value: row.querySelector('.spec-value-input').value.trim()
      }))
      .filter(s => s.label && s.value);
  }

  /* ============ Admin: category chips in form ============ */
  function renderFormCategoryChips(selected){
    selected = selected || [];
    const wrap = document.getElementById('fCategories');
    const fixedHtml = CATEGORIES.map(c => `<button type="button" class="chip ${selected.includes(c.id) ? 'selected' : ''}" data-cat="${c.id}"><span>${c.icon}</span>${catLabel(c)}</button>`).join('');
    const customOnes = categoriesCache.filter(name => !CATEGORIES.some(c => c.id === name));
    const customHtml = customOnes.map(name => `<button type="button" class="chip ${selected.includes(name) ? 'selected' : ''}" data-cat="${escapeHtml(name)}">${escapeHtml(name)}</button>`).join('');
    wrap.innerHTML = fixedHtml + customHtml;
    wrap.querySelectorAll('[data-cat]').forEach(btn => {
      btn.addEventListener('click', () => btn.classList.toggle('selected'));
    });
  }
  function getSelectedFormCategories(){
    return Array.from(document.querySelectorAll('#fCategories .chip.selected')).map(b => b.getAttribute('data-cat'));
  }

  /* ============ Add/Edit product form modal ============ */
  function openForm(id){
    if(!isAdmin){ alert(T[lang].pleaseLogin); return; }
    if(id && String(id).indexOf('temp_') === 0){ alert(T[lang].addingPending); return; }
    editingId = id || null;
    const dict = T[lang];
    document.getElementById('formTitle').textContent = editingId ? dict.formTitleEdit : dict.formTitleAdd;
    const form = document.getElementById('productForm');
    form.reset();
    renderImageInputs([]);
    renderFormCategoryChips([]);
    renderSpecInputs([]);
    setSection('main');

    if(editingId){
      const p = productsCache.find(x => x.id === editingId);
      if(p){
        renderImageInputs(productImages(p));
        document.getElementById('fName').value = p.name || '';
        document.getElementById('fCode').value = p.code || '';
        document.getElementById('fCompany').value = p.company || '';
        document.getElementById('fTrend').value = p.trend || '';
        const selCats = p.categories && p.categories.length ? p.categories : (p.category ? [p.category] : []);
        renderFormCategoryChips(selCats);
        renderSpecInputs(p.specs || []);
        setSection(p.section === 'offers' ? 'offers' : 'main');
        document.getElementById('fPiece').value = p.piecePrice ?? '';
        document.getElementById('fCarton').value = p.cartonPrice ?? '';
        document.getElementById('fUnits').value = p.units ?? '';
        document.getElementById('fOutOfStock').checked = !!p.outOfStock;
        document.getElementById('fDesc').value = p.desc || '';
      }
    }
    document.getElementById('formOverlay').classList.add('open');
  }
  function closeForm(){
    document.getElementById('formOverlay').classList.remove('open');
    editingId = null;
  }
  document.getElementById('formClose').addEventListener('click', closeForm);
  document.getElementById('cancelBtn').addEventListener('click', closeForm);
  document.getElementById('formOverlay').addEventListener('click', (e) => {
    if(e.target.id === 'formOverlay') closeForm();
  });
  document.getElementById('addProductBtnProfile').addEventListener('click', () => openForm(null));

  function setSection(val){
    const opts = { main: document.getElementById('optMain'), offers: document.getElementById('optOffers') };
    Object.keys(opts).forEach(key => {
      opts[key].classList.toggle('selected', key === val);
      opts[key].querySelector('input').checked = key === val;
    });
  }
  document.getElementById('optMain').addEventListener('click', () => setSection('main'));
  document.getElementById('optOffers').addEventListener('click', () => setSection('offers'));

  document.getElementById('addCatBtn').addEventListener('click', async () => {
    const dict = T[lang];
    if(!firebaseReady){ alert(dict.notConnected); return; }
    const input = document.getElementById('newCatInput');
    const name = input.value.trim();
    if(!name) return;
    const addCatBtn = document.getElementById('addCatBtn');
    addCatBtn.disabled = true;
    try{
      const currentSelection = getSelectedFormCategories();
      await addCategoryToDb(name);
      if(!categoriesCache.includes(name)) categoriesCache = [...categoriesCache, name];
      renderFormCategoryChips([...currentSelection, name]);
      input.value = '';
    }catch(err){
      alert(dict.errorPrefix + err.message);
    }finally{
      addCatBtn.disabled = false;
    }
  });

  document.getElementById('productForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const dict = T[lang];
    if(!isAdmin){ alert(dict.pleaseLogin); return; }
    if(!firebaseReady){ alert(dict.notConnected); return; }

    const section = document.querySelector('input[name="section"]:checked').value;
    const piece = document.getElementById('fPiece').value.trim();
    const carton = document.getElementById('fCarton').value.trim();
    const images = getFormImages();
    const data = {
      images: images,
      image: images[0] || '', // kept for backward compatibility with any legacy readers
      name: document.getElementById('fName').value.trim(),
      code: document.getElementById('fCode').value.trim(),
      company: document.getElementById('fCompany').value.trim(),
      trend: document.getElementById('fTrend').value.trim(),
      specs: getFormSpecs(),
      categories: getSelectedFormCategories(),
      section: section,
      piecePrice: piece,
      cartonPrice: carton || null,
      units: document.getElementById('fUnits').value ? Number(document.getElementById('fUnits').value) : null,
      outOfStock: document.getElementById('fOutOfStock').checked,
      desc: document.getElementById('fDesc').value.trim()
    };

    if(!data.name || !data.piecePrice){
      alert(dict.errorPrefix + dict.nameRequiredMsg);
      return;
    }

    const isEditing = !!editingId;
    const targetId = editingId;
    let previousEntry = null;
    let tempId = null;

    if(isEditing){
      const idx = productsCache.findIndex(p => p.id === targetId);
      if(idx > -1){
        previousEntry = { ...productsCache[idx] };
        productsCache = productsCache.map(p => p.id === targetId ? { ...p, ...data } : p);
      }
    } else {
      tempId = 'temp_' + Date.now() + '_' + Math.random().toString(16).slice(2);
      productsCache = [{ id: tempId, ...data }, ...productsCache];
    }
    renderHome(); renderOffers(); renderSearchPage();
    closeForm();

    const request = isEditing ? updateProductInDb(targetId, data) : addProductToDb(data);
    request.catch((err) => {
      if(isEditing && previousEntry){
        productsCache = productsCache.map(p => p.id === targetId ? previousEntry : p);
      } else if(tempId){
        productsCache = productsCache.filter(p => p.id !== tempId);
      }
      renderHome(); renderOffers(); renderSearchPage();
      alert(dict.errorPrefix + err.message);
    });
  });

  async function deleteProduct(id, onDone){
    const dict = T[lang];
    if(!isAdmin){ alert(dict.pleaseLogin); return; }
    if(!firebaseReady){ alert(dict.notConnected); return; }
    if(String(id).indexOf('temp_') === 0){ alert(dict.addingPending); return; }
    if(!confirm(dict.confirmDelete)) return;
    try{
      await deleteProductFromDb(id);
      if(onDone) onDone();
    }catch(err){
      alert(dict.errorPrefix + err.message);
    }
  }

  /* ============ Admin auth (Profile tab) ============ */
  function updateAuthUI(){
    document.getElementById('loginCard').hidden = isAdmin;
    document.getElementById('adminCard').hidden = !isAdmin;
    document.getElementById('settingsCard').hidden = !isAdmin;
  }
  document.getElementById('logoutBtnProfile').addEventListener('click', () => {
    if(!firebaseReady){ alert(T[lang].notConnected); return; }
    auth.signOut();
  });
  document.getElementById('loginForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const dict = T[lang];
    const errEl = document.getElementById('loginError');
    errEl.hidden = true;
    if(!firebaseReady){ alert(dict.notConnected); return; }
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    const btn = document.getElementById('loginSubmitBtn');
    btn.disabled = true;
    auth.signInWithEmailAndPassword(email, password)
      .then(() => { document.getElementById('loginForm').reset(); })
      .catch((err) => {
        console.error('Login error:', err);
        errEl.textContent = dict.loginError;
        errEl.hidden = false;
      })
      .finally(() => { btn.disabled = false; });
  });

  /* ============ Admin: store settings form (Profile tab) ============ */
  function renderCompanyFilterOptions(){
    const dict = T[lang];
    const select = document.getElementById('companyFilterSelect');
    const previousValue = select.value;
    const companies = Array.from(new Set(
      productsCache.map(p => (p.company || '').trim()).filter(Boolean)
    )).sort((a, b) => a.localeCompare(b));
    select.innerHTML = `<option value="" id="companyFilterAllOpt">${dict.companyFilterAllOpt}</option>` +
      companies.map(c => `<option value="${escapeHtml(c)}">${escapeHtml(c)}</option>`).join('');
    // Keep the admin's current selection if that company still exists in the list.
    if(companies.includes(previousValue)) select.value = previousValue;
    else { searchFilter.company = ''; }
  }
  document.getElementById('companyFilterSelect').addEventListener('change', (e) => {
    searchFilter.company = e.target.value;
    renderSearchPage();
  });

  document.getElementById('settingsForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const dict = T[lang];
    if(!isAdmin){ alert(dict.pleaseLogin); return; }
    if(!firebaseReady){ alert(dict.notConnected); return; }
    const savedMsg = document.getElementById('settingsSaved');
    savedMsg.hidden = true;
    const btn = document.getElementById('settingsSaveBtn');
    btn.disabled = true;
    const newSettings = {
      storeName: document.getElementById('settingStoreName').value.trim(),
      phoneNumber: document.getElementById('settingPhone').value.trim(),
      bannerUrl: normalizeImageUrl(document.getElementById('settingBanner').value.trim()),
      infoText: document.getElementById('settingInfo').value.trim()
    };
    settingsRef.set(newSettings)
      .then(() => {
        savedMsg.textContent = dict.settingsSavedMsg;
        savedMsg.hidden = false;
      })
      .catch((err) => { alert(dict.errorPrefix + err.message); })
      .finally(() => { btn.disabled = false; });
  });

  /* ==========================================================
     FIREBASE SETUP — Realtime Database + Authentication
     Live project: jwmla-website (unchanged — only the UI/brand changed).
  ========================================================== */
  const firebaseConfig = {
    apiKey: "AIzaSyAwi7IjiTy4iSkv03hgfT5CUR6L8OkHGek",
    authDomain: "jwmla-website.firebaseapp.com",
    databaseURL: "https://jwmla-website-default-rtdb.firebaseio.com",
    projectId: "jwmla-website",
    storageBucket: "jwmla-website.firebasestorage.app",
    messagingSenderId: "395127164111",
    appId: "1:395127164111:web:0c6431809f28ca8591bbba"
  };

  try{
    firebase.initializeApp(firebaseConfig);
    auth = firebase.auth();
    db = firebase.database();
    productsRef = db.ref('products');
    categoriesRef = db.ref('categories');
    settingsRef = db.ref('settings');
    firebaseReady = true;

    auth.onAuthStateChanged((user) => {
      isAdmin = !!user;
      updateAuthUI();
      renderHome(); renderOffers(); renderSearchPage();
      if(detailProductId && document.getElementById('detailOverlay').classList.contains('open')){
        document.getElementById('detailAdminActions').hidden = !isAdmin;
      }
    });

    productsRef.on('value', (snapshot) => {
      const val = snapshot.val() || {};
      const docs = Object.keys(val).map(key => ({ id: key, ...val[key] }));
      // Random order on every load/refresh instead of a fixed sort.
      shuffleArray(docs);
      productsCache = docs;
      productsLoaded = true;
      renderCompanyFilterOptions();
      renderHome(); renderOffers(); renderSearchPage();
    }, (err) => {
      console.error('Realtime Database products error:', err);
      productsLoaded = true;
      renderHome(); renderOffers(); renderSearchPage();
    });

    categoriesRef.on('value', (snapshot) => {
      const val = snapshot.val() || {};
      categoriesCache = Object.values(val);
    }, (err) => {
      console.error('Realtime Database categories error:', err);
    });

    settingsRef.on('value', (snapshot) => {
      storeSettings = snapshot.val() || {};
      applySettings();
    }, (err) => {
      console.error('Realtime Database settings error:', err);
    });
  }catch(err){
    console.error('Firebase failed to initialize:', err);
    firebaseReady = false;
    productsLoaded = true;
    renderHome(); renderOffers(); renderSearchPage();
  }

  /* ============ Realtime Database: write helpers ============ */
  function addProductToDb(data){
    return productsRef.push({
      ...data,
      createdAt: firebase.database.ServerValue.TIMESTAMP
    });
  }
  function updateProductInDb(id, data){
    return productsRef.child(id).update(data);
  }
  function deleteProductFromDb(id){
    return productsRef.child(id).remove();
  }
  function addCategoryToDb(name){
    const safeKey = name.replace(/[.#$\[\]/]/g, '_');
    return categoriesRef.child(safeKey).set(name);
  }

  /* ============ Init ============ */
  applyLang();
  updateCartUI();
  switchView('home');
  renderHome();
})();
