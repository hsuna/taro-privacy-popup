import { useEffect, useState } from 'react';
import { View } from '@tarojs/components';
import bus from './bus';

const PrivacyPopupWrap = (props) => {
  const { onSuccess, onFail, children } = props;

  const [needAuthorization, setNeedAuthorization] = useState(true);

  const handleTouchInput = () => {
    wx.requirePrivacyAuthorize({
      success: () => {
        setNeedAuthorization(false);
        onSuccess?.();
      },
      fail: () => {
        // 用户拒绝了隐私协议
        onFail?.();
      },
    });
  };

  useEffect(() => {
    const handleNeedAuthorization = () => {
      setNeedAuthorization(false);
    }
    if (needAuthorization) {
      if(typeof wx.getPrivacySetting === 'function') {
        wx.getPrivacySetting({
            success: res => {
              setNeedAuthorization(res.needAuthorization);
            },
        });
      } else {
        setNeedAuthorization(false);
      }
      bus.on(handleNeedAuthorization);
    }

    return () => {
      bus.off(handleNeedAuthorization);
    }
  }, [needAuthorization]);

  return needAuthorization ? <View catchTap={handleTouchInput}>{children}</View> : children;
};

export default PrivacyPopupWrap;
