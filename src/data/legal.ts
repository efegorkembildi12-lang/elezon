/* ELEZON — legal documents content. Bilingual: Russian is the legally binding
   source; English is provided for convenience. Rendered by src/pages/Legal.tsx
   as a single page with a table of contents and four anchored sections.
   Text transcribed verbatim from ELEZON_legal_RU_EN.docx. */

import type { Lang } from '../types';

export type LegalDocId = 'consent' | 'privacy' | 'cookies' | 'terms';

export interface LegalSection {
  heading?: string;
  paragraphs: string[];
}

export interface LegalDoc {
  id: LegalDocId;
  title: string;
  sections: LegalSection[];
}

export interface LegalLabels {
  eyebrow: string;
  title: string;
  back: string;
  contents: string;
}

export const LEGAL_LABELS: Record<Lang, LegalLabels> = {
  ru: {
    eyebrow: 'Правовая информация',
    title: 'Правовые документы',
    back: 'На главную',
    contents: 'Содержание',
  },
  en: {
    eyebrow: 'Legal information',
    title: 'Legal documents',
    back: 'Home',
    contents: 'Contents',
  },
};

export const LEGAL_INTRO: Record<Lang, string> = {
  ru: 'Юридически обязательной является русская версия. Английская версия приведена для удобства. Оператор: ELEZON, 121087, г. Москва, ул. Большая Филёвская, д. 4, info@elezon.ru, +7 (495) 147-47-61.',
  en: 'The Russian version is legally binding. The English version is provided for convenience. Operator: ELEZON, 4 Bolshaya Filevskaya St., Moscow, 121087, info@elezon.ru, +7 (495) 147-47-61.',
};

