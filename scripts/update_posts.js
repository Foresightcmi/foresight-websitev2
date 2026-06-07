const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../data/posts.json');
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

data.forEach(post => {
  if (!post.tldr) {
    // Generate some extractable bullet points based on the existing description and keywords
    const bullets = [
      post.description,
      `Focus areas include: ${post.keywords ? post.keywords.slice(0, 3).join(', ') : 'home inspection safety'}.`,
      `Always have a certified professional evaluate your property to ensure compliance and safety.`
    ];
    post.tldr = bullets;
  }
});

fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
console.log('Successfully updated posts.json with tldr arrays.');
