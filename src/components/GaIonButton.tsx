import React from 'react';
import { IonButton } from '@ionic/react';
import { sendGaEvent } from '../helpers/ga';

/**
 * Кнопка с автоматической отправкой события в Google Analytics
 * @param props - все стандартные пропсы IonButton
 */
type GaIonButtonProps = React.ComponentProps<typeof IonButton> & {
  gaEventName?: string;
  gaParams?: Record<string, unknown>;
  pixelEventName?: string;
  pixelParams?: Record<string, unknown>;
};
const GaIonButton: React.FC<GaIonButtonProps> = ({
  onClick,
  gaEventName,
  gaParams,
  pixelEventName,
  pixelParams,
  children,
  ...rest
}) => {
  type NativeOnClick = NonNullable<React.ComponentProps<typeof IonButton>['onClick']>;
  const handleClick = (e: Parameters<NativeOnClick>[0]) => {
    // Сначала отправляем событие в GA
    sendGaEvent(gaEventName || 'button_click', {
      label: typeof children === 'string' ? children : undefined,
      ...(gaParams || {}),
    });
    // Затем отправляем кастомное событие в Meta Pixel (если задано)
    if (pixelEventName && typeof window.fbq === 'function') {
      window.fbq('trackCustom', pixelEventName, {
        label: typeof children === 'string' ? children : undefined,
        ...(pixelParams || {}),
      });
    }
    // Затем вызываем оригинальный обработчик
    if (onClick) onClick(e);
  };

  return (
    <IonButton {...rest} onClick={handleClick}>
      {children}
    </IonButton>
  );
};

export default GaIonButton;
