import { useRef, useEffect } from "react";
import CosmosLogo from "../../assets/cosmos.svg";
import Close from "../../assets/close.svg";
import { Menu } from "../Menu"

type MobileSidebarProps = {
  handleCloseClick: () => void;
}

const MobileSidebar: React.FC<MobileSidebarProps> = ({ handleCloseClick }) => {
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        handleCloseClick()
      }
    }
  
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={menuRef} className='fixed z-10 xl:hidden h-screen bg-[#242424] w-60'>
      <div className='flex p-4 items-center justify-center gap-2'>
        <img src={CosmosLogo} alt='Cosmos Logo' className='w-12 h-12' />
        <p className='text-xl'>COSMOS EXPLORER</p>
        <img src={Close} alt='Close' className='w-6 h-6 cursor-pointer' onClick={handleCloseClick} />
      </div>
      <Menu/>
    </div>
  )
}

export default MobileSidebar