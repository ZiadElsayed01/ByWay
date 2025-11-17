export const verifyOTPTemplate = (otp) => {
  return `
  <div style="
      background-color:#f4f4f4;
      padding:40px 0;
      font-family: Arial, sans-serif;
  ">
    <div style="
        max-width:600px;
        margin:0 auto;
        background:white;
        border-radius:10px;
        padding:40px;
        box-shadow:0 4px 15px rgba(0,0,0,0.1);
        text-align:center;
    ">

      <img 
        src="https://cdn-icons-png.flaticon.com/512/2913/2913134.png"
        alt="Password Reset"
        style="width:120px; margin-bottom:20px;"
      />

      <h1 style="color:#333; margin-bottom:10px;">
        Reset Your Password
      </h1>

      <p style="color:#555; font-size:16px; line-height:1.6;">
        You requested to reset your password.  
        Use the OTP code below to continue.
      </p>

      <div style="
        font-size:32px;
        font-weight:bold;
        letter-spacing:8px;
        margin:25px 0;
        color:#4CAF50;
      ">
        ${otp}
      </div>

      <p style="color:#555; font-size:15px; line-height:1.6;">
        This OTP is valid for <strong>10 minutes</strong>.  
        If you didn’t request a password reset, please ignore this email.
      </p>

    </div>
  </div>
  `;
};