export const LEGAL_DOCS: Record<Lang, LegalDoc[]> = {
  ru: [
    {
      id: 'consent',
      title: 'Согласие на обработку персональных данных',
      sections: [
        {
          paragraphs: [
            'Настоящим в соответствии с Федеральным законом от 27.07.2006 № 152-ФЗ «О персональных данных» Вы свободно, своей волей и в своём интересе даёте согласие на обработку Ваших персональных данных.',
          ],
        },
        {
          paragraphs: [
            '1. Оператор: ELEZON, сайт elezon.ru, адрес: 121087, г. Москва, ул. Большая Филёвская, д. 4, адрес электронной почты: info@elezon.ru (далее — «ELEZON» / «Оператор»).',
            '2. Цели обработки: продажа товаров (оборудования) и оформление заказов; заключение и исполнение договоров; организация доставки и оплаты; обработка обращений, заявок и обратной связи; информирование о статусе заказа.',
            '3. Перечень персональных данных: фамилия, имя, отчество; адрес электронной почты; почтовый адрес доставки заказов; контактный телефон; платёжные реквизиты; при оформлении заказа на юридическое лицо — наименование организации, ИНН, должность и Ф. И. О. контактного лица.',
            '4. Перечень действий с персональными данными: сбор, запись, систематизация, накопление, хранение, уточнение (обновление, изменение), извлечение, использование, передача (предоставление) третьим лицам в объёме, необходимом для целей, указанных в п. 2, блокирование, удаление, уничтожение. Обработка осуществляется как с использованием средств автоматизации, так и без таковых.',
            '5. Передача третьим лицам: в целях исполнения заказа Ваши персональные данные могут передаваться курьерским и транспортным компаниям, а также операторам платежей — в объёме, необходимом для доставки и оплаты. Оператор обеспечивает соблюдение указанными лицами конфиденциальности и защиты персональных данных на условиях, аналогичных изложенным в Политике обработки персональных данных.',
            '6. Срок действия: согласие действует до достижения целей обработки либо до момента его отзыва. После достижения целей обработки или отзыва согласия персональные данные подлежат уничтожению, если иной срок их хранения не предусмотрен законодательством Российской Федерации.',
            '7. Отзыв согласия: Вы вправе в любой момент отозвать настоящее согласие, направив письменное уведомление по адресу: 121087, г. Москва, ул. Большая Филёвская, д. 4 с пометкой «Отзыв согласия на обработку персональных данных», либо на адрес электронной почты info@elezon.ru. Отзыв согласия влечёт удаление Вашей учётной записи на сайте elezon.ru и уничтожение записей, содержащих Ваши персональные данные, что может сделать невозможным дальнейшее пользование сервисами сайта.',
            '8. Вы подтверждаете, что ознакомлены с Политикой обработки персональных данных, размещённой на сайте elezon.ru в разделе «Политика конфиденциальности», предоставленная Вами информация является полной, точной и достоверной и относится лично к Вам.',
          ],
        },
      ],
    },
    {
      id: 'privacy',
      title: 'Политика обработки персональных данных',
      sections: [
        {
          heading: '1. Общие положения',
          paragraphs: [
            '1.1. Настоящая Политика определяет порядок обработки и защиты персональных данных пользователей сайта elezon.ru (далее — Сайт) и составлена в соответствии с Федеральным законом от 27.07.2006 № 152-ФЗ «О персональных данных».',
            '1.2. Оператором персональных данных является ELEZON (далее — Оператор), адрес: 121087, г. Москва, ул. Большая Филёвская, д. 4, адрес электронной почты: info@elezon.ru.',
            '1.3. Политика действует в отношении всех персональных данных, которые Оператор получает от пользователя при использовании Сайта, оформлении заказов, направлении заявок и обращений.',
            '1.4. Использование Сайта означает согласие пользователя с настоящей Политикой и условиями обработки его персональных данных.',
          ],
        },
        {
          heading: '2. Основные понятия',
          paragraphs: [
            '2.1. Персональные данные — любая информация, относящаяся прямо или косвенно к определённому или определяемому физическому лицу.',
            '2.2. Обработка персональных данных — любое действие (операция) с персональными данными, совершаемое с использованием средств автоматизации или без таковых.',
            '2.3. Оператор — лицо, организующее и (или) осуществляющее обработку персональных данных.',
          ],
        },
        {
          heading: '3. Цели обработки персональных данных',
          paragraphs: [
            '3.1. Оператор обрабатывает персональные данные в целях: продажи товаров (оборудования) и оформления заказов; заключения и исполнения договоров; организации доставки и приёма оплаты; обработки заявок, обращений и обратной связи; информирования пользователя о статусе заказа и условиях обслуживания.',
          ],
        },
        {
          heading: '4. Категории субъектов и перечень персональных данных',
          paragraphs: [
            '4.1. Субъекты: пользователи и клиенты Сайта, в том числе представители юридических лиц.',
            '4.2. Перечень данных: фамилия, имя, отчество; адрес электронной почты; контактный телефон; почтовый адрес доставки; платёжные реквизиты; при оформлении заказа на юридическое лицо — наименование организации, ИНН, должность и Ф. И. О. контактного лица.',
            '4.3. Оператор не обрабатывает специальные категории персональных данных и биометрические персональные данные.',
          ],
        },
        {
          heading: '5. Правовые основания обработки',
          paragraphs: [
            '5.1. Правовые основания: согласие субъекта на обработку персональных данных; договоры между Оператором и субъектом; ФЗ № 152-ФЗ и иные нормативные правовые акты Российской Федерации.',
          ],
        },
        {
          heading: '6. Порядок и условия обработки',
          paragraphs: [
            '6.1. Обработка осуществляется с согласия субъекта, а также в случаях, предусмотренных законодательством РФ.',
            '6.2. Обработка персональных данных граждан Российской Федерации (сбор, запись, систематизация, накопление, хранение) осуществляется с использованием баз данных, находящихся на территории Российской Федерации.',
            '6.3. Сроки обработки определяются достижением целей обработки, если иной срок не предусмотрен договором или законодательством РФ. По достижении целей или при отзыве согласия персональные данные подлежат уничтожению.',
            '6.4. Оператор вправе передавать персональные данные третьим лицам (курьерским и транспортным компаниям, операторам платежей) исключительно в объёме, необходимом для исполнения заказа, доставки и оплаты.',
            '6.5. Трансграничная передача персональных данных Оператором не осуществляется.',
          ],
        },
        {
          heading: '7. Использование файлов cookie',
          paragraphs: [
            '7.1. Сайт использует файлы cookie для обеспечения работы Сайта, анализа посещаемости и улучшения сервиса. Пользователь вправе отказаться от использования cookie в настройках браузера либо с помощью уведомления на Сайте.',
          ],
        },
        {
          heading: '8. Права субъекта персональных данных',
          paragraphs: [
            '8.1. Субъект вправе: получать информацию об обработке своих персональных данных; требовать их уточнения, блокирования или уничтожения; отозвать согласие на обработку; обжаловать действия Оператора в Роскомнадзоре или в судебном порядке.',
            '8.2. Для реализации прав субъект направляет запрос по адресу: 121087, г. Москва, ул. Большая Филёвская, д. 4, либо на info@elezon.ru.',
          ],
        },
        {
          heading: '9. Меры по защите персональных данных',
          paragraphs: [
            '9.1. Оператор принимает необходимые правовые, организационные и технические меры для защиты персональных данных от неправомерного доступа, уничтожения, изменения, блокирования, копирования и распространения.',
          ],
        },
        {
          heading: '10. Заключительные положения',
          paragraphs: [
            '10.1. Оператор вправе вносить изменения в настоящую Политику; новая редакция вступает в силу с момента её размещения на Сайте.',
            '10.2. Действующая редакция Политики размещена на Сайте elezon.ru.',
          ],
        },
      ],
    },
    {
      id: 'cookies',
      title: 'Уведомление об использовании файлов cookie',
      sections: [
        {
          paragraphs: [
            'Мы используем файлы cookie для обеспечения работы сайта, анализа посещаемости и улучшения сервиса. Продолжая пользоваться сайтом, вы соглашаетесь с обработкой файлов cookie. Подробнее — в Политике обработки персональных данных.',
            'Вы можете отказаться от использования файлов cookie с помощью кнопки «Отклонить» в баннере на сайте либо в настройках своего браузера. Согласие на использование cookie является добровольным и может быть отозвано в любой момент.',
          ],
        },
      ],
    },
    {
      id: 'terms',
      title: 'Пользовательское соглашение',
      sections: [
        {
          heading: '1. Общие положения',
          paragraphs: [
            '1.1. Настоящее Соглашение регулирует использование сайта elezon.ru (далее — Сайт), управляемого ELEZON (далее — Оператор), адрес: 121087, г. Москва, ул. Большая Филёвская, д. 4, эл. почта info@elezon.ru, тел. +7 (495) 147-47-61.',
            '1.2. Использование Сайта означает принятие пользователем условий настоящего Соглашения.',
          ],
        },
        {
          heading: '2. Статус информации на Сайте',
          paragraphs: [
            '2.1. Информация на Сайте (товары, характеристики, цены, наличие) носит справочный характер и не является публичной офертой (п. 1 ст. 437 Гражданского кодекса Российской Федерации).',
            '2.2. Сайт предназначен для юридических лиц и индивидуальных предпринимателей.',
          ],
        },
        {
          heading: '3. Оформление заказа',
          paragraphs: [
            '3.1. Пользователь оставляет заявку на Сайте, по телефону или по электронной почте. Точные условия (цена, наличие, доставка, оплата) согласовываются индивидуально с менеджером и фиксируются в счёте или договоре.',
            '3.2. Договор считается заключённым с момента его подписания сторонами либо оплаты счёта.',
          ],
        },
        {
          heading: '4. Персональные данные',
          paragraphs: [
            '4.1. Обработка персональных данных регулируется Политикой обработки персональных данных и Согласием на обработку персональных данных, размещёнными на Сайте.',
          ],
        },
        {
          heading: '5. Интеллектуальная собственность',
          paragraphs: [
            '5.1. Материалы Сайта принадлежат Оператору и (или) правообладателям; их использование без согласия не допускается.',
          ],
        },
        {
          heading: '6. Ответственность',
          paragraphs: [
            '6.1. Оператор не гарантирует бесперебойную работу Сайта; информация может изменяться без предварительного уведомления.',
          ],
        },
        {
          heading: '7. Заключительные положения',
          paragraphs: [
            '7.1. Оператор вправе вносить изменения в настоящее Соглашение; новая редакция вступает в силу с момента размещения на Сайте. Контакты: 121087, г. Москва, ул. Большая Филёвская, д. 4, info@elezon.ru, +7 (495) 147-47-61.',
          ],
        },
      ],
    },
  ],
  en: [
    {
      id: 'consent',
      title: 'Consent to the Processing of Personal Data',
      sections: [
        {
          paragraphs: [
            'By this document, in accordance with Federal Law No. 152-FZ of 27 July 2006 “On Personal Data”, you freely, by your own will and in your own interest, give your consent to the processing of your personal data.',
          ],
        },
        {
          paragraphs: [
            '1. Operator: ELEZON, website elezon.ru, address: 4 Bolshaya Filevskaya St., Moscow, 121087, email: info@elezon.ru (the “Operator”).',
            '2. Purposes of processing: sale of goods (equipment) and order placement; conclusion and performance of contracts; arrangement of delivery and payment; handling of requests, applications and feedback; informing you of order status.',
            '3. List of personal data: surname, first name, patronymic; email address; postal delivery address; contact telephone number; payment details; for orders placed on behalf of a legal entity — company name, INN (taxpayer number), position and full name of the contact person.',
            '4. List of actions with personal data: collection, recording, systematization, accumulation, storage, updating (renewal, modification), extraction, use, transfer (provision) to third parties to the extent necessary for the purposes specified in clause 2, blocking, deletion, destruction. Processing is carried out both with and without the use of automation tools.',
            '5. Transfer to third parties: for the purpose of order fulfilment, your personal data may be transferred to courier and transport companies, as well as to payment operators, to the extent necessary for delivery and payment. The Operator ensures that such parties maintain the confidentiality and protection of personal data on terms similar to those set out in the Personal Data Processing Policy.',
            '6. Validity period: this consent is valid until the purposes of processing are achieved or until it is withdrawn. Upon achievement of the purposes or withdrawal of consent, the personal data shall be destroyed unless a different storage period is provided for by the legislation of the Russian Federation.',
            '7. Withdrawal of consent: you may withdraw this consent at any time by sending a written notice to: 4 Bolshaya Filevskaya St., Moscow, 121087, marked “Withdrawal of consent to personal data processing”, or to info@elezon.ru. Withdrawal of consent results in the deletion of your account on elezon.ru and the destruction of records containing your personal data, which may make further use of the website’s services impossible.',
            '8. You confirm that you have read the Personal Data Processing Policy posted on elezon.ru in the “Privacy Policy” section, that the information you have provided is complete, accurate and reliable, and relates to you personally.',
          ],
        },
      ],
    },
    {
      id: 'privacy',
      title: 'Personal Data Processing Policy',
      sections: [
        {
          heading: '1. General provisions',
          paragraphs: [
            '1.1. This Policy defines the procedure for processing and protecting the personal data of users of the website elezon.ru (the “Website”) and is drawn up in accordance with Federal Law No. 152-FZ of 27 July 2006 “On Personal Data”.',
            '1.2. The operator of personal data is ELEZON (the “Operator”), address: 4 Bolshaya Filevskaya St., Moscow, 121087, email: info@elezon.ru.',
            '1.3. The Policy applies to all personal data that the Operator receives from the user when using the Website, placing orders, and submitting applications and requests.',
            '1.4. Use of the Website constitutes the user’s consent to this Policy and to the terms of processing of their personal data.',
          ],
        },
        {
          heading: '2. Key terms',
          paragraphs: [
            '2.1. Personal data — any information relating directly or indirectly to a specified or identifiable natural person.',
            '2.2. Processing of personal data — any action (operation) with personal data performed with or without the use of automation tools.',
            '2.3. Operator — a person organizing and/or carrying out the processing of personal data.',
          ],
        },
        {
          heading: '3. Purposes of processing',
          paragraphs: [
            '3.1. The Operator processes personal data for the following purposes: sale of goods (equipment) and order placement; conclusion and performance of contracts; arrangement of delivery and receipt of payment; handling of applications, requests and feedback; informing the user of order status and service terms.',
          ],
        },
        {
          heading: '4. Categories of subjects and list of personal data',
          paragraphs: [
            '4.1. Subjects: users and customers of the Website, including representatives of legal entities.',
            '4.2. List of data: surname, first name, patronymic; email address; contact telephone number; postal delivery address; payment details; for orders placed on behalf of a legal entity — company name, INN, position and full name of the contact person.',
            '4.3. The Operator does not process special categories of personal data or biometric personal data.',
          ],
        },
        {
          heading: '5. Legal grounds for processing',
          paragraphs: [
            '5.1. Legal grounds: the subject’s consent to the processing of personal data; contracts between the Operator and the subject; Federal Law No. 152-FZ and other regulatory legal acts of the Russian Federation.',
          ],
        },
        {
          heading: '6. Procedure and conditions of processing',
          paragraphs: [
            '6.1. Processing is carried out with the subject’s consent, and also in cases provided for by the legislation of the Russian Federation.',
            '6.2. The processing of personal data of citizens of the Russian Federation (collection, recording, systematization, accumulation, storage) is carried out using databases located in the territory of the Russian Federation.',
            '6.3. The processing periods are determined by the achievement of the purposes of processing, unless a different period is provided for by a contract or legislation of the Russian Federation. Upon achievement of the purposes or withdrawal of consent, personal data shall be destroyed.',
            '6.4. The Operator may transfer personal data to third parties (courier and transport companies, payment operators) solely to the extent necessary for order fulfilment, delivery and payment.',
            '6.5. The Operator does not carry out cross-border transfer of personal data.',
          ],
        },
        {
          heading: '7. Use of cookies',
          paragraphs: [
            '7.1. The Website uses cookies to ensure the operation of the Website, analyze traffic and improve the service. The user may refuse the use of cookies in their browser settings or by means of the notice on the Website.',
          ],
        },
        {
          heading: '8. Rights of the personal data subject',
          paragraphs: [
            '8.1. The subject has the right to: receive information about the processing of their personal data; demand its clarification, blocking or destruction; withdraw consent to processing; appeal the Operator’s actions to Roskomnadzor or in court.',
            '8.2. To exercise their rights, the subject sends a request to: 4 Bolshaya Filevskaya St., Moscow, 121087, or to info@elezon.ru.',
          ],
        },
        {
          heading: '9. Personal data protection measures',
          paragraphs: [
            '9.1. The Operator takes the necessary legal, organizational and technical measures to protect personal data against unlawful access, destruction, modification, blocking, copying and dissemination.',
          ],
        },
        {
          heading: '10. Final provisions',
          paragraphs: [
            '10.1. The Operator may amend this Policy; the new version takes effect upon its publication on the Website.',
            '10.2. The current version of the Policy is posted on the Website elezon.ru.',
          ],
        },
      ],
    },
    {
      id: 'cookies',
      title: 'Cookie Notice',
      sections: [
        {
          paragraphs: [
            'We use cookies to ensure the operation of the website, analyze traffic and improve the service. By continuing to use the website, you agree to the processing of cookies. Learn more in the Personal Data Processing Policy.',
            'You may refuse the use of cookies via the “Decline” button in the banner on the website or in your browser settings. Consent to the use of cookies is voluntary and may be withdrawn at any time.',
          ],
        },
      ],
    },
    {
      id: 'terms',
      title: 'Terms of Use of the Website',
      sections: [
        {
          heading: '1. General provisions',
          paragraphs: [
            '1.1. This Agreement governs the use of the website elezon.ru (the “Website”), operated by ELEZON (the “Operator”), address: 4 Bolshaya Filevskaya St., Moscow, 121087, email: info@elezon.ru, tel. +7 (495) 147-47-61.',
            '1.2. Use of the Website constitutes the user’s acceptance of this Agreement.',
          ],
        },
        {
          heading: '2. Status of information on the Website',
          paragraphs: [
            '2.1. The information on the Website (goods, specifications, prices, availability) is provided for reference only and does not constitute a public offer (clause 1 of Article 437 of the Civil Code of the Russian Federation).',
            '2.2. The Website is intended for legal entities and individual entrepreneurs.',
          ],
        },
        {
          heading: '3. Placing an order',
          paragraphs: [
            '3.1. The user submits an order request through the Website, by telephone or by email. The exact terms (price, availability, delivery, payment) are agreed individually with the manager and recorded in an invoice or contract.',
            '3.2. A contract is deemed concluded from the moment it is signed by the parties or the invoice is paid.',
          ],
        },
        {
          heading: '4. Personal data',
          paragraphs: [
            '4.1. The processing of personal data is governed by the Personal Data Processing Policy and the Consent to the processing of personal data posted on the Website.',
          ],
        },
        {
          heading: '5. Intellectual property',
          paragraphs: [
            '5.1. The materials of the Website belong to the Operator and/or rightholders; their use without consent is not permitted.',
          ],
        },
        {
          heading: '6. Liability',
          paragraphs: [
            '6.1. The Operator does not guarantee uninterrupted operation of the Website; information may be changed without prior notice.',
          ],
        },
        {
          heading: '7. Final provisions',
          paragraphs: [
            '7.1. The Operator may amend this Agreement; the new version takes effect upon publication on the Website. Contacts: 4 Bolshaya Filevskaya St., Moscow, 121087, info@elezon.ru, +7 (495) 147-47-61.',
          ],
        },
      ],
    },
  ],
};
