// src/screens/Screen/index.jsx
import React from 'react';
import FormLogin from '../../components/FormLogin/FormLogin';
import './style.css';

const Login = () => {
  return (
    <div className="screen">
      <div className="div-2">
        <p className="smart-farm-ASAP">
          <span className="text-wrapper-21">Smart Farm</span>
          <span className="text-wrapper-22"> ASAP</span>
        </p>

        <div className="text-wrapper-23">로그인</div>

        <div className="overlap-group-5">
          <FormLogin
            className="form-log-in-instance"
            text="이메일"
            text1="이메일을 입력하세요."
            text2="비밀번호"
            textPasswordValue="비밀번호를 입력하세요."
            text3="로그인"
          />
          </div>
      </div>
    </div>
  );
};
export default Login;
