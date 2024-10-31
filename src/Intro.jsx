import { Html } from '@react-three/drei'
import { useAudio } from './AudioContext'

const Intro = ({ isLoaded, userClicked, handleUserClick }) => {
  const { enableAudio } = useAudio()

  const handleEnterClick = () => {
    enableAudio()
    handleUserClick()
  }

  return (
    <Html
      as="div"
      wrapperClass={`wrapper intro ${userClicked ? 'hide' : isLoaded ? 'show' : ''}`}
    >
      <button onClick={handleEnterClick}>Enter with sound</button>
    </Html>
  )
}

export default Intro
