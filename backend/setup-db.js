const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function setupDatabase() {
  // Cấu hình kết nối đến MySQL (không có database)
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || '',
  });

  try {
    // Tạo database nếu chưa tồn tại
    const dbName = process.env.DB_NAME || 'tankfire';
    await connection.execute(`CREATE DATABASE IF NOT EXISTS ${dbName}`);
    console.log(`✓ Database '${dbName}' created/already exists`);

    // Chọn database
    await connection.execute(`USE ${dbName}`);

    // Đọc schema.sql
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf-8');

    // Chạy schema (split by ; để tách các câu lệnh)
    const statements = schema.split(';').filter(s => s.trim());
    for (const statement of statements) {
      if (statement.trim()) {
        await connection.execute(statement);
      }
    }

    console.log('✓ Database tables created successfully');
    console.log('\nDatabase setup completed!');
  } catch (error) {
    console.error('✗ Error:', error.message);
    process.exit(1);
  } finally {
    await connection.end();
  }
}

setupDatabase();
