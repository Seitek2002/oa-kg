import { FC, useEffect, useState, useRef } from 'react';
import { IonButton, IonPage, IonInput, IonSpinner } from '@ionic/react';
import referralLogo from '../../assets/referralInfo/hor-logo.png';
import {
  useLazyGetCurrentUserQuery,
  useLazyOsagoRetrieveQuery,
  OsagoCheckResponse,
} from '../../services/api';
import { CompareLocaldata } from '../../helpers/CompareLocaldata';

import car from '../../assets/car.svg';
import share from '../../assets/share.svg';
import warning from '../../assets/warning.svg';

import './style.scss';
import { useTexts } from '../../context/TextsContext';
import { useLocale } from '../../context/LocaleContext';
import kyDict from '../../locales/ky.json';
import ruDict from '../../locales/ru.json';

const ReferralInfo: FC = () => {
  const { t } = useTexts();
  const { t: lt } = useLocale();
  const localData =
    localStorage.getItem('usersInfo') ||
    `{
      "id": 0,
      "firstName": "",
      "lastName": "",
      "middleName": "",
      "phoneNumber": "+996",
      "balance": "0",
      "totalIncome": "0",
      "osagoIncome": "0",
      "agentsIncome": "0",
      "osagoCount": 0,
      "agentsCount": 0,
      "referralLink": "string",
      "identificationStatus": "not_submitted"
    }`;

  const [data, setData] = useState(JSON.parse(localData));

  const [getUserInfo] = useLazyGetCurrentUserQuery();
  const [triggerOsago, { isFetching }] = useLazyOsagoRetrieveQuery();
  const [plate, setPlate] = useState('');
  const [result, setResult] = useState<{
    type: 'none' | 'success' | 'error';
    message: string;
  }>({ type: 'none', message: '' });
  const [details, setDetails] = useState<string[]>([]);
  const plateRef = useRef<HTMLIonInputElement>(null);

  const handleFetch = async () => {
    const res = await getUserInfo().unwrap();
    CompareLocaldata({
      oldData: localData,
      newData: res,
      localKey: 'usersInfo',
      setState: setData,
    });
  };

  useEffect(() => {
    handleFetch();
  }, []);

  const handleCheck = async () => {
    const current = (plateRef.current?.value as string | null) ?? plate;
    const trimmed = (current ?? '').trim();
    if (!trimmed) {
      setResult({
        type: 'error',
        message: `${ruDict['s_format_invalid']} / ${kyDict['s_format_invalid']}`,
      });
      setDetails([]);
      return;
    }

    try {
      const res = (await triggerOsago(trimmed).unwrap()) as OsagoCheckResponse;
      const has = res.hasOsago ?? res.has_osago ?? false;

      const d = res.details || {};
      const lines: string[] = [];
      if (d.startDate || d.endDate) {
        lines.push(`Период: ${d.startDate ?? ''}${d.startDate && d.endDate ? ' - ' : ''}${d.endDate ?? ''}`);
      }
      if (d.database1) lines.push(String(d.database1));
      if (d.database2) lines.push(String(d.database2));

      if (has) {
        setResult({
          type: 'success',
          message: res.status || `${ruDict['s_has_osago']} ${res.plate} / ${kyDict['s_has_osago']} ${res.plate}`,
        });
        setDetails(lines);
      } else {
        setResult({
          type: 'error',
          message: res.status || `${ruDict['s_not_found']} ${res.plate} / ${kyDict['s_not_found']} ${res.plate}`,
        });
        setDetails(lines);
      }
    } catch {
      setResult({
        type: 'error',
        message: `${ruDict['s_request_error']} / ${kyDict['s_request_error']}`,
      });
      setDetails([]);
    }
  };

  return (
    <IonPage className='referral-page'>
      <div className='referral-card'>
        <img
          src={referralLogo}
          alt={t('company_name')}
          className='referral-logo'
        />
        <div className='referral-description'>
          {lt('referral_desc_line1')}
          <br />
          {lt('referral_desc_line2')}
          <br />
          <span>{lt('referral_desc_highlight')}</span>
        </div>
        {/* <div className='referral-title'>{t('referral_title')}</div>
        <div className='referral-code'>{data?.id}</div> */}
        <p className='' style={{ fontSize: '18px', fontWeight: '500' }}>
          {lt('referral_cashback')}
        </p>

        <IonButton
          expand='block'
          className='primary-btn'
          onClick={() => {
            if (data?.authReferralLink) {
              window.location.href = data.authReferralLink;
            }
          }}
        >
          <img src={car} alt='car' />
          {lt('referral_btn_issue_other')}
        </IonButton>

        <IonButton
          expand='block'
          fill='outline'
          className='referral-btn'
          onClick={() => {
            if (navigator.share) {
              navigator.share({
                title: t('share_osago_link_title'),
                text: t('share_osago_link_text'),
                url: data.authReferralLink,
              });
            } else {
              alert(lt('web_share_not_supported'));
            }
          }}
        >
          <img src={share} alt='share' />
          {lt('referral_btn_share')}
        </IonButton>

        {/* <div className='referral-hint'>
          <img src={warning} alt='warning' />
          <span>{t('referral_instructions')}</span>
        </div> */}

        <div className='osago-check'>
          <div className='osago-title'>{lt('osago_check_title')}</div>
          <div className='osago-subtitle'>{lt('osago_check_subtitle')}</div>
          <IonInput
            ref={plateRef}
            className={`osago-input ${result.type}`}
            placeholder={lt('osago_plate_placeholder')}
            value={plate}
            onIonInput={(e) => setPlate(e.detail.value?.toUpperCase() ?? '')}
            fill='outline'
            mode='md'
          />
          <IonButton
            expand='block'
            className='osago-submit primary-btn'
            disabled={isFetching}
            onClick={handleCheck}
          >
            {isFetching && <IonSpinner name='dots' color='light' className='inline-spinner' />}
            {isFetching ? lt('osago_check_searching') : lt('osago_check_button')}
          </IonButton>
          {result.type !== 'none' && (
            <>
              <div className={`osago-result ${result.type}`}>
                {result.message}
              </div>
              {details.length > 0 && (
                <div className={`osago-details ${result.type}`}>
                  {details.map((line, i) => (
                    <div key={i}>{line}</div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        <div className='referral-hint'>
          <img src={warning} alt='warning' />
          <span style={{ fontSize: 12, color: '#7B7F88' }}>
            {lt('referral_legal_notice')}
          </span>
        </div>
      </div>
    </IonPage>
  );
};

export default ReferralInfo;
