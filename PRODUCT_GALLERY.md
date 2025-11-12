# Product Image Gallery

Компонент за показване на снимките на продукти със слайдър, thumbnails и lightbox preview.

## Библиотека

Използва `react-photo-view` за lightbox функционалност.

```bash
npm install react-photo-view
```

## Функционалности

### Слайдър
- Показване на главна снимка с възможност за превключване
- Navigation бутони (стрелки наляво/надясно) при hover
- Keyboard navigation (Arrow Left/Right)
- Image counter (напр. "2 / 5")

### Thumbnails
- Grid с миниатюри на всички снимки
- Active state с amber border и scale ефект
- Click за превключване на главната снимка
- Hover opacity ефекти

### Lightbox (PhotoView)
- Click на главната снимка за fullscreen преглед
- Zoom in/out функционалност
- Rotate на снимката
- Swipe navigation между снимки
- Dark overlay (90% opacity)
- Zoom icon в десния горен ъгъл при hover

### UX Features
- Keyboard navigation (Arrow keys)
- Smooth transitions
- Responsive layout
- Mobile-friendly touch gestures
- Accessibility support

## Използване

```tsx
import { ProductImageGallery } from "@/components/product/ProductImageGallery";

function ProductPage() {
  const images = [
    "https://example.com/image1.jpg",
    "https://example.com/image2.jpg",
    // ...
  ];

  return (
    <ProductImageGallery 
      images={images} 
      productName="Product Name" 
    />
  );
}
```

## Структура

- **Main Image Area**: 500px височина, object-contain за запазване на пропорции
- **Thumbnails**: 5 колони grid, 80px височина всяка
- **Navigation**: Бутони с rounded-full стил и shadow
- **Empty State**: Показва emoji и текст при липса на снимки

## Стилизиране

Custom стилове в `globals.css`:
```css
.PhotoView-Slider__BannerWrap {
  background: rgba(0, 0, 0, 0.9) !important;
}
```

## Toolbar Icons

Lightbox toolbar включва:
- Zoom In (+)
- Zoom Out (-)
- Rotate (↻)

Всички с SVG икони и hover ефекти.
