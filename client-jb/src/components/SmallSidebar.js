import Wrapper from '../assets/wrappers/SmallSidebar'
import { FaTimes } from 'react-icons/fa'
import { useAppContext } from '../context/appContext'

import Logo from './Logo'
import NavLinks from './NavLinks'

const SmallSidebar = () => {
  const { showSidebar, toggleSidebar } = useAppContext()
  console.log('showSidebar = ' + showSidebar)
  //console.log('toggleSidebar', toggleSidebar)
  return (
    <Wrapper>
      <div
        className={
          showSidebar ? 'sidebar-container show-sidebar' : 'sidebar-container'
        }
      >
        <div className='content'>
          <button type='button' className='close-btn' onClick={toggleSidebar}>
            <FaTimes />
          </button>
          <header>
            <Logo width={175} height={75} />
          </header>
          <NavLinks toggleSidebar={toggleSidebar} />
        </div>
      </div>
    </Wrapper>
  )
}

export default SmallSidebar
