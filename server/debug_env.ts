import dotenv from 'dotenv';
dotenv.config();

const uri = process.env.MONGODB_URI || 'NOT_FOUND';
if (uri === 'NOT_FOUND') {
  console.log('URI not found in env');
} else {
  const masked = uri.replace(/\/\/.*:.*@/, '//****:****@');
  console.log(`URI found: ${masked}`);
}
