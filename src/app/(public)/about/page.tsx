import { CheckCircle, Award, Users, Sparkles } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-gray-50 to-gray-100 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              За нас
            </h1>
            <p className="text-xl text-gray-600">
              Вашият партньор за качествени гипсови изделия
            </p>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Нашата мисия</h2>
            <p className="text-lg text-gray-600 mb-4">
              В GypsumArt ние вярваме, че всеки детайл има значение. С години опит в производството 
              на гипсови изделия, ние се специализираме в създаването на продукти, които съчетават 
              традиционно занаятчийство с модерни технологии.
            </p>
            <p className="text-lg text-gray-600">
              Нашата мисия е да предоставим на клиентите си висококачествени гипсови изделия, 
              които добавят елегантност и стил към всеки проект – от домашни декорации до 
              мащабни строителни и реставрационни проекти.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            Нашите ценности
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {[
              {
                icon: CheckCircle,
                title: "Качество",
                description: "Използваме само най-добрите материали и технологии",
              },
              {
                icon: Award,
                title: "Майсторство",
                description: "Всяко изделие е създадено с внимание към детайла",
              },
              {
                icon: Users,
                title: "Клиентоориентираност",
                description: "Вашето удовлетворение е наш приоритет",
              },
              {
                icon: Sparkles,
                title: "Иновация",
                description: "Комбинираме традиция с модерни решения",
              },
            ].map((value, index) => {
              const Icon = value.icon;
              return (
                <div key={index} className="text-center">
                  <div className="flex items-center justify-center w-16 h-16 bg-amber-100 rounded-full mx-auto mb-4">
                    <Icon className="h-8 w-8 text-amber-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              Защо да изберете нас?
            </h2>
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-amber-600 rounded-full flex items-center justify-center text-white font-bold">
                    1
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Дългогодишен опит
                  </h3>
                  <p className="text-gray-600">
                    Повече от 15 години опит в производството и доставката на гипсови изделия
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-amber-600 rounded-full flex items-center justify-center text-white font-bold">
                    2
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Персонализирани решения
                  </h3>
                  <p className="text-gray-600">
                    Изработваме изделия по индивидуални проекти и размери
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-amber-600 rounded-full flex items-center justify-center text-white font-bold">
                    3
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Бърза доставка
                  </h3>
                  <p className="text-gray-600">
                    Гарантираме навременна доставка на всички поръчки
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-amber-600 rounded-full flex items-center justify-center text-white font-bold">
                    4
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Конкурентни цени
                  </h3>
                  <p className="text-gray-600">
                    Отлично съотношение между качество и цена
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Materials & Technology */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Материали и технология
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              Използваме висококачествен гипс и модерни производствени технологии, които 
              гарантират издръжливост и прецизност на нашите изделия.
            </p>
            <p className="text-lg text-gray-600">
              Всеки продукт преминава през стриктен контрол на качеството преди да достигне 
              до клиентите ни, осигурявайки перфектен резултат във всеки проект.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
