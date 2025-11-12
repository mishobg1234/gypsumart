# UploadThing Integration

## Конфигурация

1. UploadThing токенът е конфигуриран в `.env`:
```
UPLOADTHING_TOKEN='your_token_here'
```

2. API endpoint е на `/api/uploadthing`

3. File router е дефиниран в `src/app/api/uploadthing/core.ts` с два маршрута:
   - `productImages` - до 5 снимки, макс 4MB всяка (само за админи)
   - `imageUploader` - 1 снимка, макс 8MB (за влезли потребители)

## Използване в компоненти

### ProductImageUploader компонент

Компонентът `ProductImageUploader` се използва в admin панела за качване на снимки на продукти:

```tsx
import { ProductImageUploader } from "@/components/admin/ProductImageUploader";

function MyComponent() {
  const [images, setImages] = useState<string[]>([]);
  
  return (
    <ProductImageUploader 
      images={images} 
      onImagesChange={setImages} 
    />
  );
}
```

### Функционалности:
- Мигновено качване - снимките се качват веднага след избор без потвърждение
- Множество файлове (до 5)
- Визуализация на качените снимки с hover ефекти
- Изтриване на снимки - автоматично изтрива от UploadThing сървъра
- Spinner индикатор при изтриване на файл
- Алтернативен начин за добавяне чрез URL
- Автоматично маркиране на първата снимка като главна
- Визуален индикатор за процес на качване
- Брой качени снимки спрямо максимума

### Ограничения:
- Максимум 5 снимки на продукт
- Максимален размер на файл: 4MB
- Поддържани формати: image/* (jpg, png, gif, webp и т.н.)
- Достъп само за администратори

## Изтриване на файлове

Когато администратор изтрие снимка от продукт, файлът се изтрива и от UploadThing сървъра чрез API endpoint:

```tsx
// API: /api/uploadthing/delete
POST /api/uploadthing/delete
Body: { fileUrl: "https://utfs.io/f/..." }
```

Компонентът автоматично:
1. Проверява дали файлът е от UploadThing (съдържа "utfs.io")
2. Извиква DELETE API endpoint
3. Изтрива файла от UploadThing с UTApi
4. Премахва снимката от локалното състояние

### UTApi

Използваме `UTApi` от `uploadthing/server` за изтриване:

```ts
import { UTApi } from "uploadthing/server";

const utapi = new UTApi();
await utapi.deleteFiles(fileKey);
```

## Стилизиране

UploadThing стиловете са импортирани в `src/app/globals.css`:
```css
@import "@uploadthing/react/styles.css";
```

Компонентът използва custom appearance настройки съобразени с Tailwind и цветовата схема на проекта (amber).
