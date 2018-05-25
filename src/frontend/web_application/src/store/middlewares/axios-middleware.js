import axiosMiddleware from 'redux-axios-middleware';
import { createNotification, NOTIFICATION_TYPE_ERROR } from 'react-redux-notify';
import getClient from '../../services/api-client';
import { getSignatureHeaders } from '../../modules/device/services/signature';
import { getTranslator } from '../../services/i18n';

export default axiosMiddleware(getClient(), {
  returnRejectedPromiseOnError: true,
  interceptors: {
    request: [async ({ getState }, config) => {
      const [min, max] = getState().importanceLevel.range;
      const signatureHeaders = await getSignatureHeaders(config);

      return {
        ...config,
        headers: {
          ...config.headers,
          'X-Caliopen-IL': `${min};${max}`,
          ...signatureHeaders,
        },
      };
    }],
    response: [{
      error: ({ getState, dispatch }, error) => {
        // customStyles applied to Notification component
        const customStyles = {
          'has-close': 'l-notification-center__notification--has-close',
          'has-close-all': 'l-notification-center__notification--has-close-all',
          item__message: 'l-notification-center__notification-item-message',
        };
        if (error.response.status === 401) {
          const { translate: __ } = getTranslator();
          const notification = {
            message: __('auth.feedback.deauth'),
            type: NOTIFICATION_TYPE_ERROR,
            duration: 0,
            canDismiss: true,
            customStyles,
          };

          if (!getState().notifications.find(({ message }) => message === notification.message)) {
            dispatch(createNotification(notification));
          }
        }

        if (error.response.status >= 500) {
          const { translate: __ } = getTranslator();
          const notification = {
            message: __('Sorry, an unexpected error occured. developers will work hard on this error during alpha phase. Please feel free to describe us what happened.'),
            type: NOTIFICATION_TYPE_ERROR,
            duration: 0,
            canDismiss: true,
            customStyles,
          };

          if (!getState().notifications.find(({ message }) => message === notification.message)) {
            dispatch(createNotification(notification));
          }
        }

        throw error;
      },
    }],
  },
});
