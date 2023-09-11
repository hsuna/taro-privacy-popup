import Taro from '@tarojs/taro'
import { View, Input, Button } from '@tarojs/components'
import './index.less'
import PrivacyPopup from '../../components/PrivacyPopup'
import PrivacyPopupWrap from '../../components/PrivacyPopup/wrap'

const Index = (props) => {
  const handleGetNickname= (e) => {
    // 这里在工具上有bug，请使用手机扫码来验证
    console.log('nickname is', e.detail.value)
  }
  const handleGetPhoneNumber = (e) => {
    // 这里在工具上有bug，请使用手机扫码来验证
    console.log('phone number is', e.detail.iv)
  }
  const handleChooseImage= () => {
    Taro.chooseImage({
        count: 1,
        sizeType: ['original', 'compressed'],
        sourceType: ['album', 'camera'],
        success (res) {
          // tempFilePath可以作为img标签的src属性显示图片 
          console.log('choose image is', res.tempFilePaths)
        }
    })
  }

  return (
    <View className="index">
      <View className="form-label">隐私Input：</View>
      <PrivacyPopupWrap>
          <Input className="form-input" type="nickname" placeholder="请输入昵称" onBlur={handleGetNickname} />
      </PrivacyPopupWrap>

      <View className="form-label">隐私Button：</View>
      <Button className="form-button" openType="getPhoneNumber" onGetPhoneNumber={handleGetPhoneNumber}>获取手机号码</Button>

      <View className="form-label">隐私API：</View>
      <Button className="form-button" onClick={handleChooseImage}>选择照片</Button>
      <PrivacyPopup/>
    </View>
  )
}

export default Index;