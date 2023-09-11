import { useState, useCallback } from 'react';
import { useDidShow, useDidHide } from '@tarojs/taro';
import { View, Text, Button } from '@tarojs/components';
import './index.less'
import bus from './bus';

let privacyHandler = null;
let privacyResolves = new Set();
let closeOtherPagePopUpHooks = new Set();

if (typeof wx.onNeedPrivacyAuthorization === 'function') {
  wx.onNeedPrivacyAuthorization((resolve) => {
    console.log('💢hsuna => Taro => onNeedPrivacyAuthorization');
    if (typeof privacyHandler === 'function') {
      privacyHandler(resolve);
    }
  });
}

const closeOtherPagePopUp = (closePopUp) => {
  closeOtherPagePopUpHooks.forEach((hook) => {
    if (closePopUp !== hook) {
      hook();
    }
  });
};

const PrivacyPopup = (props) => {
  const { title = '用户隐私保护指引', auto } = props;
  const [innerShow, setInnerShow] = useState(false);

  const closePopUp = useCallback(() => {
    setInnerShow(false);
  }, []);

  useDidShow(() => {
    privacyHandler = (resolve) => {
      privacyResolves.add(resolve);
      // 额外逻辑：当前页面的隐私弹窗弹起的时候，关掉其他页面的隐私弹窗
      closeOtherPagePopUp(closePopUp);
      setInnerShow(true);
    };

    closeOtherPagePopUpHooks.add(closePopUp);

    if (auto) {
      if (typeof wx.getPrivacySetting === 'function') {
          wx.getPrivacySetting({
              success: (res) => {
                  if (res.errMsg == "getPrivacySetting:ok") {
                    setInnerShow(res.needAuthorization);
                  }
              }
          })
      }
    }
  })

  useDidHide(() => {
    closeOtherPagePopUpHooks.delete(closePopUp);
  });

  const handleOpenContract = () => {
    wx.openPrivacyContract({
      success: (res) => {
        console.log('openPrivacyContract success', res);
      },
      fail: (err) => {
        console.error('openPrivacyContract fail', err);
      },
    });
  };

  const handleAgree = () => {
    setInnerShow(false);
    // 这里同时调用多个wx隐私接口时要如何处理：让隐私弹窗保持单例，点击一次同意按钮即可让所有pending中的wx隐私接口继续执行
    privacyResolves.forEach((resolve) => {
      resolve({
        event: 'agree',
        ButtonId: 'agree-btn',
      });
    });

    privacyResolves.clear();
    bus.emit();
  };

  const handleDisagree = () => {
    setInnerShow(false);
    privacyResolves.forEach((resolve) => {
      resolve({
        event: 'disagree',
      });
    });
    privacyResolves.clear();
  };

  return innerShow ? (
    <View className="privacy">
        <View className="content">
            <View className="title">隐私保护指引</View>
            <View className="desc">
                感谢您使用本游戏，您使用本游戏前应当阅井同意<Text className="link" onClick={handleOpenContract}>《{title}》</Text>当您点击同意并开始时用产品服务时，即表示你已理解并同息该条款内容，该条款将对您产生法律约束力。如您拒绝，将无法进入小程序。
            </View>
            <View className="btns">
                <Button className="btn btn-reject" onClick={handleDisagree}>拒绝</Button>
                <Button className="btn btn-agree" id="agree-btn" openType="agreePrivacyAuthorization" onAgreePrivacyAuthorization={handleAgree}>同意</Button>
            </View>
        </View>
    </View>
  ) : null;
};

export default PrivacyPopup;
