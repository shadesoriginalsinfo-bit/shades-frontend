
import img from '@/assets//forgotPasswordSuccess.svg'
import ResultPage from '@/components/ResultPage'
import { useNavigate } from 'react-router-dom'

export default function ForgotPasswordSuccess() {
  const navigate = useNavigate()
  return (
    <ResultPage
      imgUrl={img}
      title="Reset Link Sent !!"
      descriptionLine1={`A password reset link has been sent to your registered email address. .`}
      descriptionLine2="Please check your inbox and follow the instructions to reset your password. The link will be valid for 15 minutes. If you do not receive the email, please check your spam or junk folder."
      variant="success"
      primaryAction={{
        label: 'Go to Login',
        onClick: () => navigate('/login'),
      }}
    />
  )
}
