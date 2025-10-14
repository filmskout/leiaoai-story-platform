# Shenzhen Office Image Update

## New Image Required
Please place the new Sunshine Financial Tower image in the following location:
`public/images/offices/shenzhen-office.jpg`

## Image Description
The new image shows:
- Modern glass skyscraper with curved top design
- Blue glass facade reflecting sky and cityscape
- Yellow sun logo and "Sunshine Financial Tower" branding visible
- Urban cityscape background with green vegetation
- Professional business presentation style
- Text overlay: "SUNSHINE FINANCIAL TOWER BUSINESS PRESENTATION"

## Update Process
Once the image is placed in the correct directory, run:

```bash
node -e "
const fs = require('fs');
const path = require('path');

// Read the existing office images JSON
const existingImages = JSON.parse(fs.readFileSync('./src/data/officeImages.json', 'utf8'));

// Convert the new Shenzhen image to base64
const newImagePath = './public/images/offices/shenzhen-office.jpg';
if (fs.existsSync(newImagePath)) {
  const imageBuffer = fs.readFileSync(newImagePath);
  const base64 = imageBuffer.toString('base64');
  const mimeType = 'image/jpeg';
  existingImages['shenzhen'] = \`data:\${mimeType};base64,\${base64}\`;
  
  // Write back to JSON file
  fs.writeFileSync('./src/data/officeImages.json', JSON.stringify(existingImages, null, 2));
  console.log('Updated Shenzhen office image to Sunshine Financial Tower');
  console.log(\`New image size: \${Math.round(base64.length / 1024)}KB\`);
  
  // Remove the original image file
  fs.unlinkSync(newImagePath);
  console.log('Removed original image file');
} else {
  console.log('New Shenzhen image not found at:', newImagePath);
}
"
```

## Expected Result
- Shenzhen office card will display the new Sunshine Financial Tower image
- Image will be converted to base64 for optimal performance
- Click-through functionality to maps will be preserved
- Responsive design will be maintained
