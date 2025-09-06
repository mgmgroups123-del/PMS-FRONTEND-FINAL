import Empty_Report from '../../assets/Reports/Empty_Report.png'
import { FONTS } from '../../constants/ui constants'


const MaintenanceReport = () => {
  return (
    <div>
        <div className='w-full text-center mt-15 mb-20'>
            <img src={Empty_Report} alt="EmptyImg" className='w-[280px] m-auto'/>
            <h1 style={{...FONTS.large_card_subHeader}}>Maintenance report</h1>
            <p style={{...FONTS.large_card_description3}}>Maintenance cost analysis and trends coming soon.</p>
        </div>
    </div>
  )
}

export default MaintenanceReport