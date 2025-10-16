import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCqt5pYzOMm0x-kxFwNEU91pRBkmEefp74",
  authDomain: "couponfollow-6dcc7.firebaseapp.com",
  projectId: "couponfollow-6dcc7",
  storageBucket: "couponfollow-6dcc7.firebasestorage.app",
  messagingSenderId: "84046592563",
  appId: "1:84046592563:web:b8455e69f0f5564fbfc146"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Sample Stores Data
const stores = [
  {
    name: "Amazon",
    logoUrl: "https://logo.clearbit.com/amazon.com",
    description: "Shop online for electronics, books, apparel, and more",
    website: "https://amazon.com"
  },
  {
    name: "Nike",
    logoUrl: "https://logo.clearbit.com/nike.com",
    description: "Athletic shoes, apparel and equipment",
    website: "https://nike.com"
  },
  {
    name: "Target",
    logoUrl: "https://logo.clearbit.com/target.com",
    description: "Expect More. Pay Less.",
    website: "https://target.com"
  },
  {
    name: "Walmart",
    logoUrl: "https://logo.clearbit.com/walmart.com",
    description: "Save Money. Live Better.",
    website: "https://walmart.com"
  },
  {
    name: "eBay",
    logoUrl: "https://logo.clearbit.com/ebay.com",
    description: "Buy & sell electronics, cars, clothing, and more",
    website: "https://ebay.com"
  },
  {
    name: "Old Navy",
    logoUrl: "https://logo.clearbit.com/oldnavy.com",
    description: "Affordable fashion for the whole family",
    website: "https://oldnavy.gap.com"
  },
  {
    name: "Adidas",
    logoUrl: "https://logo.clearbit.com/adidas.com",
    description: "Impossible is Nothing",
    website: "https://adidas.com"
  },
  {
    name: "Best Buy",
    logoUrl: "https://logo.clearbit.com/bestbuy.com",
    description: "Expert service. Unbeatable price.",
    website: "https://bestbuy.com"
  }
];

// Sample Coupons (will be created after stores)
const getCoupons = (storeId, storeName, logoUrl) => [
  {
    storeId,
    storeName,
    storeLogoUrl: logoUrl,
    title: `Get 20% Off Your Order`,
    description: `Save 20% on your entire purchase when you use this ${storeName} promo code at checkout`,
    code: "SAVE20",
    discount: "20% OFF",
    link: "",
    expiryDate: ""
  },
  {
    storeId,
    storeName,
    storeLogoUrl: logoUrl,
    title: `Free Shipping on Orders Over $50`,
    description: `Get free standard shipping when you spend $50 or more at ${storeName}`,
    code: "FREESHIP",
    discount: "FREE SHIP",
    link: "",
    expiryDate: ""
  }
];

// Seed function
async function seedDatabase() {
  console.log('🌱 Starting to seed database...\n');

  try {
    // Add stores first
    console.log('📦 Adding stores...');
    const storeIds = {};
    
    for (const store of stores) {
      const docRef = await addDoc(collection(db, 'stores'), {
        ...store,
        createdAt: serverTimestamp()
      });
      storeIds[store.name] = docRef.id;
      console.log(`✅ Added store: ${store.name}`);
    }

    console.log(`\n✅ Added ${stores.length} stores!\n`);

    // Add coupons for each store
    console.log('🎫 Adding coupons...');
    let totalCoupons = 0;

    for (const store of stores) {
      const storeId = storeIds[store.name];
      const coupons = getCoupons(storeId, store.name, store.logoUrl);
      
      for (const coupon of coupons) {
        await addDoc(collection(db, 'coupons'), {
          ...coupon,
          createdAt: serverTimestamp()
        });
        totalCoupons++;
      }
      console.log(`✅ Added coupons for: ${store.name}`);
    }

    console.log(`\n✅ Added ${totalCoupons} coupons!\n`);
    console.log('🎉 Database seeded successfully!');
    console.log('\n🚀 Now open http://localhost:5180 to see your beautiful website!\n');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

// Run seed
seedDatabase();


