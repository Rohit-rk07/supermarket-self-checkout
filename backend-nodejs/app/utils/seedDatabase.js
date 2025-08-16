import Product from '../models/Product.js';
import connectDB from '../database.js';
import dotenv from 'dotenv';

dotenv.config();

const sampleProducts = [
  { barcode: "1234567890123", name: "Apple", price: 1.50, category: "Fruits", stock: 100 },
  { barcode: "2345678901234", name: "Banana", price: 0.75, category: "Fruits", stock: 150 },
  { barcode: "3456789012345", name: "Orange", price: 2.00, category: "Fruits", stock: 80 },
  { barcode: "4567890123456", name: "Milk 1L", price: 3.25, category: "Dairy", stock: 50 },
  { barcode: "5678901234567", name: "Bread", price: 2.50, category: "Bakery", stock: 30 },
  { barcode: "6789012345678", name: "Eggs (12 pack)", price: 4.00, category: "Dairy", stock: 25 },
  { barcode: "7890123456789", name: "Chicken Breast 1kg", price: 8.99, category: "Meat", stock: 20 },
  { barcode: "8901234567890", name: "Rice 2kg", price: 5.50, category: "Grains", stock: 40 },
  { barcode: "9012345678901", name: "Coca Cola 500ml", price: 1.25, category: "Beverages", stock: 200 },
  { barcode: "0123456789012", name: "Chocolate Bar", price: 2.75, category: "Snacks", stock: 75 }
];

const seedDatabase = async () => {
  try {
    await connectDB();
    
    // Clear existing products
    await Product.deleteMany({});
    console.log('🗑️  Cleared existing products');
    
    // Insert sample products
    await Product.insertMany(sampleProducts);
    console.log(`✅ Added ${sampleProducts.length} sample products to database`);
    
    // Display added products
    console.log('\n📦 Products added:');
    sampleProducts.forEach(product => {
      console.log(`   ${product.barcode} - ${product.name} ($${product.price}) - ${product.category}`);
    });
    
    console.log('\n🎉 Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
