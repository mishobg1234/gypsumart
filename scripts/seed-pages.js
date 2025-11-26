const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function seedPages() {
  console.log("Seeding pages...");

  // About page
  await prisma.page.upsert({
    where: { slug: "about" },
    update: {},
    create: {
      title: "За нас",
      slug: "about",
      content: `
        <div class="space-y-6">
          <section>
            <h2 class="text-2xl font-bold mb-4">Добре дошли в ArtBuildShop</h2>
            <p class="text-lg">
              ArtBuildShop е водеща компания в областта на производството и монтажа на гипсови изделия.
              С над 10 години опит, ние предлагаме висококачествени продукти и професионални услуги
              за вашия дом или офис.
            </p>
          </section>

          <section>
            <h3 class="text-xl font-bold mb-3">Нашата мисия</h3>
            <p>
              Да създаваме красиви и функционални интериорни решения, които надхвърлят очакванията
              на нашите клиенти и допринасят за създаването на уникални пространства.
            </p>
          </section>

          <section>
            <h3 class="text-xl font-bold mb-3">Защо да изберете нас?</h3>
            <ul class="list-disc list-inside space-y-2">
              <li>Професионален екип от опитни майстори</li>
              <li>Висококачествени материали</li>
              <li>Индивидуален подход към всеки проект</li>
              <li>Конкурентни цени</li>
              <li>Гаранция за извършената работа</li>
            </ul>
          </section>
        </div>
      `,
      metaTitle: "За нас - ArtBuildShop",
      metaDescription: "Научете повече за ArtBuildShop - водещата компания за производство и монтаж на гипсови изделия.",
      published: true,
    },
  });

  // Privacy Policy page
  await prisma.page.upsert({
    where: { slug: "privacy" },
    update: {},
    create: {
      title: "Политика за поверителност",
      slug: "privacy",
      content: `
        <div class="space-y-6">
          <section>
            <h2 class="text-2xl font-bold mb-4">Политика за поверителност</h2>
            <p class="text-sm text-gray-600 mb-4">Последна актуализация: ${new Date().toLocaleDateString("bg-BG")}</p>
            <p>
              В ArtBuildShop зачитаме вашата поверителност и сме ангажирани с защитата на вашите
              лични данни. Тази политика за поверителност обяснява как събираме, използваме и
              защитаваме вашата информация.
            </p>
          </section>

          <section>
            <h3 class="text-xl font-bold mb-3">Събиране на данни</h3>
            <p>Ние събираме следните видове информация:</p>
            <ul class="list-disc list-inside space-y-2 mt-2">
              <li>Име и контактна информация (имейл, телефон)</li>
              <li>Адрес за доставка при поръчки</li>
              <li>Информация за използване на уебсайта</li>
            </ul>
          </section>

          <section>
            <h3 class="text-xl font-bold mb-3">Използване на данни</h3>
            <p>Вашите данни се използват за:</p>
            <ul class="list-disc list-inside space-y-2 mt-2">
              <li>Обработка на поръчки</li>
              <li>Комуникация с вас относно вашите поръчки</li>
              <li>Подобряване на нашите услуги</li>
              <li>Изпращане на промоционални материали (само с вашето съгласие)</li>
            </ul>
          </section>

          <section>
            <h3 class="text-xl font-bold mb-3">Защита на данни</h3>
            <p>
              Ние прилагаме подходящи технически и организационни мерки за защита на вашите
              лични данни срещу неоторизиран достъп, промяна или унищожаване.
            </p>
          </section>

          <section>
            <h3 class="text-xl font-bold mb-3">Вашите права</h3>
            <p>Имате право да:</p>
            <ul class="list-disc list-inside space-y-2 mt-2">
              <li>Достъпвате вашите лични данни</li>
              <li>Коригирате неточни данни</li>
              <li>Изтривате вашите данни</li>
              <li>Оттеглите съгласието си за обработка на данни</li>
            </ul>
          </section>

          <section>
            <h3 class="text-xl font-bold mb-3">Контакт</h3>
            <p>
              За въпроси относно тази политика за поверителност, моля свържете се с нас на:
              <a href="mailto:privacy@artbuildshop.com" class="text-amber-600 hover:text-amber-700">
                privacy@artbuildshop.com
              </a>
            </p>
          </section>
        </div>
      `,
      metaTitle: "Политика за поверителност - ArtBuildShop",
      metaDescription: "Прочетете нашата политика за поверителност и как защитаваме вашите лични данни.",
      published: true,
    },
  });

  // Terms of Service page
  await prisma.page.upsert({
    where: { slug: "terms" },
    update: {},
    create: {
      title: "Общи условия",
      slug: "terms",
      content: `
        <div class="space-y-6">
          <section>
            <h2 class="text-2xl font-bold mb-4">Общи условия за ползване</h2>
            <p class="text-sm text-gray-600 mb-4">Последна актуализация: ${new Date().toLocaleDateString("bg-BG")}</p>
            <p>
              Моля, прочетете внимателно тези общи условия преди да използвате нашия уебсайт
              или да правите поръчки.
            </p>
          </section>

          <section>
            <h3 class="text-xl font-bold mb-3">1. Приемане на условията</h3>
            <p>
              Използвайки този уебсайт, вие приемате да спазвате тези общи условия.
              Ако не сте съгласни с някоя част от условията, моля не използвайте нашия уебсайт.
            </p>
          </section>

          <section>
            <h3 class="text-xl font-bold mb-3">2. Поръчки</h3>
            <p>
              Всички поръчки подлежат на наличност и потвърждение от наша страна.
              Ние си запазваме правото да откажем или анулираме поръчка по всяко време.
            </p>
          </section>

          <section>
            <h3 class="text-xl font-bold mb-3">3. Цени</h3>
            <p>
              Всички цени са в евро и включват ДДС, освен ако не е посочено друго.
              Запазваме си правото да променяме цените без предизвестие.
            </p>
          </section>

          <section>
            <h3 class="text-xl font-bold mb-3">4. Доставка</h3>
            <p>
              Сроковете за доставка са индикативни и не са гарантирани. Не носим отговорност
              за забавяния, причинени от обстоятелства извън нашия контрол.
            </p>
          </section>

          <section>
            <h3 class="text-xl font-bold mb-3">5. Връщане и рекламации</h3>
            <p>
              Имате право да върнете продукти в рамките на 14 дни от получаването им,
              ако са в оригинална опаковка и неизползвани. Моля, свържете се с нас за
              инструкции относно връщането.
            </p>
          </section>

          <section>
            <h3 class="text-xl font-bold mb-3">6. Интелектуална собственост</h3>
            <p>
              Всичко съдържание на този уебсайт, включително текстове, изображения и лога,
              е собственост на ArtBuildShop и е защитено от законите за авторско право.
            </p>
          </section>

          <section>
            <h3 class="text-xl font-bold mb-3">7. Контакт</h3>
            <p>
              За въпроси относно тези общи условия, моля свържете се с нас на:
              <a href="mailto:info@artbuildshop.com" class="text-amber-600 hover:text-amber-700">
                info@artbuildshop.com
              </a>
            </p>
          </section>
        </div>
      `,
      metaTitle: "Общи условия - ArtBuildShop",
      metaDescription: "Прочетете общите условия за ползване на нашия уебсайт и услуги.",
      published: true,
    },
  });

  console.log("Pages seeded successfully!");
}

seedPages()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
