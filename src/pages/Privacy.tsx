/* ELEZON — Personal-data consent (privacy) page. Bilingual: the same legal text
   is shown in RU (source) or EN, picked from the active language. Linked from the
   footer "Политика конфиденциальности" / "Privacy policy". */

import { PageHero } from '../components/PageHero';
import { useGo } from '../lib/useGo';
import { useI18n } from '../i18n/I18nContext';
import type { Lang } from '../types';

const TITLE: Record<Lang, string> = {
  ru: 'Соглашение на обработку персональных данных',
  en: 'Consent to the Processing of Personal Data',
};

const HOME: Record<Lang, string> = { ru: 'Главная', en: 'Home' };

const SUB: Record<Lang, string> = {
  ru: 'Федеральный закон № 152-ФЗ «О персональных данных» от 27.07.2006 г.',
  en: 'Federal Law No. 152-FZ "On Personal Data" of 27 July 2006',
};

const BODY: Record<Lang, string[]> = {
  ru: [
    'Настоящим в соответствии с Федеральным законом № 152-ФЗ «О персональных данных» от 27.07.2006 года Вы подтверждаете свое согласие на обработку компанией ELEZON персональных данных: сбор, систематизацию, накопление, хранение, уточнение (обновление, изменение), использование, передачу исключительно в целях продажи программного обеспечения на Ваше имя, как это описано ниже, блокирование, обезличивание, уничтожение.',
    'Компания ELEZON гарантирует конфиденциальность получаемой информации. Обработка персональных данных осуществляется в целях эффективного исполнения заказов, договоров и иных обязательств, принятых компанией ELEZON в качестве обязательных к исполнению.',
    'В случае необходимости предоставления Ваших персональных данных правообладателю, дистрибьютору или реселлеру программного обеспечения в целях регистрации программного обеспечения на ваше имя, вы даёте согласие на передачу ваших персональных данных. Компания ELEZON гарантирует, что правообладатель, дистрибьютор или реселлер программного обеспечения осуществляет защиту персональных данных на условиях, аналогичных изложенным в Политике конфиденциальности персональных данных.',
    'Настоящее согласие распространяется на следующие Ваши персональные данные: фамилия, имя и отчество, адрес электронной почты, почтовый адрес доставки заказов, контактный телефон, платёжные реквизиты.',
    'Срок действия согласия является неограниченным. Вы можете в любой момент отозвать настоящее согласие, направив письменное уведомления на адрес: г. Москва, пр-д Береговой 5Ак1 с пометкой «Отзыв согласия на обработку персональных данных».',
    'Обращаем ваше внимание, что отзыв согласия на обработку персональных данных влечёт за собой удаление Вашей учётной записи с Интернет-сайта (elezon.ru), а также уничтожение записей, содержащих ваши персональные данные, в системах обработки персональных данных компании ELEZON, что может сделать невозможным пользование интернет-сервисами компании ELEZON.',
    'Гарантирую, что представленная мной информация является полной, точной и достоверной, а также что при представлении информации не нарушаются действующее законодательство Российской Федерации, законные права и интересы третьих лиц. Вся представленная информация заполнена мною в отношении себя лично.',
    'Настоящее согласие действует в течение всего периода хранения персональных данных, если иное не предусмотрено законодательством Российской Федерации.',
  ],
  en: [
    'In accordance with Federal Law No. 152-FZ "On Personal Data" of 27 July 2006, you hereby confirm your consent to the processing by ELEZON of your personal data: collection, systematisation, accumulation, storage, refinement (updating, modification), use, and transfer solely for the purpose of selling software in your name, as described below, as well as blocking, depersonalisation, and destruction.',
    'ELEZON guarantees the confidentiality of the information received. Personal data is processed for the purpose of effectively fulfilling orders, contracts, and other obligations assumed by ELEZON as binding.',
    'Should it become necessary to provide your personal data to the rightsholder, distributor, or reseller of the software in order to register the software in your name, you consent to the transfer of your personal data. ELEZON guarantees that the rightsholder, distributor, or reseller of the software protects personal data under conditions analogous to those set out in the Personal Data Privacy Policy.',
    'This consent applies to the following personal data of yours: surname, first name and patronymic, email address, postal delivery address for orders, contact telephone number, and payment details.',
    'The consent is valid for an unlimited period. You may withdraw this consent at any time by sending written notice to: Moscow, Beregovoy proezd 5A, building 1, marked "Withdrawal of consent to the processing of personal data".',
    'Please note that withdrawing consent to the processing of personal data entails the deletion of your account from the website (elezon.ru), as well as the destruction of records containing your personal data in ELEZON’s personal data processing systems, which may make it impossible to use ELEZON’s online services.',
    'I warrant that the information I have provided is complete, accurate, and reliable, and that providing it does not violate the current legislation of the Russian Federation or the lawful rights and interests of third parties. All the information provided has been entered by me about myself personally.',
    'This consent is valid throughout the entire period of personal data storage, unless otherwise provided by the legislation of the Russian Federation.',
  ],
};

export function Privacy() {
  const { lang } = useI18n();
  const go = useGo();

  return (
    <div className="rise">
      <PageHero eyebrow={HOME[lang]} title={TITLE[lang]} sub={SUB[lang]} />
      <section className="section">
        <div className="wrap" style={{ maxWidth: 820 }}>
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); go('home'); }}
            style={{ fontSize: 13.5, color: 'var(--t-muted)', textDecoration: 'none' }}
          >
            ← {HOME[lang]}
          </a>
          <div className="col" style={{ gap: 18, marginTop: 22 }}>
            {BODY[lang].map((p, i) => (
              <p key={i} style={{ margin: 0, fontSize: 15, lineHeight: 1.7, color: 'var(--t-body)' }}>{p}</p>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
